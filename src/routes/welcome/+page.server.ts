import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { encrypt } from '$lib/server/crypto';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { JiraService } from '$lib/server/jira';
import { logger } from '$lib/server/logger';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	},
	jira: async (event) => {
		const user = requireLogin();
		const formData = await event.request.formData();
		const jiraApiKey = formData.get('jira-api-key')?.toString();

		if (!jiraApiKey) {
			return fail(400, { error: 'Jira API key is required' });
		}

		const jiraService = new JiraService(jiraApiKey);

		try {
			logger.info('Validating Jira API key');
			const isValid = await jiraService.validateToken();
			logger.info(`Jira API key is valid: ${isValid}`);

			if (!isValid) {
				logger.warn('Invalid Jira API key');
				return fail(400, { error: 'Invalid Jira API key' });
			}

			logger.info('Jira API key is valid, encrypting and saving');
			const encryptedKey = encrypt(jiraApiKey);

			await db
				.update(table.user)
				.set({ jiraApiKey: encryptedKey })
				.where(eq(table.user.id, user.id));

			logger.info('Jira API key saved, redirecting to /');
			throw redirect(303, '/');
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			return fail(500, { error: `Failed to validate Jira API key: ${errorMessage}` });
		}

	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/');
	}

	return locals.user;
}
