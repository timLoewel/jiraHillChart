import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import * as mockJira from '../../src/services/jira.mock';

const { Given, When, Then } = createBdd();

const MOCK_HOST = 'https://mock-jira.example.com';
const MOCK_TOKENS = {
  user1: 'valid-token-for-user1',
  user2: 'valid-token-for-user2',
};

// Setup a global mock for all scenarios in this file
Given('I am on the login page', async ({ page }) => {
  // Intercept network requests to the Jira API and fulfill them with our mock service
  await page.route('**/rest/api/3/myself', async (route) => {
    const request = route.request();
    const headers = await request.allHeaders();
    const authHeader = headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    try {
      const user = await mockJira.verifyTokenAndGetUser(MOCK_HOST, token);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      });
    } catch (error: any) {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: error.message }),
      });
    }
  });

  await page.goto('/');
  await expect(page.locator('h2')).toHaveText('Jira Login');
});

When('I enter the mock Jira host and the token for {string}', async ({ page }, userKey: keyof typeof MOCK_TOKENS) => {
  const token = MOCK_TOKENS[userKey];
  await page.locator('input[id="jiraHost"]').fill(MOCK_HOST);
  await page.locator('input[id="token"]').fill(token);
});

When('I enter the mock Jira host and an {string}', async ({ page }, token: string) => {
  await page.locator('input[id="jiraHost"]').fill(MOCK_HOST);
  await page.locator('input[id="token"]').fill(token);
});

When('I click the "Login" button', async ({ page }) => {
  await page.locator('button[type="submit"]').click();
});

Then('I should see the avatar and name for {string}', async ({ page }, displayName: string) => {
  await expect(page.locator('img[alt="User Avatar"]')).toBeVisible();
  await expect(page.locator('p')).toContainText(`Hello, ${displayName}`);
});

Then('I should see a {string} error message', async ({ page }, errorMessage: string) => {
  const errorLocator = page.locator('p[style="color: red;"]');
  await expect(errorLocator).toBeVisible();
  await expect(errorLocator).toContainText(errorMessage);
});

Given('I am logged in as {string}', async ({ page }, userKey: keyof typeof MOCK_TOKENS) => {
  await page.route('**/rest/api/3/myself', async (route) => {
    const request = route.request();
    const headers = await request.allHeaders();
    const authHeader = headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    try {
      const user = await mockJira.verifyTokenAndGetUser(MOCK_HOST, token);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      });
    } catch (error: any) {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: error.message }),
      });
    }
  });
  await page.goto('/');
  const token = MOCK_TOKENS[userKey];
  await page.locator('input[id="jiraHost"]').fill(MOCK_HOST);
  await page.locator('input[id="token"]').fill(token);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('img[alt="User Avatar"]')).toBeVisible();
});

When('I click the "Logout" button', async ({ page }) => {
  await page.locator('button', { hasText: 'Logout' }).click();
});

Then('I should be on the login page', async ({ page }) => {
  await expect(page.locator('h2')).toHaveText('Jira Login');
});
