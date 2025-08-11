// Generated from: e2e/features/auth.feature
import { test } from "playwright-bdd";

test.describe('User Authentication', () => {

  test('Register, logout, and login', async ({ Given, page, When, Then, And }) => {
    await Given('I am on the main page', null, { page });
    await When('I register a new user', null, { page });
    await Then('I should be on the welcome page', null, { page });
    await And('I should see the welcome message', null, { page });
    await When('I click the "Sign out" button', null, { page });
    await Then('I should be on the main page', null, { page });
    await When('I log in with the same user', null, { page });
    await Then('I should be on the welcome page', null, { page });
    await And('I should see the welcome message again', null, { page });
    await When('I click the "Sign out" button', null, { page });
    await Then('I should be on the main page again', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/auth.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the main page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I register a new user","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should be on the welcome page","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I should see the welcome message","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I click the \"Sign out\" button","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then I should be on the main page","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I log in with the same user","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then I should be on the welcome page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And I should see the welcome message again","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I click the \"Sign out\" button","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then I should be on the main page again","stepMatchArguments":[]}]},
]; // bdd-data-end