import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decrypt } from '$lib/server/crypto';
import { JIRA_SERVER_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	if (!user.jiraApiKey) {
		throw error(400, 'Jira API key not configured');
	}

	const searchTerm = url.searchParams.get('term');
	if (!searchTerm) {
		throw error(400, 'Search term is required');
	}

	const decryptedApiKey = decrypt(user.jiraApiKey);

	const jql = `
    (
      issuekey ~ "${searchTerm}" OR
      summary ~ "${searchTerm}" OR
      creator ~ "${searchTerm}" OR
      assignee ~ "${searchTerm}"
    )
  `;

	const response = await fetch(`${JIRA_SERVER_URL}/rest/api/3/search`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${decryptedApiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			jql: jql,
			fields: ['summary']
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw error(response.status, `Jira API error: ${errorText}`);
	}

	const data = await response.json();

	const issues = data.issues.map((issue: any) => ({
		id: issue.key,
		title: issue.fields.summary
	}));

	return json(issues);
};
