Feature: User Authentication

  Scenario: Register, logout, and login
    Given I am on the main page
    When I register a new user
    Then I should be on the welcome page
    And I should see the welcome message
    When I click the "Sign out" button
    Then I should be on the main page
    When I log in with the same user
    Then I should be on the welcome page
    And I should see the welcome message again
    When I click the "Sign out" button
    Then I should be on the main page again
