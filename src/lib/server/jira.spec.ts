import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JiraService, JiraError } from './jira';

// Mock the logger and JIRA_SERVER_URL
vi.mock('$lib/server/logger', () => ({
	logger: {
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		logJiraRequest: vi.fn(),
		logJiraResponse: vi.fn(),
		logJiraError: vi.fn()
	}
}));

vi.mock('$env/static/private', () => ({
	JIRA_SERVER_URL: 'https://test.jira.com'
}));

global.fetch = vi.fn();

describe('JiraService', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('validateToken', () => {
		it('should return true for a valid token', async () => {
			(fetch as any).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ success: true })
			});

			const jiraService = new JiraService('valid-token');
			const isValid = await jiraService.validateToken();

			expect(isValid).toBe(true);
			expect(fetch).toHaveBeenCalledWith(
				'https://test.jira.com/rest/api/2/myself',
				expect.any(Object)
			);
		});

		it('should return false for an invalid token', async () => {
			(fetch as any).mockResolvedValue({
				ok: false,
				status: 401,
				text: () => Promise.resolve('Unauthorized')
			});

			const jiraService = new JiraService('invalid-token');
			const isValid = await jiraService.validateToken();

			expect(isValid).toBe(false);
		});

		it('should throw an error for other non-ok responses', async () => {
			(fetch as any).mockResolvedValue({
				ok: false,
				status: 500,
				text: () => Promise.resolve('Internal Server Error')
			});

			const jiraService = new JiraService('any-token');

			await expect(jiraService.validateToken()).rejects.toThrow(JiraError);
		});
	});

	describe('search', () => {
		it('should return a list of issues for a successful search', async () => {
			const mockIssues = {
				issues: [
					{ key: 'TEST-1', fields: { summary: 'Test issue 1' } },
					{ key: 'TEST-2', fields: { summary: 'Test issue 2' } }
				]
			};

			(fetch as any).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockIssues)
			});

			const jiraService = new JiraService('valid-token');
			const issues = await jiraService.search('test');

			expect(issues).toEqual([
				{ id: 'TEST-1', title: 'Test issue 1' },
				{ id: 'TEST-2', title: 'Test issue 2' }
			]);

			expect(fetch).toHaveBeenCalledWith(
				'https://test.jira.com/rest/api/2/search',
				expect.objectContaining({
					method: 'POST'
				})
			);
		});

		it('should throw a JiraError for a 401 response', async () => {
			(fetch as any).mockResolvedValue({
				ok: false,
				status: 401,
				text: () => Promise.resolve('Unauthorized')
			});

			const jiraService = new JiraService('invalid-token');

			await expect(jiraService.search('test')).rejects.toThrow(JiraError);
		});
	});
});
