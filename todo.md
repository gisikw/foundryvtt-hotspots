# Backlog

## Reduce scope to clickables for a beta release
 
## Credit other plugins referenced
https://github.com/grandseiken/foundryvtt-multilevel-tokens
https://github.com/League-of-Foundry-Developers/fvtt-module-trigger-happy
https://github.com/moo-man/FVTT-SelectiveShow
  
## i18n
Extract strings to a `lang` folder so they can be internationalized

## Improve test coverage

## GM execution of certain entities
Hotspots attached to macros should not execute locally, as `eval` is a security concern. Leverage the socket API to run the macro as a GM. Consider the same for playlists (potentially as a fallback only if the user doesn't have permission?). Note that `socket: true` needs to be added to module.json to support this.

# Icebox
- Extract intersection logic to a wrapper class
- Integration tests? Build Foundry & drive the UI as a Github Action?
