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
    const { data } = drawing;
    const { width, height, x, y } = data;
    if (drawing.type === Foundry.CONST.DRAWING_TYPES.RECTANGLE) {
      return true;
    }
    if (drawing.type === Foundry.CONST.DRAWING_TYPES.ELLIPSE) {
      if (!width || !height) return false;
      const dx = x + width / 2 - point.x;
      const dy = y + height / 2 - point.y;
      return 4 * (dx * dx) / (width * width) + 4 * (dy * dy) / (height * height) <= 1;
    }
    if (drawing.type === Foundry.CONST.DRAWING_TYPES.POLYGON) {
      const cx = point.x - x;
      const cy = point.y - y;
      let w = 0;
      for (let i0 = 0; i0 < data.points.length; ++i0) {
        let i1 = i0 + 1 === data.points.length ? 0 : i0 + 1;
        if (data.points[i0][1] <= cy && data.points[i1][1] > cy &&
            (data.points[i1][0] - data.points[i0][0]) * (cy - data.points[i0][1]) -
            (data.points[i1][1] - data.points[i0][1]) * (cx - data.points[i0][0]) > 0) {
          ++w;
        }
        if (data.points[i0][1] > cy && data.points[i1][1] <= cy &&
            (data.points[i1][0] - data.points[i0][0]) * (cy - data.points[i0][1]) -
            (data.points[i1][1] - data.points[i0][1]) * (cx - data.points[i0][0]) < 0) {
          --w;
        }
      }
      return w !== 0;
    }
  }

  static async executeClickMacro(drawing) {
    const { macro, pack } = drawing.data.flags.hotspots.click;
    MacroManager.execute(await MacroManager.find(macro, pack));
  }
}

module.exports = CanvasObserver;
