const Foundry = require("./utils/foundry");
const MacroManager = require("./MacroManager");

class CanvasObserver {
  static initialize() {
    Foundry.Hooks.on("canvasReady", this.handleCanvasReady.bind(this));
    ["updateScene", "updateDrawing", "deleteDrawing"].forEach((hook) => {
      Foundry.Hooks.on(hook, this.updateActiveDrawingTargets.bind(this));
    });
  }

  static handleCanvasReady() {
    Foundry.canvas().stage.on("click", this.handleBoardClick.bind(this));
    this.updateActiveDrawingTargets();
  }

  static updateActiveDrawingTargets() {
    this.activeDrawingTargets = Foundry.canvas().drawings.placeables.filter(
      (drawing) => {
        return (
          this.drawingHasClickMacro(drawing) &&
          this.macroEnabledForHiddenStatus(drawing)
        );
      }
    );
  }

  static drawingHasClickMacro(drawing) {
    const hotspots = drawing.data.flags.hotspots;
    return (
      hotspots &&
      hotspots.click &&
      hotspots.click.macro &&
      hotspots.click.macro.length
    );
  }

  static macroEnabledForHiddenStatus(drawing) {
    return !(
      drawing.data.flags.hotspots.click.disableHidden && drawing.data.hidden
    );
  }

  static handleBoardClick(event) {
    if (!this.activeDrawingTargets.length) return;
    if (Foundry.canvas().activeLayer === Foundry.canvas().drawings) return;

    const point = this.getCanvasPoint(event);
    const intersection = this.activeDrawingTargets.find((drawing) => {
      return (
        this.isPointInsideBoundingBox(point, drawing) &&
        this.isPointInsideShape(point, drawing)
      );
    });

    if (intersection) this.executeClickMacro(intersection);
  }

  static getCanvasPoint(event) {
    const canvas = Foundry.canvas();
    const { tx, ty } = canvas.tokens.worldTransform;
    const { x, y } = canvas.stage.scale;
    return {
      x: (event.data.global.x - tx) / x,
      y: (event.data.global.y - ty) / y,
    };
  }

  static isPointInsideBoundingBox(point, drawing) {
    const { width, height, x, y } = drawing.data;
    return (
      Number.between(point.x, x, x + width) &&
      Number.between(point.y, y, y + height)
    );
  }

  static isPointInsideShape(point, drawing) {
    return true; // TODO
  }

  static async executeClickMacro(drawing) {
    const { macro, pack } = drawing.data.flags.hotspots.click;
    MacroManager.execute(await MacroManager.find(macro, pack));
  }
}

module.exports = CanvasObserver;
