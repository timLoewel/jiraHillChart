import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const username = `testuser_${Math.random().toString(36).substring(2).replace(/\./g, '')}`;
const password = 'password123';

Given('I am a logged-in user', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('/welcome');
});

When('I add a valid Jira API key', async ({ page }) => {
  await page.locator('input[name="jira-api-key"]').fill('TEST_API_KEY');
  await page.getByRole('button', { name: 'Save' }).click();
});

Then('I should see a success message', async ({ page }) => {
  await expect(page.getByText('Your Jira API key is configured.')).toBeVisible();
});

Then('I should see the Jira search input', async ({ page }) => {
    await expect(page.locator('input[placeholder="Search Jira..."]')).toBeVisible();
});

When('I add an invalid Jira API key', async ({ page }) => {
    await page.locator('input[name="jira-api-key"]').fill('invalid-api-key');
    await page.getByRole('button', { name: 'Save' }).click();
});

Then('I should see an error message', async ({ page }) => {
    await expect(page.locator('p[style="color: red"]')).toHaveText('Invalid Jira API key');
});

Then('I should not see the Jira search input', async ({ page }) => {
    await expect(page.locator('input[placeholder="Search Jira..."]')).not.toBeVisible();
});
