import { json, error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/server/logger';
import { getJiraService, JiraError } from '$lib/server/jira';

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

	try {
		const jiraService = getJiraService(user);
		const issues = await jiraService.search(searchTerm);
		const duration = Date.now() - startTime;

		logger.info('Jira search completed successfully', {
			operation: 'jira_search',
			userId: user.id,
			username: user.username,
			searchTerm,
			resultCount: issues.length,
			duration
		});

		return json(issues);
	} catch (e) {
		if (e instanceof JiraError) {
			if (e.status === 401) {
				throw redirect(303, '/welcome?error=invalid_token');
			}
			throw error(e.status, e.message);
		}
		// Let SvelteKit handle other errors (like the one from getJiraService)
		throw e;
	}
};
