const Entity = require("../Entity");

class Playlist extends Entity {
  getIcon() {
    return "fa-music";
  }

  async activate() {
    this.object.playAll();
  }
}

module.exports = Playlist;
