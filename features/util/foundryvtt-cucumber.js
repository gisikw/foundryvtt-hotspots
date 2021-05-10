const fetch = require("node-fetch");

const FOUNDRY_URL = process.env.FOUNDRY_URL || "http://localhost:30000";
const localModuleHost = require("./localModuleHost");

async function getPackages(type) {
  const response = await fetch(`${FOUNDRY_URL}/setup`, {
    method: "POST",
    body: JSON.stringify({
      action: "getPackages",
      type,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return (await response.json()).packages;
}

async function installByManifest(type, manifest) {
  await fetch(`${FOUNDRY_URL}/setup`, {
    method: "POST",
    body: JSON.stringify({
      action: "installPackage",
      type,
      manifest,
    }),
    headers: { "Content-Type": "application/json" },
  });
}

async function installByTitle(type, installTitle) {
  const packages = await getPackages(type);
  const { manifest } = packages.find(
    ({ title }) => title === installTitle
  ).version;
  await installByManifest(type, manifest);
}

async function makeWorld(system, title) {
  await fetch(`${FOUNDRY_URL}/setup`, {
    method: "POST",
    body: JSON.stringify({
      action: "createWorld",
      background: "", // TODO: Is this necessary?
      name: title.replace(/ /g, ""),
      system,
      title,
    }),
    headers: { "Content-Type": "application/json" },
  });
}

async function installLocalModule() {
  const manifest = await localModuleHost.start();
  await installByManifest("module", manifest);
  localModuleHost.stop();
}

module.exports = {
  getPackages,
  installByTitle,
  makeWorld,
  installLocalModule,
};
