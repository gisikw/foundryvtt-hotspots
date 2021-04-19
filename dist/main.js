/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

/* eslint-disable no-undef */

/* We re-export the globals here, so dependencies on Foundry's core can be
 * managed via require(). This makes it easier to stub things out for testing,
 * and improves readability */

module.exports = {
  renderTemplate,
  DragDrop,
  Hooks,
  canvas: () => canvas,
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Foundry = __webpack_require__(1);
const MacroManager = __webpack_require__(3);

class DrawingConfigManager {
  static initialize() {
    Foundry.Hooks.on(
      "renderDrawingConfig",
      DrawingConfigManager.handleRenderDrawingConfig.bind(this)
    );
  }

  static async handleRenderDrawingConfig(_, html, data) {
    // TODO: Permissions check
    const hotspotData = await this.prepareData(data);
    await this.injectTab(html, hotspotData);
    this.createDropZones(html);
    this.addDeleteListeners(html);
  }

  static async prepareData(data) {
    const hotspotData = data.object.flags.hotspots || {};
    await Promise.all(
      Object.values(hotspotData)
        .filter(({ macro }) => macro && macro.length)
        .map(async (dataset) => {
          const macro = await MacroManager.find(dataset.macro, dataset.pack);
          dataset.img = macro.data.img;
        })
    );
    return hotspotData;
  }

  static async injectTab(html, hotspotData) {
    Foundry.renderTemplate(
      "modules/hotspots/templates/drawing-config-hotspots-nav.hbs"
    ).then((navMarkup) => {
      html.find(".tabs .item").last().after(navMarkup);
    });
    const tabMarkup = await Foundry.renderTemplate(
      "modules/hotspots/templates/drawing-config-hotspots-tab.hbs",
      hotspotData
    );
    await html.find(".tab").last().after(tabMarkup);
  }

  static createDropZones(html) {
    new Foundry.DragDrop({
      dropSelector: ".hotspots-macro-target",
      callbacks: { drop: this.handleDrop.bind(this) },
    }).bind(html[0]);
  }

  static async handleDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (data.type !== "Macro") return;
    const { id, pack } = data;
    const macro = await MacroManager.find(id, pack);
    const img =
      event.target.tagName === "IMG" ? event.target : event.target.firstChild;
    img.src = macro.data.img;
    img.previousElementSibling.classList.add("enabled");
    const $group = $(img).closest(".form-group");
    $group.find("input[data-field='macro']").val(id);
    $group.find("input[data-field='pack']").val(pack);
  }

  static addDeleteListeners(html) {
    html.find(".hotspots-delete-macro").on("click", ({ target }) => {
      target.classList.remove("enabled");
      const $target = $(target);
      const $group = $target.closest(".form-group");
      $group.find("input[data-field='macro']").val("");
      $group.find("input[data-field='pack']").val("");
      $group
        .find("img")
        .attr(
          "src",
          "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        );
    });
  }
}

module.exports = DrawingConfigManager;


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Foundry = __webpack_require__(1);

class MacroManager {
  static async find(id, pack) {
    if (!pack) return game.macros.get(id);
    return await game.packs.get(pack).getEntity(id);
  }

  static execute(macro) {
    if (macro.data.type === "chat") {
      ui.chat.processMessage(macro.data.command).catch((err) => {
        ui.notifications.error(
          "There was an error in your chat message syntax."
        );
        console.error(err);
      });
    } else if (macro.data.type === "script") {
      try {
        eval(macro.data.command);
      } catch (err) {
        ui.notifications.error(
          `There was an error in your macro syntax. See the browser console for details`
        );
        console.error(err);
      }
    }
  }
}

module.exports = MacroManager;


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Foundry = __webpack_require__(1);

class CanvasObserver {
  static initialize() {
    Foundry.Hooks.on("canvasReady", this.refreshBoardListener.bind(this));
    // Foundry.Hooks.on('updateScene', this.refreshBoardListener.bind(this));
    // on drawing added, keep it in the cache?
  }

  static refreshBoardListener(a, b, diff, sceneId) {
    console.log("Refreshing board listener");
    const canvas = Foundry.canvas();

    // https://github.com/League-of-Foundry-Developers/fvtt-module-trigger-happy/blob/master/trigger.js#L204
    // Looks like we want to add our events on our own to canvas.stage, which is the parent pixi container to all the layers

    // This intercepts everything on the canvas, but gives us precious little;
    // we'll be rebuilding things from scratch
    // document.getElementById('board').addEventListener('mouseup', (...args) => {
    //   console.log('Hopefully we intercept everything now');
    // });

    // This doesn't fire when the user clicks tiles. Maybe that's fine?
    // const original = canvas.mouseInteractionManager.callbacks.clickLeft;
    // canvas.mouseInteractionManager.callbacks.clickLeft = (...args) => {
    //   console.log("Maybe we intercept first");
    //   original(...args);
    // };

    // This doesn't work much at all - they aren't clickable unless in the drawing tool
    // Foundry.canvas().drawings.placeables.forEach(drawing => {

    //   console.log("Manipulating drawing");
    //   drawing.frame.handle.on("mouseup", () => {
    //     console.log("Intercepted");
    //   });
    // });
  }

  static handleBoardClick(event) {
    console.log("got click event from board");

    // const {x, y} = convertCoordsToMapCoords(event);
    // if (!drawingBoundingBoxesInclude(x, y)) return;
    // const intersectingDrawing = drawings.find(d => drawingContainsPoint(x, y));
    // const macroCompositeId = intersectingDrawing.flags.hotspots.clickMacro;
    // let macro;
    // if (macroCompositeId.includes('@')) {
    //   const [pack, macro] = macroCompositeId.split('@');
    //   const compendium = game.packs.get(pack);
    //   macro = await compendium.getEntity(macroCompositeId);
    // } else {
    //   macro = game.macros.get(macroCompositeId);
    // }
    // if (this.macroRequiresGM(macro) && !this.isTheGM()) {
    //   this.requestGMMacro(macroCompositeId);
    // } else {
    //   this.executeMacro(macro);
    // }
  }
}

module.exports = CanvasObserver;


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
const Foundry = __webpack_require__(1);
const DrawingConfigManager = __webpack_require__(2);
const CanvasObserver = __webpack_require__(4);

Foundry.Hooks.on("init", () => {
  DrawingConfigManager.initialize();
  CanvasObserver.initialize();
});

})();

/******/ })()
;