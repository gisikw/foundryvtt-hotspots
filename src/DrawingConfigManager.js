const Foundry = require("foundry");

class DrawingConfigManager {
  static initialize() {
    Foundry.Hooks.on(
      "renderDrawingConfig",
      DrawingConfigManager.handleRenderDrawingConfig.bind(this)
    );
  }

  static async handleRenderDrawingConfig(_, html, data) {
    // TODO: Permissions check
    await this.injectTab(html, data);
    this.createDropZones(html);
  }

  static async injectTab(html, data) {
    Foundry.renderTemplate(
      "modules/hotspots/templates/drawing-config-hotspots-nav.hbs"
    ).then((navMarkup) => {
      html.find(".tabs .item").last().after(navMarkup);
    });
    const tabMarkup = await Foundry.renderTemplate(
      "modules/hotspots/templates/drawing-config-hotspots-tab.hbs",
      data.object.flags.hotspots || {}
    );
    await html.find(".tab").last().after(tabMarkup);
  }

  static createDropZones(html) {
    new Foundry.DragDrop({
      dropSelector: ".dropspot",
      callbacks: { drop: this.handleDrop.bind(this) },
    }).bind(html[0]);
  }

  static handleDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (data.type === "Macro") {
      console.log("Received macro", data);
    }
  }
}

module.exports = DrawingConfigManager;
