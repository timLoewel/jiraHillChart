Feature: User Login and Logout

  As a user
  I want to log in to the application using my Jira credentials
  So that I can access my personalized information

  Scenario: Successful Login
    Given I am on the login page
    When I enter my Jira host and a valid personal access token
    And I click the "Login" button
    Then I should see my user avatar

  Scenario: Successful Logout
    Given I am logged in
    When I click the "Logout" button
    Then I should be on the login page
