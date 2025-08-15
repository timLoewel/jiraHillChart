Feature: Login/Logout

  Scenario: A user can log in and out
    Given I am a registered user
    When I log in
    Then I should be on the welcome page
    When I log out
    Then I should be on the main page
