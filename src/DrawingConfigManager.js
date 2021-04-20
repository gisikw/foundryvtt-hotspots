const Foundry = require("./utils/foundry");
const Entity = require("./Entity");

const SUPPORTED_DRAWING_TYPES = [
  Foundry.CONST.DRAWING_TYPES.RECTANGLE,
  Foundry.CONST.DRAWING_TYPES.ELLIPSE,
  Foundry.CONST.DRAWING_TYPES.POLYGON,
];
const SUPPORTED_ENTITY_TYPES = [
  "Actor",
  "Item",
  "Scene",
  "JournalEntry",
  "Macro",
  "RollTable",
  "Playlist",
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
      !(
        Foundry.game().user.isGM &&
        SUPPORTED_DRAWING_TYPES.includes(data.object.type)
      )
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
        .filter(({ uuid }) => uuid && uuid.length)
        .map(async (dataset) => {
          dataset.img = await Entity.fromUuid(dataset.uuid).getImg();
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
    const { type, pack, id } = JSON.parse(
      event.dataTransfer.getData("text/plain")
    );
    if (!SUPPORTED_ENTITY_TYPES.includes(type)) return;
    const uuid = pack ? `Compendium.${pack}.${id}` : `${type}.${id}`;
    const entity = Entity.fromUuid(uuid);
    const img =
      event.target.tagName === "IMG" ? event.target : event.target.firstChild;
    img.src = await entity.getImg();
    img.previousElementSibling.classList.add("enabled");
    $(img).closest(".form-group").find("input[type='hidden']").val(uuid);
  }

  static addDeleteListeners(html) {
    html.find(".hotspots-delete-macro").on("click", ({ target }) => {
      target.classList.remove("enabled");
      const $target = $(target);
      const $group = $target.closest(".form-group");
      $group.find("input[type='hidden']").val("");
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
