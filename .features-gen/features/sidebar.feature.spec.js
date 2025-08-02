// Generated from: features/sidebar.feature
import { test } from "playwright-bdd";

test.describe('Sidebar ticket search and history', () => {

  test('Searching for a ticket', async ({ Given, page, When, Then, And }) => {
    await Given('I am logged in as "user1" to search tickets', null, { page });
    await When('I enter "TICKET-1" into the search field', null, { page });
    await Then('I should see "TICKET-1" in the recent tickets list', null, { page });
    await And('I should see the ticket title "Implement search feature" in the main panel', null, { page });
  });

  test('Expanding and collapsing recent tickets', async ({ Given, page, And, When, Then }) => {
    await Given('I am logged in as "user1" to search tickets', null, { page });
    await And('I have searched for "TICKET-1"', null, { page });
    await When('I click the "Recent tickets" section header', null, { page });
    await Then('the recent tickets list should be hidden', null, { page });
    await And('I click the "Recent tickets" section header', null, { page });
    await Then('the recent tickets list should be visible', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/sidebar.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"user1\" to search tickets","stepMatchArguments":[{"group":{"start":18,"value":"\"user1\"","children":[{"start":19,"value":"user1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I enter \"TICKET-1\" into the search field","stepMatchArguments":[{"group":{"start":8,"value":"\"TICKET-1\"","children":[{"start":9,"value":"TICKET-1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then I should see \"TICKET-1\" in the recent tickets list","stepMatchArguments":[{"group":{"start":13,"value":"\"TICKET-1\"","children":[{"start":14,"value":"TICKET-1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And I should see the ticket title \"Implement search feature\" in the main panel","stepMatchArguments":[{"group":{"start":30,"value":"\"Implement search feature\"","children":[{"start":31,"value":"Implement search feature","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"user1\" to search tickets","stepMatchArguments":[{"group":{"start":18,"value":"\"user1\"","children":[{"start":19,"value":"user1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"And I have searched for \"TICKET-1\"","stepMatchArguments":[{"group":{"start":20,"value":"\"TICKET-1\"","children":[{"start":21,"value":"TICKET-1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I click the \"Recent tickets\" section header","stepMatchArguments":[{"group":{"start":12,"value":"\"Recent tickets\"","children":[{"start":13,"value":"Recent tickets","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the recent tickets list should be hidden","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And I click the \"Recent tickets\" section header","stepMatchArguments":[{"group":{"start":12,"value":"\"Recent tickets\"","children":[{"start":13,"value":"Recent tickets","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the recent tickets list should be visible","stepMatchArguments":[]}]},
]; // bdd-data-end