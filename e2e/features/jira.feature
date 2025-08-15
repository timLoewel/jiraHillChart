Feature: Jira API Key

  Scenario: A user can add a Jira API key
    Given I am a logged-in user
    When I add a valid Jira API key
    Then I should see a success message
    And I should see the Jira search input

  @skip
  Scenario: A user cannot add an invalid Jira API key
    Given I am a logged-in user
    When I add an invalid Jira API key
    Then I should see an error message
    And I should not see the Jira search input
