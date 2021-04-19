const Foundry = require("./utils/foundry");

class MacroManager {
  static async find(id, pack) {
    if (!pack) return game.macros.get(id);
    return await game.packs.get(pack).getEntity(id);
  }

  static execute(macro) {
    if (macro.data.type === "chat") {
      ui.chat.processMessage(macro.data.command).catch((err) => {
        ui.notifications.error(
          "There was an error in your chat message syntax."
        );
        console.error(err);
      });
    } else if (macro.data.type === "script") {
      try {
        eval(macro.data.command);
      } catch (err) {
        ui.notifications.error(
          `There was an error in your macro syntax. See the browser console for details`
        );
        console.error(err);
      }
    }
  }
}

module.exports = MacroManager;
