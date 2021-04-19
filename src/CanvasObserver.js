const Foundry = require("./utils/foundry");

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
