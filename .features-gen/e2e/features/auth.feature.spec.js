// Generated from: e2e/features/auth.feature
import { test } from "playwright-bdd";

test.describe('User Authentication', () => {

  test('Successful login', async ({ Given, page, When, And, Then }) => {
    await Given('I am on the login page', null, { page });
    await When('I enter valid credentials', null, { page });
    await And('I click the "Login" button', null, { page });
    await Then('I should see the welcome message', null, { page });
  });

  test('Successful logout', async ({ Given, page, When, Then }) => {
    await Given('I am logged in', null, { page });
    await When('I click the "Sign out" button', null, { page });
    await Then('I should be on the login page', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/auth.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I enter valid credentials","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And I click the \"Login\" button","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then I should see the welcome message","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I am logged in","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I click the \"Sign out\" button","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should be on the login page","stepMatchArguments":[]}]},
]; // bdd-data-end