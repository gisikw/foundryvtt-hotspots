console.log("HOTSPOTS WAS LOADED");

let lastDragged;

async function _injectDrawingConfigTab(app, html, data) {
  renderTemplate('modules/hotspots/templates/drawing-config-hotspots-nav.hbs').then(markup => {
    html.find('.tabs .item').last().after(markup);
  });
  renderTemplate('modules/hotspots/templates/drawing-config-hotspots-tab.hbs', data.object.flags.hotspots || {}).then(markup => {
    html.find('.tab').last().after(markup);
  });
}

function _supportDragDrop(html) {
  const dragDrop = new DragDrop({
    dropSelector: ".dropspot",
    callbacks: { 
      drop(event) { 
        const data = JSON.parse(event.dataTransfer.getData('text/plain'))
        if (data.type === "Macro") {
          // Save pack ("packname.pack")
          // Save id ("id")
        }
        console.log(data);
      }
    } 
  }).bind(html[0]);
}

function _onRenderDrawingConfig(app, html, data) {
  if (true) { // Allowed to do this at all
    _injectDrawingConfigTab(app, html, data); 
    _supportDragDrop(html);
  }
}

function _onPreUpdateDrawing(scene, drawing, update, options, userId) {
  console.log(drawing);
  console.log(update);
}

// Hooks.on('init', () => game.triggers = new TriggerHappy())
Hooks.on("renderDrawingConfig", _onRenderDrawingConfig);
Hooks.on("preUpdateDrawing", _onPreUpdateDrawing);
console.log("HOTSPOTS: Added the hook");
