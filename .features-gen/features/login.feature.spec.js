// Generated from: features/login.feature
import { test } from "playwright-bdd";

test.describe('User Login and Logout', () => {

  test('Successful Login for User 1', async ({ Given, page, When, And, Then }) => {
    await Given('I am on the login page', null, { page });
    await When('I enter the mock Jira host and the token for "user1"', null, { page });
    await And('I click the "Login" button', null, { page });
    await Then('I should see the avatar and name for "Test User 1"', null, { page });
  });

  test('Successful Login for User 2', async ({ Given, page, When, And, Then }) => {
    await Given('I am on the login page', null, { page });
    await When('I enter the mock Jira host and the token for "user2"', null, { page });
    await And('I click the "Login" button', null, { page });
    await Then('I should see the avatar and name for "Test User 2"', null, { page });
  });

  test('Failed Login with invalid token', async ({ Given, page, When, And, Then }) => {
    await Given('I am on the login page', null, { page });
    await When('I enter the mock Jira host and an "invalid-token"', null, { page });
    await And('I click the "Login" button', null, { page });
    await Then('I should see a "Unauthorized" error message', null, { page });
  });

  test('Successful Logout', async ({ Given, page, When, Then }) => {
    await Given('I am logged in as "user1"', null, { page });
    await When('I click the "Logout" button', null, { page });
    await Then('I should be on the login page', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/login.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I enter the mock Jira host and the token for \"user1\"","stepMatchArguments":[{"group":{"start":45,"value":"\"user1\"","children":[{"start":46,"value":"user1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I click the \"Login\" button","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then I should see the avatar and name for \"Test User 1\"","stepMatchArguments":[{"group":{"start":37,"value":"\"Test User 1\"","children":[{"start":38,"value":"Test User 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I enter the mock Jira host and the token for \"user2\"","stepMatchArguments":[{"group":{"start":45,"value":"\"user2\"","children":[{"start":46,"value":"user2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"And I click the \"Login\" button","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then I should see the avatar and name for \"Test User 2\"","stepMatchArguments":[{"group":{"start":37,"value":"\"Test User 2\"","children":[{"start":38,"value":"Test User 2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I enter the mock Jira host and an \"invalid-token\"","stepMatchArguments":[{"group":{"start":34,"value":"\"invalid-token\"","children":[{"start":35,"value":"invalid-token","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"And I click the \"Login\" button","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then I should see a \"Unauthorized\" error message","stepMatchArguments":[{"group":{"start":15,"value":"\"Unauthorized\"","children":[{"start":16,"value":"Unauthorized","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":27,"pickleLine":25,"tags":[],"steps":[{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"user1\"","stepMatchArguments":[{"group":{"start":18,"value":"\"user1\"","children":[{"start":19,"value":"user1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I click the \"Logout\" button","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then I should be on the login page","stepMatchArguments":[]}]},
]; // bdd-data-end