import { JIRA_SERVER_URL } from '$env/static/private';
import { logger } from '$lib/server/logger';
import { Agent } from 'https';

export class JiraError extends Error {
	constructor(
		message: string,
		public status: number
	) {
		super(message);
		this.name = 'JiraError';
	}
}

export class JiraService {
	private apiKey: string;
	private jiraApiUrl: string;
	private httpsAgent: Agent;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.jiraApiUrl = `${JIRA_SERVER_URL}/rest/api/2`;
		this.httpsAgent = new Agent({ rejectUnauthorized: false });
	}

	private async fetchJira<T>(
		endpoint: string,
		options: RequestInit = {},
		context: Record<string, any> = {}
	): Promise<T> {
		const url = `${this.jiraApiUrl}/${endpoint}`;
		const startTime = Date.now();

		logger.logJiraRequest(context.operation || 'jira_api_call', url, context);

		try {
			const response = await fetch(url, {
				...options,
				headers: {
					...options.headers,
					'Authorization': `Bearer ${this.apiKey}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				// @ts-ignore - Node.js specific option
				agent: this.httpsAgent
			});

			const duration = Date.now() - startTime;

			if (!response.ok) {
				const errorText = await response.text();
				logger.logJiraResponse(context.operation || 'jira_api_call', url, response.status, duration, {
					...context,
					error: errorText
				});
				throw new JiraError(`Jira API error: ${errorText}`, response.status);
			}

			logger.logJiraResponse(
				context.operation || 'jira_api_call',
				url,
				response.status,
				duration,
				context
			);

			return (await response.json()) as T;
		} catch (e) {
			const duration = Date.now() - startTime;
			const errorMessage = e instanceof Error ? e.message : String(e);

			logger.logJiraError(context.operation || 'jira_api_call', url, errorMessage, {
				...context,
				duration
			});

			if (e instanceof JiraError) {
				throw e;
			}

			throw new Error(`Network error connecting to Jira API: ${errorMessage}`);
		}
	}

	public async validateToken(): Promise<boolean> {
		try {
			await this.fetchJira('myself', {}, { operation: 'validate_api_key' });
			return true;
		} catch (e) {
			if (e instanceof JiraError && e.status === 401) {
				return false;
			}
			throw e;
		}
	}

	public async search(term: string): Promise<{ id: string; title: string }[]> {
		const jql = `
      (
        issuekey ~ "${term}" OR
        summary ~ "${term}" OR
        creator ~ "${term}" OR
        assignee ~ "${term}"
      )
    `;

		const response: any = await this.fetchJira(
			'search',
			{
				method: 'POST',
				body: JSON.stringify({
					jql: jql,
					fields: ['summary']
				})
			},
			{ operation: 'search_issues', term }
		);

		return response.issues.map((issue: any) => ({
			id: issue.key,
			title: issue.fields.summary
		}));
	}
}
