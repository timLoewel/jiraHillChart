import { JiraService } from './service';
import { decrypt } from '$lib/server/crypto';
import type { User } from '$lib/server/db/users';
import { error } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export function getJiraService(user: User): JiraService {
	if (!user.jiraApiKey) {
		logger.warn('Jira service requested without configured API key', {
			operation: 'get_jira_service',
			userId: user.id,
			username: user.username
		});
		throw error(400, 'Jira API key not configured');
	}

	try {
		const decryptedApiKey = decrypt(user.jiraApiKey);
		return new JiraService(decryptedApiKey);
	} catch (e) {
		logger.error('Failed to decrypt Jira API key', {
			operation: 'get_jira_service',
			userId: user.id,
			username: user.username,
			error: e instanceof Error ? e.message : 'Unknown error'
		});
		throw error(500, 'Failed to process Jira API key');
	}
}

export { JiraService, JiraError } from './service';
