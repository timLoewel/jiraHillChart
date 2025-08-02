Feature: Sidebar ticket search and history

  As a user
  I want to search for Jira tickets in the sidebar
  So that I can quickly view their details

  Scenario: Searching for a ticket
    Given I am logged in as "user1" to search tickets
    When I enter "TICKET-1" into the search field
    Then I should see "TICKET-1" in the recent tickets list
    And I should see the ticket title "Implement search feature" in the main panel

  Scenario: Expanding and collapsing recent tickets
    Given I am logged in as "user1" to search tickets
    And I have searched for "TICKET-1"
    When I click the "Recent tickets" section header
    Then the recent tickets list should be hidden
    And I click the "Recent tickets" section header
    Then the recent tickets list should be visible
