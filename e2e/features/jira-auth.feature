Feature: Jira Authentication

  Scenario: User is redirected to enter token when search fails
    Given I am a logged-in user with an invalid Jira API key
    When I search for a ticket with the text "foo"
    Then I should be redirected to the /welcome page
    And I should see a message indicating that my token is invalid
