import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decrypt } from '$lib/server/crypto';
import { JIRA_SERVER_URL } from '$env/static/private';
import { logger } from '$lib/server/logger';
import { Agent } from 'https';

export const GET: RequestHandler = async ({ url, locals }) => {
	const startTime = Date.now();
	const user = locals.user;

	if (!user) {
		logger.error('Unauthorized access attempt to Jira search API', {
			operation: 'jira_search',
			url: url.pathname + url.search
		});
		throw error(401, 'Unauthorized');
	}

	if (!user.jiraApiKey) {
		logger.warn('Jira search attempted without configured API key', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username,
			url: url.pathname + url.search
		});
		throw error(400, 'Jira API key not configured');
	}

	const searchTerm = url.searchParams.get('term');
	if (!searchTerm) {
		logger.warn('Jira search attempted without search term', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username,
			url: url.pathname + url.search
		});
		throw error(400, 'Search term is required');
	}

	logger.info('Starting Jira search operation', {
		operation: 'jira_search',
		userId: user.id,
		username: user.username,
		searchTerm,
		url: url.pathname + url.search
	});

	let decryptedApiKey: string;
	try {
		decryptedApiKey = decrypt(user.jiraApiKey);
		logger.info('Successfully decrypted Jira API key', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username
		});
	} catch (decryptError) {
		logger.error('Failed to decrypt Jira API key', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username,
			error: decryptError instanceof Error ? decryptError.message : 'Unknown error'
		});
		throw error(500, 'Failed to decrypt Jira API key');
	}

		const jql = `
    (
      issuekey ~ "${searchTerm}" OR
      summary ~ "${searchTerm}" OR
      creator ~ "${searchTerm}" OR
      assignee ~ "${searchTerm}"
    )
  `;

	const jiraUrl = `${JIRA_SERVER_URL}/rest/api/2/search`;
	
	logger.logJiraRequest('search_issues', jiraUrl, {
		userId: user.id,
		username: user.username,
		searchTerm,
		jql: jql.trim()
	});

	try {
		const httpsAgent = new Agent({ rejectUnauthorized: false });
		const response = await fetch(jiraUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${decryptedApiKey}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				jql: jql,
				fields: ['summary']
			}),
			// @ts-ignore - Node.js specific option
			agent: httpsAgent
		});

		const duration = Date.now() - startTime;

		if (!response.ok) {
			const errorText = await response.text();
			logger.logJiraResponse('search_issues', jiraUrl, response.status, duration, {
				userId: user.id,
				username: user.username,
				searchTerm,
				error: errorText
			});
			throw error(response.status, `Jira API error: ${errorText}`);
		}

		logger.logJiraResponse('search_issues', jiraUrl, response.status, duration, {
			userId: user.id,
			username: user.username,
			searchTerm
		});

		const data = await response.json();

		const issues = data.issues.map((issue: any) => ({
			id: issue.key,
			title: issue.fields.summary
		}));

		logger.info('Jira search completed successfully', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username,
			searchTerm,
			resultCount: issues.length,
			duration
		});

		return json(issues);
	} catch (fetchError) {
		const duration = Date.now() - startTime;
		
		if (fetchError instanceof Error && 'status' in fetchError) {
			// This is a SvelteKit error, already logged above
			throw fetchError;
		}

		// Log detailed error information
		const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
		const errorName = fetchError instanceof Error ? fetchError.name : 'Unknown';
		const errorStack = fetchError instanceof Error ? fetchError.stack : undefined;
		
		logger.logJiraError('search_issues', jiraUrl, errorMessage, {
			userId: user.id,
			username: user.username,
			searchTerm,
			duration,
			errorName,
			errorStack: errorStack?.substring(0, 200) // Limit stack trace length
		});

		// Provide more specific error message based on error type
		if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
			throw error(500, `DNS resolution failed for Jira server: ${JIRA_SERVER_URL}`);
		} else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ECONNRESET')) {
			throw error(500, `Connection refused to Jira server: ${JIRA_SERVER_URL}`);
		} else if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
			throw error(500, `Connection timeout to Jira server: ${JIRA_SERVER_URL}`);
		} else if (errorMessage.includes('CERTIFICATE')) {
			throw error(500, `SSL certificate error with Jira server: ${JIRA_SERVER_URL}`);
		} else {
			throw error(500, `Network error connecting to Jira API: ${errorMessage}`);
		}
	}
};
