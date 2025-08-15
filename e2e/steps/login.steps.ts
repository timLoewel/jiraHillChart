import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const username = `testuser_${Math.random().toString(36).substring(2).replace(/\./g, '')}`;
const password = 'password123';

Given('I am a registered user', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('/welcome');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.waitForURL('/');
});

When('I log in', async ({ page }) => {
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
});

Then('I should be on the welcome page', async ({ page }) => {
  await expect(page).toHaveURL('/welcome');
  await expect(page.locator('h1')).toHaveText(`Hi, ${username}!`);
});

When('I log out', async ({ page }) => {
  await page.getByRole('button', { name: 'Sign out' }).click();
});

Then('I should be on the main page', async ({ page }) => {
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toHaveText('Login/Register');
});
