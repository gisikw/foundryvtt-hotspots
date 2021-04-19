const Foundry = require("./utils/foundry");
const DrawingConfigManager = require("./DrawingConfigManager");

Foundry.Hooks.on("init", () => {
  DrawingConfigManager.initialize();
});
