import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { encrypt } from '$lib/server/crypto';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '$lib/server/logger';
import { JiraService } from '$lib/server/jira';

export const prerender = false;

export const load: PageServerLoad = async ({ url, locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/');
	}
	const error = url.searchParams.get('error');

	if (error === 'invalid_token') {
		// To prevent the "Jira API key is configured" message from showing
		user.jiraApiKey = null;
	}

	return { user, error };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		redirect(302, '/');
	},
	jira: async (event) => {
		const user = requireLogin();
		const formData = await event.request.formData();
		const jiraApiKey = formData.get('jira-api-key')?.toString();

		if (!jiraApiKey) {
			logger.warn('Jira API key validation attempted without key', {
				operation: 'jira_api_key_validation',
				userId: user.id,
				username: user.username
			});
			return fail(400, { error: 'Jira API key is required' });
		}

		const jiraService = new JiraService(jiraApiKey);
		const isValid = await jiraService.validateToken();

		if (!isValid) {
			return fail(400, { error: 'Invalid Jira API key' });
		}

		const encryptedKey = encrypt(jiraApiKey);

		await db
			.update(table.user)
			.set({ jiraApiKey: encryptedKey })
			.where(eq(table.user.id, user.id));

		return { success: true };
	}
};

function requireLogin() {
	const { locals } = getRequestEvent()!;

	if (!locals.user) {
		throw redirect(32, '/');
	}

	return locals.user;
}
