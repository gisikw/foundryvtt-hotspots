```
// Execute that Macro
// Throw error is foo.data.author !== GM
if (foo.data.type === "chat") {
  ui.chat.processMessage(foo.data.command).catch(err => {
    ui.notifications.error("There was an error in your chat message syntax.");
    console.error(err);
  });
} else if (foo.data.type === "script") {
  try {
    eval(foo.data.command);
  } catch (err) {
    ui.notifications.error(`There was an error in your macro syntax. See the browser console for details`);
    console.error(err);
  }
}

// Get a Compendium
const package = 'world' // drawable-zones
const pack = 'drawable-zones' // macros
const compendium = game.packs.get(`${package}.${pack}`);

// Get an index of all the entry ids
const index = await compendium.getIndex()

// Get a Macro
const foo = await compendium.getEntity(index.find(i => i.name === "Foo")._id);


```
