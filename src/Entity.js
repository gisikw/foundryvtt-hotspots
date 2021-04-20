const Foundry = require("./utils/foundry");
const MacroManager = require("./MacroManager");

class Entity {
  // We probably wanna hit subclasses here,
  // so aliasing the constructor for now.
  static fromUuid(uuid) {
    return new Entity(uuid);
  }

  constructor(uuid) {
    this.uuid = uuid;
    this.entity = Foundry.fromUuid(uuid);
  }

  async getImg() {
    const entity = await this.entity;
    if (entity.entity === "Macro") {
      return entity.data.img;
    }
    return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }

  async activate() {
    const entity = await this.entity;
    if (entity.entity === "Macro") {
      MacroManager.execute(entity);
    } else if (entity.entity === "JournalEntry") {
      Foundry.Journal._showEntry(this.uuid);
    }
  }
}

module.exports = Entity;
