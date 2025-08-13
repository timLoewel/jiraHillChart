Feature: Jira Search

  Scenario: Search for a Jira ticket
    Given I am a logged-in user with a configured Jira API key
    When I search for a ticket with the text "foo"
    Then I should see a list of tickets containing "foo"
    When I click on the first ticket in the list
    Then the main panel should show the title of the first ticket
