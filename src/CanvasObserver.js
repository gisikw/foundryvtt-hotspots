const Foundry = require("./utils/foundry");
const Entity = require("./Entity");

const DRAWING_CHANGE_HOOKS = ["updateScene", "updateDrawing", "deleteDrawing"];

class CanvasObserver {
  static initialize() {
    Foundry.Hooks.on("canvasReady", this.handleCanvasReady.bind(this));
    DRAWING_CHANGE_HOOKS.forEach((hook) => {
      Foundry.Hooks.on(hook, this.updateActiveDrawingTargets.bind(this));
    });
  }

  static handleCanvasReady() {
    Foundry.canvas().stage.on("click", this.handleBoardClick.bind(this));
    this.updateActiveDrawingTargets();
  }

  static updateActiveDrawingTargets() {
    this.activeDrawingTargets = Foundry.canvas().drawings.placeables.filter(
      (drawing) =>
        this.drawingHasClickHotspot(drawing) &&
        this.hotspotEnabledForHiddenStatus(drawing)
    );
  }

  static drawingHasClickHotspot(drawing) {
    const { hotspots } = drawing.data.flags;
    return (
      hotspots &&
      hotspots.click &&
      hotspots.click.uuid &&
      hotspots.click.uuid.length
    );
  }

  static hotspotEnabledForHiddenStatus(drawing) {
    return !(
      drawing.data.flags.hotspots.click.disableHidden && drawing.data.hidden
    );
  }

  static handleBoardClick(event) {
    if (
      !this.activeDrawingTargets.length ||
      Foundry.canvas().activeLayer === Foundry.canvas().drawings
    )
      return;
    const point = this.getCanvasPoint(event);
    const intersection = this.activeDrawingTargets.find(
      (drawing) =>
        this.isPointInsideBoundingBox(point, drawing) &&
        this.isPointInsideShape(point, drawing)
    );
    if (intersection) this.triggerEntity(intersection);
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
    if (data.type === Foundry.CONST.DRAWING_TYPES.RECTANGLE) {
      return true;
    }
    if (data.type === Foundry.CONST.DRAWING_TYPES.ELLIPSE) {
      if (!width || !height) return false;
      const dx = x + width / 2 - point.x;
      const dy = y + height / 2 - point.y;
      return (
        (4 * (dx * dx)) / (width * width) +
          (4 * (dy * dy)) / (height * height) <=
        1
      );
    }
    if (data.type === Foundry.CONST.DRAWING_TYPES.POLYGON) {
      const cx = point.x - x;
      const cy = point.y - y;
      let w = 0;
      for (let i0 = 0; i0 < data.points.length; i0 += 1) {
        const i1 = i0 + 1 === data.points.length ? 0 : i0 + 1;
        if (
          data.points[i0][1] <= cy &&
          data.points[i1][1] > cy &&
          (data.points[i1][0] - data.points[i0][0]) *
            (cy - data.points[i0][1]) -
            (data.points[i1][1] - data.points[i0][1]) *
              (cx - data.points[i0][0]) >
            0
        ) {
          w += 1;
        }
        if (
          data.points[i0][1] > cy &&
          data.points[i1][1] <= cy &&
          (data.points[i1][0] - data.points[i0][0]) *
            (cy - data.points[i0][1]) -
            (data.points[i1][1] - data.points[i0][1]) *
              (cx - data.points[i0][0]) <
            0
        ) {
          w -= 1;
        }
      }
      return w !== 0;
    }
    return false;
  }

  static async triggerEntity(drawing) {
    (await Entity.fromUuid(drawing.data.flags.hotspots.click.uuid)).activate();
  }
}

module.exports = CanvasObserver;
