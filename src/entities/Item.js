const Entity = require("../Entity");

class Item extends Entity {
  async activate() {
    this.object.sheet.render(true);
  }

  getImg() {
    return this.object.img;
  }
}

module.exports = Item;
