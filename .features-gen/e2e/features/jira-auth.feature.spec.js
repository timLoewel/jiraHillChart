// Generated from: e2e/features/jira-auth.feature
import { test } from "playwright-bdd";

test.describe('Jira Authentication', () => {

  test('User is redirected to enter token when search fails', async ({ Given, page, When, Then, And }) => {
    await Given('I am a logged-in user with an invalid Jira API key', null, { page });
    await When('I search for a ticket with the text "foo"', null, { page });
    await Then('I should be redirected to the /welcome page', null, { page });
    await And('I should see a message indicating that my token is invalid', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/jira-auth.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am a logged-in user with an invalid Jira API key","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I search for a ticket with the text \"foo\"","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected to the /welcome page","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I should see a message indicating that my token is invalid","stepMatchArguments":[]}]},
]; // bdd-data-end