import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
	paths: ['e2e/features/**/*.feature'],
	require: ['e2e/steps/**/*.ts'],
	outputDir: '.features-gen/e2e/features'
});

export default defineConfig({
	testDir,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://127.0.0.1:5173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'E2E_TEST=true npm run dev',
		url: 'http://127.0.0.1:5173',
		reuseExistingServer: !process.env.CI
	}
});
