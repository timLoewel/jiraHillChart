import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock console methods
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('should log info messages with context', () => {
		const context = { userId: '123', operation: 'test' };
		logger.info('Test message', context);
		
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('INFO: Test message userId=123 operation=test')
		);
	});

	it('should log warn messages with context', () => {
		const context = { userId: '123', operation: 'test' };
		logger.warn('Test warning', context);
		
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('WARN: Test warning userId=123 operation=test')
		);
	});

	it('should log error messages with context', () => {
		const context = { userId: '123', operation: 'test' };
		logger.error('Test error', context);
		
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('ERROR: Test error userId=123 operation=test')
		);
	});

	it('should log Jira requests with specialized method', () => {
		const context = { userId: '123', username: 'testuser' };
		logger.logJiraRequest('search_issues', 'https://example.com/api', context);
		
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('INFO: Jira API request: search_issues userId=123 username=testuser operation=search_issues url=https://example.com/api')
		);
	});

	it('should log Jira responses with status code and duration', () => {
		const context = { userId: '123', username: 'testuser' };
		logger.logJiraResponse('search_issues', 'https://example.com/api', 200, 150, context);
		
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('INFO: Jira API response: search_issues - 200 userId=123 username=testuser operation=search_issues url=https://example.com/api statusCode=200 duration=150')
		);
	});

	it('should log Jira error responses as errors', () => {
		const context = { userId: '123', username: 'testuser' };
		logger.logJiraResponse('search_issues', 'https://example.com/api', 400, 150, context);
		
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('ERROR: Jira API response: search_issues - 400 userId=123 username=testuser operation=search_issues url=https://example.com/api statusCode=400 duration=150')
		);
	});

	it('should log Jira errors with specialized method', () => {
		const context = { userId: '123', username: 'testuser' };
		logger.logJiraError('search_issues', 'https://example.com/api', 'Network timeout', context);
		
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('ERROR: Jira API error: search_issues userId=123 username=testuser operation=search_issues url=https://example.com/api error=Network timeout')
		);
	});

	it('should filter out undefined context values', () => {
		const context = { userId: '123', username: undefined, operation: 'test' };
		logger.info('Test message', context);
		
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('INFO: Test message userId=123 operation=test')
		);
		expect(console.log).not.toHaveBeenCalledWith(
			expect.stringContaining('username=undefined')
		);
	});

	it('should include timestamp in log format', () => {
		logger.info('Test message');
		
		expect(console.log).toHaveBeenCalledWith(
			expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO: Test message/)
		);
	});
}); 