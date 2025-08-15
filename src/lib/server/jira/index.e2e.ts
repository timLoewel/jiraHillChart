import type { User } from '$lib/server/db/users';
import { error } from '@sveltejs/kit';

class MockJiraService {
	constructor(private apiKey: string) {}

	public async validateToken(): Promise<boolean> {
		if (this.apiKey === 'invalid-api-key') {
			return false;
		}
		return true;
	}

	public async search(term: string): Promise<{ id: string; title: string }[]> {
		if (term === 'error') {
			throw new Error('Something went wrong');
		}

		if (term === 'empty') {
			return [];
		}

		return [
			{ id: 'JIRA-1', title: `Result for "${term}" 1` },
			{ id: 'JIRA-2', title: `Result for "${term}" 2` }
		];
	}
}

export function getJiraService(user: User) {
	if (!user.jiraApiKey) {
		throw error(400, 'Jira API key not configured');
	}

	// In the mock, we don't need to decrypt the key.
	// We just need to know if it's there.
	return new MockJiraService(user.jiraApiKey);
}

export { JiraError } from './service';
export { MockJiraService as JiraService };
