const Entity = require("../Entity");

class RollTable extends Entity {
  async activate() {
    this.object.draw();
  }

  getImg() {
    return this.object.data.img;
  }
}

module.exports = RollTable;
