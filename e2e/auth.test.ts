import { expect, test } from '@playwright/test';

// Helper function to generate a random string
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

test('should be able to sign up and log out', async ({ page }) => {
  // Generate random credentials
  const username = `testuser_${generateRandomString(8)}`;
  const password = `password_${generateRandomString(12)}`;

  // 1. Load the front page
  await page.goto('/');
  
  // 2. Click on the login button to go to the login page
  await page.getByRole('link', { name: 'Login' }).click();
  
  // 3. Fill in the registration form
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  
  // 4. Click register button
  await page.getByRole('button', { name: 'Register' }).click();
  
  // 5. Wait for navigation to home page
  await page.waitForURL('/');
  
  // 6. Verify successful login
  const welcomeMessage = await page.getByText(`Welcome ${username}!`);
  expect(welcomeMessage).toBeVisible();
  
  // 7. Click logout
  await page.getByRole('link', { name: 'Logout' }).click();
  
  // 8. Verify we're back at the login page
  await page.waitForURL('/login');
  
  // 9. Fill in login form
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  
  // 10. Click login button
  await page.getByRole('button', { name: 'Login' }).click();
  
  // 11. Wait for navigation to home page
  await page.waitForURL('/');
  
  // 12. Verify successful login
  const welcomeMessageAfterLogin = await page.getByText(`Welcome ${username}!`);
  expect(welcomeMessageAfterLogin).toBeVisible();
});
