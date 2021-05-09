Feature: Installing the module under test

Scenario: Enabling the module in Foundry
Given Foundry has the system "dnd5e" installed
And there is a game world named "Test World"
And the module is enabled
And I am on the Foundry page
When I login as the GM
Then I should not see JavaScript errors
