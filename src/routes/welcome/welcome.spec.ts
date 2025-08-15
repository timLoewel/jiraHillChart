import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the native https module.
// All variables used by the factory must be defined inside it to avoid hoisting issues.
vi.mock('https', () => {
	class MockAgent {
		constructor(options?: any) {}
	}

	const mockRequest = {
		on: vi.fn().mockReturnThis(),
		end: vi.fn(),
		destroy: vi.fn(),
		write: vi.fn()
	};

	const mockResponse = {
		on: vi.fn((event, callback) => {
			if (event === 'data') {
				callback('{}'); // Simulate empty JSON response
			}
			if (event === 'end') {
				callback();
			}
			return mockResponse;
		}),
		statusCode: 200
	};

	const request = vi.fn((options, callback) => {
		if (callback) {
			callback(mockResponse);
		}
		return mockRequest;
	});

	return {
		default: { request, Agent: MockAgent },
		request,
		Agent: MockAgent,
		// Expose internals for test manipulation
		__mockResponse: mockResponse
	};
});

import { actions } from './+page.server';
// Import the default and all named exports from the mocked module
import https, * as httpsMock from 'https';

// Mock other dependencies
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
	JIRA_SERVER_URL: 'https://jira.example.com',
	BYPASS_JIRA_VALIDATION: 'false'
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

describe('Welcome page actions', () => {
	// Cast to any to access the mock internals we exposed on the named exports
	const mockInternals = httpsMock as any;

	beforeEach(() => {
		vi.clearAllMocks();
		mockInternals.__mockResponse.statusCode = 200;
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

			mockInternals.__mockResponse.statusCode = 401;

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

			mockInternals.__mockResponse.statusCode = 200;

			const result = await actions.jira(event);

			expect(https.request).toHaveBeenCalled();
			const requestOptions = vi.mocked(https.request).mock.calls[0][0];
			expect(requestOptions.hostname).toBe('jira.example.com');
			expect(requestOptions.path).toBe('/rest/api/2/myself');
			expect(requestOptions.headers['Authorization']).toBe('Bearer valid-key');
			expect(encrypt).toHaveBeenCalledWith('valid-key');
			expect(db.update).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});
	});
});
