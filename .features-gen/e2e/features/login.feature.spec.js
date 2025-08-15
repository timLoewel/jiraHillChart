// Generated from: e2e/features/login.feature
import { test } from "playwright-bdd";

test.describe('Login/Logout', () => {

  test('A user can log in and out', async ({ Given, page, When, Then }) => {
    await Given('I am a registered user', null, { page });
    await When('I log in', null, { page });
    await Then('I should be on the welcome page', null, { page });
    await When('I log out', null, { page });
    await Then('I should be on the main page', null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('e2e/features/login.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am a registered user","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I log in","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should be on the welcome page","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I log out","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then I should be on the main page","stepMatchArguments":[]}]},
]; // bdd-data-end