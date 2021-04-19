const Foundry = require("./utils/foundry");
const DrawingConfigManager = require("./DrawingConfigManager");
const CanvasObserver = require("./CanvasObserver");

Foundry.Hooks.on("init", () => {
  DrawingConfigManager.initialize();
  CanvasObserver.initialize();
});
