import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const username = `testuser_${Math.random().toString(36).substring(7)}`;
const password = 'password123';

Given('I am a logged-in user with a configured Jira API key', async ({ page }) => {
  // Mock the Jira API search endpoint
  await page.route('**/api/jira/search?term=foo', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'FOO-1', title: 'The foo ticket' },
        { id: 'FOO-2', title: 'Another foo ticket' },
      ]),
    });
  });

  // Register and login
  await page.goto('/');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('/welcome');

  // Mock the Jira API key validation
  await page.route('https://jira.example.com/rest/api/2/myself', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Configure Jira API key
  await page.locator('input[name="jira-api-key"]').fill('fake-api-key');
  await page.getByRole('button', { name: 'Save' }).click();

  // Go to the main page to start the search
  await page.goto('/');
});

When('I search for a ticket with the text "foo"', async ({ page }) => {
  await page.locator('input[placeholder="Search Jira..."]').fill('foo');
  await page.keyboard.press('Enter');
});

Then('I should see a list of tickets containing "foo"', async ({ page }) => {
  await expect(page.locator('.ticket-id')).toHaveText(['FOO-1', 'FOO-2']);
});

When('I click on the first ticket in the list', async ({ page }) => {
    await page.locator('.search-results button').first().click({ force: true });
});

Then('the main panel should show the title of the first ticket', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Another foo ticket');
});
