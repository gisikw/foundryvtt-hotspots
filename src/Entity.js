/* eslint-disable global-require */

const Foundry = require("./utils/foundry");

class Entity {
  static async fromUuid(uuid) {
    const object = await Foundry.fromUuid(uuid);
    const Subclass = Entity.subclasses[object.entity] || Entity;
    return new Subclass(uuid, object);
  }

  constructor(uuid, object) {
    this.uuid = uuid;
    this.object = object;
  }

  getImg() {
    return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }

  getName() {
    return this.object.data.name;
  }

  getType() {
    return this.object.entity;
  }

  getIcon() {
    return "";
  }
}

module.exports = Entity;

Entity.subclasses = {
  Actor: require("./entities/Actor"),
  Item: require("./entities/Item"),
  JournalEntry: require("./entities/JournalEntry"),
  Macro: require("./entities/Macro"),
  Playlist: require("./entities/Playlist"),
  RollTable: require("./entities/RollTable"),
  Scene: require("./entities/Scene"),
};
