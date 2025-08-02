Feature: User Login and Logout

  As a user
  I want to log in to the application using my Jira credentials
  So that I can access my personalized information

  Scenario: Successful Login for User 1
    Given I am on the login page
    When I enter the mock Jira host and the token for "user1"
    And I click the "Login" button
    Then I should see the avatar and name for "Test User 1"

  Scenario: Successful Login for User 2
    Given I am on the login page
    When I enter the mock Jira host and the token for "user2"
    And I click the "Login" button
    Then I should see the avatar and name for "Test User 2"

  Scenario: Failed Login with invalid token
    Given I am on the login page
    When I enter the mock Jira host and an "invalid-token"
    And I click the "Login" button
    Then I should see a "Unauthorized" error message

  Scenario: Successful Logout
    Given I am logged in as "user1"
    When I click the "Logout" button
    Then I should be on the login page
