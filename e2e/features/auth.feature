Feature: User Authentication

  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click the "Login" button
    Then I should see the welcome message

  Scenario: Successful logout
    Given I am logged in
    When I click the "Sign out" button
    Then I should be on the login page
