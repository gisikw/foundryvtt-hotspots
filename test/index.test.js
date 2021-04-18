const Foundry = require("foundry");
const DrawingConfigManager = require("../src/DrawingConfigManager");
require("../src/index");

test("DrawingConfigManager is initialized on Foundry init", () => {
  DrawingConfigManager.initialize = jest.fn();
  expect(DrawingConfigManager.initialize).not.toHaveBeenCalled();
  Foundry.Hooks.call("init");
  expect(DrawingConfigManager.initialize).toHaveBeenCalled();
});
