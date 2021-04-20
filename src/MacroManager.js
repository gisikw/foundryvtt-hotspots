const Foundry = require("./utils/foundry");

class MacroManager {
  static async find(id, pack) {
    if (!pack) return Foundry.game().macros.get(id);
    return Foundry.game().packs.get(pack).getEntity(id);
  }

  static execute(macro) {
    if (macro.data.type === "chat") {
      Foundry.ui.chat.processMessage(macro.data.command).catch((err) => {
        Foundry.ui.notifications.error(
          "There was an error in your chat message syntax."
        );
        console.error(err);
      });
    } else if (macro.data.type === "script") {
      try {
        // const speaker = ChatMessage.getSpeaker();
        // const actor = game.actors.get(speaker.actor);
        // const token = canvas.tokens.get(speaker.token);
        // const character = game.user.character;
        /* eslint-disable no-eval */
        eval(macro.data.command);
      } catch (err) {
        Foundry.ui.notifications.error(
          `There was an error in your macro syntax. See the browser console for details`
        );
        console.error(err);
      }
    }
  }
}

module.exports = MacroManager;
