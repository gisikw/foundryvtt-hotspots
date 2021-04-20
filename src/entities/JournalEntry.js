const Entity = require("../Entity");
const Foundry = require("../utils/foundry");

class JournalEntry extends Entity {
  async activate() {
    Foundry.Journal._showEntry(this.uuid);
  }

  getIcon() {
    return "fa-book-open";
  }
}

module.exports = JournalEntry;
