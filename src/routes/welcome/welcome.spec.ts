import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Mock the global fetch function
global.fetch = vi.fn();

vi.mock('$lib/server/crypto', () => ({
	encrypt: vi.fn((text) => `encrypted-${text}`),
	decrypt: vi.fn((text) => text.replace('encrypted-', ''))
}));

vi.mock('$env/static/private', () => ({
	JIRA_SERVER_URL: 'https://jira.example.com',
	DATABASE_URL: 'file::memory:?cache=shared'
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

import { actions } from './+page.server';

describe('Welcome page actions', () => {
	beforeEach(async () => {
		// Create a test user before each test
		await db.insert(schema.user).values({
			id: 'user-123',
			username: 'testuser',
			passwordHash: 'hashed-password'
		});
		(fetch as any).mockClear();
	});

	afterEach(async () => {
		// Clean up the user after each test
		await db.delete(schema.user).where(eq(schema.user.id, 'user-123'));
		vi.resetAllMocks();
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

			const result = await actions.jira(event as any);
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

			(fetch as any).mockResolvedValue({
				ok: false,
				status: 401,
				text: () => Promise.resolve('Unauthorized')
			});

			const result = await actions.jira(event as any);
			expect(result.status).toBe(400);
			expect(result.data.error).toBe('Invalid Jira API key');
		});

		it('should encrypt and save the API key on valid submission', async () => {
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

			(fetch as any).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true })
			});

			const result = await actions.jira(event as any);

			expect(fetch).toHaveBeenCalled();
			const fetchCall = (fetch as any).mock.calls[0];
			expect(fetchCall[0]).toBe('https://jira.example.com/rest/api/2/myself');
			expect(fetchCall[1].headers['Authorization']).toBe('Bearer valid-key');
			expect(encrypt).toHaveBeenCalledWith('valid-key');
			expect(result).toEqual({ success: true });

			// Verify the key was saved in the db
			const updatedUser = await db.query.user.findFirst({
				where: eq(schema.user.id, 'user-123')
			});
			expect(updatedUser?.jiraApiKey).toBe('encrypted-valid-key');
		});
	});
});
