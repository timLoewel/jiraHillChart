// Generated from: e2e/features/auth.feature
import { test } from "playwright-bdd";

test.describe('User Authentication', () => {

  test('Register, logout, and login', async ({ Given, page, When, Then }) => {
    await Given('I am on the login page', null, { page });
    await When('I register a new user', null, { page });
    await Then('I should see the welcome message', null, { page });
    await When('I click the "Sign out" button', null, { page });
    await Then('I should be on the login page', null, { page });
    await When('I log in with the same user', null, { page });
    await Then('I should see the welcome message again', null, { page });
    await When('I click the "Sign out" button', null, { page });
    await Then('I should be on the login page again', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/auth.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I register a new user","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should see the welcome message","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I click the \"Sign out\" button","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then I should be on the login page","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I log in with the same user","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then I should see the welcome message again","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I click the \"Sign out\" button","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should be on the login page again","stepMatchArguments":[]}]},
]; // bdd-data-end