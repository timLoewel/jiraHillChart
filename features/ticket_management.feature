Feature: Ticket Management

  As a logged-in user
  I want to select and manage my active Jira ticket
  So that I can easily see what I am working on and update it.

  Background:
    Given I am logged in as "user1"

  Scenario: Selecting a ticket
    When I click on the ticket selector
    Then I should see the ticket selector dialog

    When I enter the project key "PROJ" in the project field
    And I press Enter
    Then I should see a list of "in progress" tickets for the "PROJ" project
    And the focus should be on the ticket search input

    When I filter the tickets by the text "cool"
    Then I should only see tickets containing the word "cool"

    When I click on the ticket "PROJ-123"
    Then the active ticket bar should display "PROJ-123"
    And the ticket selector dialog should be hidden

  Scenario: Viewing the active ticket
    Given I have selected the ticket "PROJ-123"
    Then the active ticket bar should display the ticket ID "PROJ-123"
    And the active ticket bar should display the ticket title "A really cool feature"
    And the active ticket bar should have a link to the ticket on Jira

  Scenario: Editing the active ticket title
    Given I have selected the ticket "PROJ-123"
    When I click on the ticket title
    Then the title should become an editable input field with the current title

    When I change the title to "A very awesome feature"
    And the input field loses focus
    Then the active ticket bar should display the new title "A very awesome feature"
    And the title change should be saved to Jira
