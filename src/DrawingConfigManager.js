const Foundry = require("./utils/foundry");
const Entity = require("./Entity");
require("./utils/handlebarsHelpers");

const SUPPORTED_DRAWING_TYPES = [
  Foundry.CONST.DRAWING_TYPES.RECTANGLE,
  Foundry.CONST.DRAWING_TYPES.ELLIPSE,
  Foundry.CONST.DRAWING_TYPES.POLYGON,
];
const BASE_HOTSPOT_DATA = {
  click: {
    title: Foundry.game().i18n.localize("Hotspots.ClickTitle"),
    categoryIcon: "fa-mouse-pointer",
    description: Foundry.game().i18n.localize("Hotspots.ClickDescription"),
  },
  enter: {
    title: Foundry.game().i18n.localize("Hotspots.EnterTitle"),
    categoryIcon: "fa-sign-in-alt",
    description: Foundry.game().i18n.localize("Hotspots.EnterDescription"),
  },
  exit: {
    title: Foundry.game().i18n.localize("Hotspots.ExitTitle"),
    categoryIcon: "fa-sign-out-alt",
    description: Foundry.game().i18n.localize("Hotspots.ExitDescription"),
  },
};
const BLANK_IMG = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

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
    const hotspotData = Foundry.mergeObject(
      { ...BASE_HOTSPOT_DATA },
      data.object.flags.hotspots
    );
    return {
      hotspots: Object.fromEntries(
        await Promise.all(
          Object.keys(hotspotData).map(async (key) => {
            const value = {
              img: BLANK_IMG,
              ...hotspotData[key],
            };
            if (value.uuid) {
              const entity = await Entity.fromUuid(value.uuid);
              value.img = entity.getImg();
              value.type = entity.getType();
              value.name = entity.getName();
              value.icon = entity.getIcon();
            }
            return [key, value];
          })
        )
      ),
    };
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
      dropSelector: ".hotspots-target",
      callbacks: { drop: this.handleDrop.bind(this) },
    }).bind(html[0]);
  }

  static async handleDrop(event) {
    const { type, pack, id } = JSON.parse(
      event.dataTransfer.getData("text/plain")
    );
    if (!Object.keys(Entity.subclasses).includes(type)) return;
    const uuid = pack ? `Compendium.${pack}.${id}` : `${type}.${id}`;
    const entity = await Entity.fromUuid(uuid);
    const $group = $(event.target).closest(".form-group");
    $group.find("img").attr("src", entity.getImg());
    $group
      .find(".hotspots-icon")
      .removeClass()
      .addClass(`hotspots-icon fas ${entity.getIcon()}`);
    $group.find(".hotspots-name").text(entity.getName());
    $group.find(".hotspots-type").text(`(${entity.getType()})`);
    $group.find("input[type='hidden']").val(uuid);
    $group.find(".hotspots-fields").addClass("enabled");
  }

  static addDeleteListeners(html) {
    html.find(".hotspots-delete").on("click", ({ target }) => {
      const $target = $(target);
      $target.removeClass("enabled");
      const $group = $target.closest(".form-group");
      $group.find(".hotspots-fields").removeClass("enabled");
      $group.find("input[type='hidden']").val("");
      $group.find("img").attr("src", BLANK_IMG);
      $group.find(".hotspots-icon").removeClass().addClass("hotspots-icon fas");
    });
  }
}

module.exports = DrawingConfigManager;
