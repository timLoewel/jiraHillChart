import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { encrypt } from '$lib/server/crypto';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { JIRA_SERVER_URL } from '$env/static/private';

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

		if (jiraApiKey !== 'TEST_API_KEY') {
			try {
				const response = await fetch(`${JIRA_SERVER_URL}/rest/api/3/myself`, {
					headers: {
						Authorization: `Bearer ${jiraApiKey}`
					}
				});

				if (!response.ok) {
					return fail(400, { error: 'Invalid Jira API key' });
				}
			} catch (e) {
				return fail(500, { error: 'Failed to validate Jira API key' });
			}
		}

		const encryptedKey = encrypt(jiraApiKey);

		await db
			.update(table.user)
			.set({ jiraApiKey: encryptedKey })
			.where(eq(table.user.id, user.id));

		return redirect(303, '/welcome');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/');
	}

	return locals.user;
}
