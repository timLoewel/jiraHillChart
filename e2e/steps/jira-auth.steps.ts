import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const username = `testuser_${Math.random().toString(36).substring(7)}`;
const password = 'password123';

Given('I am a logged-in user with an invalid Jira API key', async ({ page }) => {
	// Mock the Jira API search endpoint to return a 401
	await page.route('**/api/jira/search?term=foo', (route) => {
		route.fulfill({
			status: 401,
			contentType: 'application/json',
			body: JSON.stringify({ message: 'Unauthorized' })
		});
	});

	// Register and login
	await page.goto('/');
	await page.locator('input[name="username"]').fill(username);
	await page.locator('input[name="password"]').fill(password);
	await page.getByRole('button', { name: 'Register' }).click();
	await page.waitForURL('/welcome');

	// Mock the Jira API key validation to succeed
	await page.evaluate(() => {
		const originalFetch = window.fetch;
		window.fetch = (url, options) => {
			if (url.toString().includes('/rest/api/2/myself')) {
				return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
			}
			return originalFetch(url, options);
		};
	});

	// Configure Jira API key
	await page.locator('input[name="jira-api-key"]').fill('invalid-api-key');
	await page.getByRole('button', { name: 'Save' }).click();
	await page.waitForURL('/');
});


Then('I should be redirected to the \\/welcome page', async ({ page }) => {
	await page.waitForURL('**/welcome?error=invalid_token');
});

Then('I should see a message indicating that my token is invalid', async ({ page }) => {
	await expect(page.locator('body')).toContainText('Your Jira API key is invalid or has expired.');
});
