const Foundry = require("./foundry");

Foundry.Handlebars.registerHelper({
  condStr: (q, r) => (q ? r : ""),
});
