const Foundry = require('foundry');

class DrawingConfigManager {
  constructor() {
    Foundry.Hooks.on("renderDrawingConfig", this.handleRenderDrawingConfig.bind(this));
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
    (new Foundry.DragDrop({
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
