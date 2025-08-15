// Generated from: e2e/features/jira.feature
import { test } from "playwright-bdd";

test.describe('Jira API Key', () => {

  test('A user can add a Jira API key', async ({ Given, page, When, Then, And }) => {
    await Given('I am a logged-in user', null, { page });
    await When('I add a valid Jira API key', null, { page });
    await Then('I should see a success message', null, { page });
    await And('I should see the Jira search input', null, { page });
  });

  test.skip('A user cannot add an invalid Jira API key', { tag: ['@skip'] }, async ({ Given, When, Then, And }) => {
    await Given('I am a logged-in user');
    await When('I add an invalid Jira API key');
    await Then('I should see an error message');
    await And('I should not see the Jira search input');
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/jira.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am a logged-in user","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I add a valid Jira API key","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should see a success message","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I should see the Jira search input","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":10,"skipped":true,"tags":["@skip"],"steps":[{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I am a logged-in user"},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I add an invalid Jira API key"},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message"},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I should not see the Jira search input"}]},
]; // bdd-data-end