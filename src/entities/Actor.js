const Entity = require("../Entity");

class Actor extends Entity {
  async activate() {
    this.object.sheet.render(true);
  }

  getImg() {
    return this.object.img;
  }
}

module.exports = Actor;
