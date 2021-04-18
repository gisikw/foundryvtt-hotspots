const Foundry = require("foundry");
const DrawingConfigManager = require("./DrawingConfigManager");

Foundry.Hooks.on("init", () => {
  DrawingConfigManager.initialize();
});
