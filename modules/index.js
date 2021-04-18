console.log("HOTSPOTS WAS LOADED");

let lastDragged;

function _injectDrawingConfigTab(app, html, data) {
  const tab = `
    <a class='item' data-tab='hotspots'>
      <i class='fas fa-wifi'></i> Hotspots
    </a>
  `;
  const contents = `
    <div class='tab' data-tab='hotspots'>
      <p class='notes'>
        Use this drawing to trigger a hotspot macro
      </p>
      <hr>
      <h3 class='form-header'>
        <i class="fas fa-mouse-pointer"/></i>
        Click
      </h3>
      <p class='notes'>Description tktk</p>
      <div class='form-group'>
        <label for='clickMacro'>Macro name</label>
        <input class='dropspot' type='text' name='flags.hotspots.clickMacro' data-dtype='String' value='${(data.object.flags.hotspots || {}).clickMacro}'>
      </div>
      <hr>
      <h3 class='form-header'>
        <i class="fas fa-arrows-alt"/></i>
        Movement
      </h3>
      <p class='notes'>Description tktk</p>
      <div class='form-group'>
        <label for='moveMacro'>Macro name</label>
        <input class='dropspot' type='text' name='flags.hotspots.moveMacro' data-dtype='String' value='${(data.object.flags.hotspots || {}).moveMacro}'>
      </div>
    </div>
  `;
  html.find(".tabs .item").last().after(tab);
  html.find(".tab").last().after(contents);
  // set up any onChange events we may want
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
