const Foundry = require("./utils/foundry");

class Entity {
  static async fromUuid(uuid) {
    console.log("Creating one for ", uuid);
    const object = await Foundry.fromUuid(uuid);
    const subclass = Entity.subclasses[object.entity] || Entity;
    return new subclass(uuid, object);
  }

  constructor(uuid, object) {
    this.uuid = uuid;
    this.object = object;
  }

  async getImg() {
    return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }

  async activate() {
    console.log("Not yet defined");
  }
}

module.exports = Entity;

Entity.subclasses = {
  "Macro": require("./entities/Macro"),
  "JournalEntry": require("./entities/JournalEntry"),
};
