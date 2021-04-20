const Entity = require("../Entity");

class Scene extends Entity {
  getImg() {
    return this.object.data.img;
  }

  async activate() {
    this.object.view();
  }
}

module.exports = Scene;
