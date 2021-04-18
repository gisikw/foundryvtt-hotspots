/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = window;

/***/ }),
/* 2 */
/***/ ((module) => {

class DrawingConfigManager {
  constructor() {
    Hooks.on("renderDrawingConfig", this.handleRenderDrawingConfig.bind(this));
  }

  async handleRenderDrawingConfig(_, html, data) {
    // TODO: Permissions check
    await this.injectTab(html, data);
    this.createDropZones(html); 
  }

  async injectTab(html, data) {
    renderTemplate('modules/hotspots/templates/drawing-config-hotspots-nav.hbs').then(markup => {
      html.find('.tabs .item').last().after(navMarkup);
    });
    const tabMarkup = await renderTemplate('modules/hotspots/templates/drawing-config-hotspots-tab.hbs', data.object.flags.hotspots || {});
    await html.find('.tab').last().after(tabMarkup);
  }

  createDropZones(html) {
    (new DragDrop({
      dropSelector: '.dropspot',
      callbacks: { drop: this.handleDrop }
    })).bind(html[0]);
  }

  handleDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'))
    if (data.type === "Macro") {
      console.log("Received macro", data);
    }
  }
}

module.exports = DrawingConfigManager;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const FVTT = __webpack_require__(1);
const DrawingConfigManager = __webpack_require__(2);

FVTT.Hooks.on("init", () => {
  new DrawingConfigManager(); 
});

})();

/******/ })()
;