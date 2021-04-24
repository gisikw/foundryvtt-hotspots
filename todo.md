# Backlog

## Add screenshot of drawing modal to README

## i18n

Extract strings to a `lang` folder so they can be internationalized

## Improve test coverage

## GM execution of certain entities

Hotspots attached to macros should not execute locally, as `eval` is a security concern. Leverage the socket API to run the macro as a GM. Consider the same for playlists (potentially as a fallback only if the user doesn't have permission?). Note that `socket: true` needs to be added to module.json to support this.

# Icebox

- Extract intersection logic to a wrapper class
- Integration tests? Build Foundry & drive the UI as a Github Action?
- Dynamically build module.json to add compendia with good test cases?
- A Github action that verifies `npm run build` doesn't stage any changes
- Extract Handlebars helper to outside of DrawingConfigManager
