import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { encrypt } from '$lib/server/crypto';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { JIRA_SERVER_URL, BYPASS_JIRA_VALIDATION } from '$env/static/private';
import { logger } from '$lib/server/logger';
import { Agent } from 'https';
import https from 'https';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	},
	jira: async (event) => {
		const startTime = Date.now();
		const user = requireLogin();
		const formData = await event.request.formData();
		const jiraApiKey = formData.get('jira-api-key')?.toString();

		if (!jiraApiKey) {
			logger.warn('Jira API key validation attempted without key', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username
			});
			return fail(400, { error: 'Jira API key is required' });
		}

		logger.info('Starting Jira API key validation', {
			operation: 'jira_api_key_validation',
			userId: user.id,
			username: user.username
		});

		const jiraUrl = `${JIRA_SERVER_URL}/rest/api/2/myself`;
		
		logger.logJiraRequest('validate_api_key', jiraUrl, {
			userId: user.id,
			username: user.username
		});

		try {
			if (BYPASS_JIRA_VALIDATION === 'true') {
				logger.warn('Jira API validation is bypassed.', {
					operation: 'jira_api_key_validation',
					userId: user.id,
					username: user.username
				});

				const encryptedKey = encrypt(jiraApiKey);

				await db
					.update(table.user)
					.set({ jiraApiKey: encryptedKey })
					.where(eq(table.user.id, user.id));

				return { success: true };
			}
			logger.info('Creating HTTPS agent with SSL verification disabled', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username,
				jiraUrl
			});

			const httpsAgent = new Agent({ 
				rejectUnauthorized: false,
				keepAlive: true,
				timeout: 30000
			});

					logger.info('Making fetch request to Jira API', {
			operation: 'jira_api_key_validation',
			userId: user.id,
			username: user.username,
			jiraUrl,
			headers: {
				'Authorization': 'Bearer [REDACTED]',
				'Accept': 'application/json'
			}
		});

		// Use direct HTTPS request instead of fetch for better error handling
		interface HttpsResponse {
			status: number;
			ok: boolean;
			text: () => Promise<string>;
			json: () => Promise<any>;
		}
		
		const response: HttpsResponse = await new Promise((resolve, reject) => {
			const url = new URL(jiraUrl);
			
			const options = {
				hostname: url.hostname,
				port: url.port ? parseInt(url.port) : 443,
				path: url.pathname + url.search,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${jiraApiKey}`,
					'Accept': 'application/json',
					'User-Agent': 'JiraHillChart/1.0'
				},
				rejectUnauthorized: false,
				timeout: 30000
			};

			logger.info('Making direct HTTPS request to Jira API', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username,
				jiraUrl,
				hostname: url.hostname,
				port: options.port,
				path: options.path
			});

			const req = https.request(options, (res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					resolve({
						status: res.statusCode || 500,
						ok: (res.statusCode || 500) < 400,
						text: () => Promise.resolve(data),
						json: () => Promise.resolve(JSON.parse(data))
					});
				});
			});

			req.on('error', (err: any) => {
				logger.error('HTTPS request error', {
					operation: 'jira_api_key_validation',
					userId: user.id,
					username: user.username,
					jiraUrl,
					error: err.message,
					errorCode: err.code
				});
				reject(err);
			});

			req.on('timeout', () => {
				req.destroy();
				reject(new Error('Request timeout'));
			});

			req.end();
		});

			const duration = Date.now() - startTime;

			if (!response.ok) {
				const errorText = await response.text();
				logger.logJiraResponse('validate_api_key', jiraUrl, response.status, duration, {
					userId: user.id,
					username: user.username,
					error: errorText
				});
				return fail(400, { error: 'Invalid Jira API key' });
			}

			logger.logJiraResponse('validate_api_key', jiraUrl, response.status, duration, {
				userId: user.id,
				username: user.username
			});

			logger.info('Jira API key validation successful, encrypting and saving', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username,
				duration
			});

			const encryptedKey = encrypt(jiraApiKey);

			await db
				.update(table.user)
				.set({ jiraApiKey: encryptedKey })
				.where(eq(table.user.id, user.id));

			logger.info('Jira API key successfully saved to database', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username,
				totalDuration: Date.now() - startTime
			});

			return { success: true };
		} catch (e) {
			const duration = Date.now() - startTime;
			const errorMessage = e instanceof Error ? e.message : String(e);
			const errorName = e instanceof Error ? e.name : 'Unknown';
			const errorStack = e instanceof Error ? e.stack : undefined;
			
			logger.logJiraError('validate_api_key', jiraUrl, errorMessage, {
				userId: user.id,
				username: user.username,
				duration,
				errorName,
				errorStack: errorStack?.substring(0, 200)
			});

			// Provide more specific error message based on error type
			if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
				return fail(500, { error: `DNS resolution failed for Jira server: ${JIRA_SERVER_URL}` });
			} else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ECONNRESET')) {
				return fail(500, { error: `Connection refused to Jira server: ${JIRA_SERVER_URL}` });
			} else if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
				return fail(500, { error: `Connection timeout to Jira server: ${JIRA_SERVER_URL}` });
			} else if (errorMessage.includes('CERTIFICATE')) {
				return fail(500, { error: `SSL certificate error with Jira server: ${JIRA_SERVER_URL}` });
			} else {
				return fail(500, { error: `Network error connecting to Jira API: ${errorMessage}` });
			}
		}

	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/');
	}

	return locals.user;
}
