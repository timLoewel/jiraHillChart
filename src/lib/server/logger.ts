export interface LogContext {
	userId?: string;
	username?: string;
	operation?: string;
	url?: string;
	jiraUrl?: string;
	statusCode?: number;
	error?: string;
	duration?: number;
	totalDuration?: number;
	searchTerm?: string;
	jql?: string;
	resultCount?: number;
	errorName?: string;
	errorStack?: string;
	headers?: Record<string, string>;
	testStatus?: number;
	testError?: string;
	hostname?: string;
	port?: number;
	path?: string;
	errorCode?: string;
}

export interface LogEntry {
	timestamp: string;
	level: 'info' | 'warn' | 'error';
	message: string;
	context: LogContext;
}

class Logger {
	private formatLog(level: LogEntry['level'], message: string, context: LogContext): string {
		const timestamp = new Date().toISOString();
		const contextStr = Object.entries(context)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => `${key}=${value}`)
			.join(' ');

		return `[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`.trim();
	}

	info(message: string, context: LogContext = {}): void {
		console.log(this.formatLog('info', message, context));
	}

	warn(message: string, context: LogContext = {}): void {
		console.warn(this.formatLog('warn', message, context));
	}

	error(message: string, context: LogContext = {}): void {
		console.error(this.formatLog('error', message, context));
	}

	// Specialized logging for Jira API calls
	logJiraRequest(operation: string, url: string, context: LogContext = {}): void {
		this.info(`Jira API request: ${operation}`, {
			...context,
			operation,
			url
		});
	}

	logJiraResponse(operation: string, url: string, statusCode: number, duration: number, context: LogContext = {}): void {
		const level = statusCode >= 400 ? 'error' : 'info';
		const message = `Jira API response: ${operation} - ${statusCode}`;
		
		this[level](message, {
			...context,
			operation,
			url,
			statusCode,
			duration
		});
	}

	logJiraError(operation: string, url: string, error: string, context: LogContext = {}): void {
		this.error(`Jira API error: ${operation}`, {
			...context,
			operation,
			url,
			error
		});
	}
}

export const logger = new Logger(); 