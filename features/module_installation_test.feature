Feature: Installing the module under test

Scenario: Enabling the module in Foundry
Given Foundry has the "DnD5e" system installed
And Foundry has the "Minimal UI" module installed
And Foundry has the local module installed
And Foundry has a world named "Test World"
And I am on the Foundry page
When I login as the GM
Then I should not see JavaScript errors
