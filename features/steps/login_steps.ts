import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// This is a mock. In a real scenario, you would not expose your token like this.
// It would be handled via environment variables or a secure vault.
const JIRA_HOST = 'https://your-jira.atlassian.net';
const JIRA_TOKEN = 'your-token';

Given('I am on the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toHaveText('Jira Login');
});

When('I enter my Jira host and a valid personal access token', async ({ page }) => {
  await page.locator('input[id="jiraHost"]').fill(JIRA_HOST);
  await page.locator('input[id="token"]').fill(JIRA_TOKEN);
});

When('I click the "Login" button', async ({ page }) => {
  // In a real test, we would need to mock the API call to avoid hitting a real Jira instance.
  // For this example, we assume the happy path where the login will succeed.
  // We will mock the response from the Jira API.
  await page.route('**/rest/api/3/myself', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        displayName: 'Test User',
        avatarUrls: {
          '48x48': 'https://via.placeholder.com/48',
        },
      }),
    });
  });

  await page.locator('button[type="submit"]').click();
});

Then('I should see my user avatar', async ({ page }) => {
  await expect(page.locator('img[alt="User Avatar"]')).toBeVisible();
  await expect(page.locator('p')).toContainText('Hello, Test User');
});

Given('I am logged in', async ({ page }) => {
  // This step combines the login actions to set up the state.
  await page.goto('/');
  await page.route('**/rest/api/3/myself', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        displayName: 'Test User',
        avatarUrls: {
          '48x48': 'https://via.placeholder.com/48',
        },
      }),
    });
  });
  await page.locator('input[id="jiraHost"]').fill(JIRA_HOST);
  await page.locator('input[id="token"]').fill(JIRA_TOKEN);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('img[alt="User Avatar"]')).toBeVisible();
});

When('I click the "Logout" button', async ({ page }) => {
  await page.locator('button', { hasText: 'Logout' }).click();
});

Then('I should be on the login page', async ({ page }) => {
  await expect(page.locator('h2')).toHaveText('Jira Login');
});
