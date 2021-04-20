const Foundry = require("./utils/foundry");
const MacroManager = require("./MacroManager");
const ALLOWABLE_TYPES = [
  Foundry.CONST.DRAWING_TYPES.RECTANGLE,
  Foundry.CONST.DRAWING_TYPES.ELLIPSE,
  Foundry.CONST.DRAWING_TYPES.POLYGON,
];

class DrawingConfigManager {
  static initialize() {
    Foundry.Hooks.on(
      "renderDrawingConfig",
      DrawingConfigManager.handleRenderDrawingConfig.bind(this)
    );
  }

  static async handleRenderDrawingConfig(_, html, data) {
    if (
      !(Foundry.game().user.isGM && ALLOWABLE_TYPES.includes(data.object.type))
    )
      return;
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
