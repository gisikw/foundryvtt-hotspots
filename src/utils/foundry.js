/* eslint-disable no-undef */

/* We re-export the globals here, so dependencies on Foundry's core can be
 * managed via require(). This makes it easier to stub things out for testing,
 * and improves readability */

module.exports = {
  renderTemplate,
  DragDrop,
  Hooks,
  canvas: () => canvas,
};
