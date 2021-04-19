const Foundry = require("./utils/foundry");

class MacroLookup {
  static async find(id, pack) {
    if (!pack) return game.macros.get(id);
    return await game.packs.get(pack).getEntity(id);
  }
}

module.exports = MacroLookup;
