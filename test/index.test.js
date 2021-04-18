const Foundry = require("foundry");

const mockDrawingConfigManager = jest.fn();
jest.mock("../src/DrawingConfigManager", () => mockDrawingConfigManager);
require("../src/index");

test("index.js creates a DrawingConfigManager on Foundry init", () => {
  expect(mockDrawingConfigManager).not.toHaveBeenCalled();
  Foundry.Hooks.call("init");
  expect(mockDrawingConfigManager).toHaveBeenCalled();
});
