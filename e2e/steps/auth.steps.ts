import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const username = `testuser_${Math.random().toString(36).substring(7)}`;
const password = 'password123';

Given('I am on the login page', async ({ page }) => {
  await page.goto('/demo/lucia/login');
});

When('I enter valid credentials', async ({ page }) => {
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
});

When('I click the "Login" button', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
});

Then('I should see the welcome message', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText(`Hi, ${username}!`);
});

Given('I am logged in', async ({ page }) => {
  await page.goto('/demo/lucia/login');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('h1')).toHaveText(`Hi, ${username}!`);
});

When('I click the "Sign out" button', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign out' }).click();
});

Then('I should be on the login page', async ({ page }) => {
    await expect(page).toHaveURL('/demo/lucia/login');
    await expect(page.locator('h1')).toHaveText('Login/Register');
});
