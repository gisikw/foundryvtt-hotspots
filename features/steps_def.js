const { Given, When, Then } = require("@cucumber/cucumber");
const FVTTC = require("./util/foundryvtt-cucumber");

// const assert = require("assert");
// const webdriver = require("selenium-webdriver");

let lastSystemReferenced;
// let lastWorldReferenced;

Given(
  "Foundry has the {string} system installed",
  { timeout: 60000 },
  async (system) => {
    lastSystemReferenced = system;
    FVTTC.installByTitle("system", system);
  }
);

Given("Foundry has a world named {string}", async (world) => {
  // lastWorldReferenced = world;
  await FVTTC.makeWorld(lastSystemReferenced, world);
});

Given(
  "Foundry has the {string} module installed",
  { timeout: 60000 },
  async (module) => {
    FVTTC.installByTitle("module", module);
  }
);

Given(
  "Foundry has the local module installed",
  { timeout: 60000 },
  async () => {
    await FVTTC.installLocalModule();
  }
);

Given("I am on the Foundry page", () => "pending");

When("I login as the GM", () => "pending");

Then("I should not see JavaScript errors", () => "pending");
