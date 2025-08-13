import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import { JIRA_SERVER_URL } from '$env/static/private';

// Mock dependencies
vi.mock('$lib/server/db', () => ({
	db: {
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		where: vi.fn().mockResolvedValue(undefined)
	}
}));

vi.mock('$lib/server/crypto', () => ({
	encrypt: vi.fn((text) => `encrypted-${text}`)
}));

vi.mock('$env/static/private', () => ({
	JIRA_SERVER_URL: 'https://jira.example.com'
}));

vi.mock('$app/server', () => ({
    getRequestEvent: vi.fn(() => ({
        locals: {
            user: { id: 'user-123', username: 'testuser', jiraApiKey: null },
            session: { id: 'session-456' }
        },
        request: {
            formData: async () => new URLSearchParams()
        }
    }))
}));

global.fetch = vi.fn();

describe('Welcome page actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('jira action', () => {
		it('should fail with 400 if jira-api-key is missing', async () => {
			const event = {
				request: {
					formData: async () => new URLSearchParams()
				},
				locals: {
					user: { id: 'user-123' }
				}
			};

			const result = await actions.jira(event);
			expect(result.status).toBe(400);
			expect(result.data.error).toBe('Jira API key is required');
		});

		it('should fail with 400 if Jira API key is invalid', async () => {
			const formData = new URLSearchParams();
			formData.set('jira-api-key', 'invalid-key');
			const event = {
				request: {
					formData: async () => formData
				},
				locals: {
					user: { id: 'user-123' }
				}
			};

			fetch.mockResolvedValue({ ok: false });

			const result = await actions.jira(event);
			expect(result.status).toBe(400);
			expect(result.data.error).toBe('Invalid Jira API key');
		});

		it('should encrypt and save the API key on valid submission', async () => {
			const { db } = await import('$lib/server/db');
			const { encrypt } = await import('$lib/server/crypto');
			const formData = new URLSearchParams();
			formData.set('jira-api-key', 'valid-key');
			const event = {
				request: {
					formData: async () => formData
				},
				locals: {
					user: { id: 'user-123' }
				}
			};

			fetch.mockResolvedValue({ ok: true });

			const result = await actions.jira(event);

			expect(fetch).toHaveBeenCalledWith(`${JIRA_SERVER_URL}/rest/api/3/myself`, {
				headers: {
					Authorization: 'Bearer valid-key'
				}
			});
			expect(encrypt).toHaveBeenCalledWith('valid-key');
			expect(db.update).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});
	});
});
