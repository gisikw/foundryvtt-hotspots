const FOUNDRY_URL = "http://localhost:30000"; // FIXME
const FOUNDRY_PATH = "tmp"; // FIXME

const fs = require("fs");
const util = require("util");
const streamPipeline = util.promisify(require("stream").pipeline);
const exec = util.promisify(require("child_process").exec);

const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const webdriver = require("selenium-webdriver");
const fetch = require("node-fetch");

let lastSystemReferenced;
let lastWorldReferenced;

Given(
  "Foundry has the system {string} installed",
  { timeout: 30000 },
  async (system) => {
    lastSystemReferenced = system;
    const response = await fetch(`${FOUNDRY_URL}/setup`, {
      method: "POST",
      body: JSON.stringify({
        action: "getPackages",
        type: "system",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    const game = json.packages.find(({ name }) => name === system);

    const manifest = await fetch(game.version.manifest);
    const downloadUrl = (await manifest.json()).download;

    const download = await fetch(downloadUrl);
    if (!download.ok)
      throw new Error(`unexpected response ${download.statusText}`);
    await fs.promises.mkdir(`${FOUNDRY_PATH}/Data/systems`, {
      recursive: true,
    });
    await streamPipeline(
      download.body,
      fs.createWriteStream(`${FOUNDRY_PATH}/Data/systems/${game.name}.zip`)
    );
    await exec(
      `unzip ${FOUNDRY_PATH}/Data/systems/${game.name}.zip -d ${FOUNDRY_PATH}/Data`
    );
  }
);

Given("there is a game world named {string}", async (world) => {
  await fetch(`${FOUNDRY_URL}/setup`, {
    method: "POST",
    body: JSON.stringify({
      action: "createWorld",
      background: "",
      name: world.replace(/ /g, ""),
      system: lastSystemReferenced,
      title: world,
    }),
    headers: { "Content-Type": "application/json" },
  });
});

Given("the module is enabled", function () {
  return "pending";
});

Given("I am on the Foundry page", function () {
  return "pending";
});

When("I login as the GM", function () {
  return "pending";
});

Then("I should not see JavaScript errors", function () {
  return "pending";
});
