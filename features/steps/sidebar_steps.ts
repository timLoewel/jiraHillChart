import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import * as mockJira from '../../src/services/jira.mock';

const { Given, When, Then } = createBdd();

const MOCK_HOST = 'https://mock-jira.example.com';

Given('I am logged in as {string} to search tickets', async ({ page }, userKey: 'user1' | 'user2') => {
  const MOCK_TOKENS = {
    user1: 'valid-token-for-user1',
    user2: 'valid-token-for-user2',
  };
  const token = MOCK_TOKENS[userKey];

  await page.route('**/rest/api/3/myself', async (route) => {
    try {
      const user = await mockJira.verifyTokenAndGetUser(MOCK_HOST, token);
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
    } catch (error: any) {
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: error.message }) });
    }
  });

  await page.route(`**/rest/api/3/issue/*`, async (route) => {
    const ticketId = route.request().url().split('/').pop() || '';
    try {
      const ticket = await mockJira.getTicket(MOCK_HOST, token, ticketId);
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ticket) });
    } catch (error: any) {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: error.message }) });
    }
  });

  await page.goto('/');
  await page.locator('input[id="jiraHost"]').fill(MOCK_HOST);
  await page.locator('input[id="token"]').fill(token);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.user-profile')).toBeVisible();
});

When('I enter {string} into the search field', async ({ page }, ticketId: string) => {
  await page.getByPlaceholder('Search for tickets').fill(ticketId);
  await page.getByPlaceholder('Search for tickets').press('Enter');
});

Then('I should see {string} in the recent tickets list', async ({ page }, ticketId: string) => {
  await expect(page.locator('.recent-tickets-list')).toContainText(ticketId);
});

Then('I should see the ticket title {string} in the main panel', async ({ page }, title: string) => {
  await expect(page.locator('.ticket-display h3')).toHaveText(title);
});

When('I click the {string} section header', async ({ page }, section: string) => {
  await page.locator(`h3:has-text("${section}")`).click();
});

Then('the recent tickets list should be hidden', async ({ page }) => {
  await expect(page.locator('.recent-tickets-list')).toBeHidden();
});

Then('the recent tickets list should be visible', async ({ page }) => {
  await expect(page.locator('.recent-tickets-list')).toBeVisible();
});

Given('I have searched for {string}', async ({ page }, ticketId: string) => {
  await page.getByPlaceholder('Search for tickets').fill(ticketId);
  await page.getByPlaceholder('Search for tickets').press('Enter');
  await expect(page.locator('.recent-tickets-list')).toContainText(ticketId);
});
