import { json, error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { JiraService, JiraError } from '$lib/server/jira';
import { decrypt } from '$lib/server/crypto';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	if (!user.jiraApiKey) {
		throw redirect(303, '/welcome?error=no_token');
	}

	const searchTerm = url.searchParams.get('term');
	if (!searchTerm) {
		throw error(400, 'Search term is required');
	}

	try {
		const decryptedApiKey = decrypt(user.jiraApiKey);
		const jiraService = new JiraService(decryptedApiKey);
		const issues = await jiraService.search(searchTerm);
		return json(issues);
	} catch (e) {
		if (e instanceof JiraError) {
			if (e.status === 401) {
				throw redirect(303, '/welcome?error=invalid_token');
			}
			throw error(e.status, e.message);
		}
		const errorMessage = e instanceof Error ? e.message : String(e);
		throw error(500, `Failed to search Jira: ${errorMessage}`);
	}
};
