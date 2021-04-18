import DrawingConfigManager from './DrawingConfigManager.js';

Hooks.on("init", () => {
  new DrawingConfigManager(); 
});
