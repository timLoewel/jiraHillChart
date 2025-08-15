// Generated from: e2e/features/jira-search.feature
import { test } from "playwright-bdd";

test.describe('Jira Search', () => {

  test('Search for a Jira ticket', async ({ Given, page, When, Then }) => {
    await Given('I am a logged-in user with a configured Jira API key', null, { page });
    await When('I search for a ticket with the text "foo"', null, { page });
    await Then('I should see a list of tickets containing "foo"', null, { page });
    await When('I click on the first ticket in the list', null, { page });
    await Then('the main panel should show the title of the first ticket', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/jira-search.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am a logged-in user with a configured Jira API key","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I search for a ticket with the text \"foo\"","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should see a list of tickets containing \"foo\"","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I click on the first ticket in the list","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the main panel should show the title of the first ticket","stepMatchArguments":[]}]},
]; // bdd-data-end