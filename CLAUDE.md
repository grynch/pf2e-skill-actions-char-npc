# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PF2e Skill Actions is a Foundry VTT module for the Pathfinder 2nd Edition system. It adds a button to a character's proficiencies tab that automatically adds all missing skill actions based on the character's trained skills.

- **Module ID:** `pf2e-skill-actions`
- **Compatibility:** Foundry v12-13, PF2e system v6.9.0-7.0.0
- **No build system** — pure vanilla JavaScript (ES6 modules), no TypeScript, no npm/package.json, no bundler
- **No test framework** or linting tools configured

## Development

There are no build, test, or lint commands. The module runs directly in Foundry VTT. To develop:

1. Symlink or copy the repo into Foundry's `Data/modules/pf2e-skill-actions/` directory
2. Enable the module in a Foundry world running the PF2e system
3. Changes to `.js` files take effect on page reload (F5 in Foundry)

## Architecture

Three source files in `scripts/`, loaded via the `esmodules` field in `module.json`:

**`hooks.js`** — Entry point. Registers a `renderCreatureSheetPF2e` hook that fires when a character sheet renders. Filters for `actor.type === "character"` and calls into `views.js`.

**`actionsCreator.js`** — Core logic. Contains the `actions` object mapping skill slugs to arrays of action slugs (49 untrained actions + per-skill actions for acrobatics, arcana, athletics, crafting, deception, medicine, nature, occultism, religion, society, survival, thievery). The `addSkillActions(actor)` function checks trained skills (rank >= 1), queries the `pf2e.actionspf2e` compendium, filters out actions the character already has, and clones/adds missing ones with a `flags["pf2e-skill-actions"] = { added: true }` marker.

**`views.js`** — UI rendering. `renderCreateActionButton()` injects a button into the proficiencies tab header. `renderActionSubsection()` creates a "Skill Actions" section on the actions tab by filtering for items with the module flag, excluding downtime/exploration activities, and sorting alphabetically.

### Data flow

```
Foundry renders character sheet
  → renderCreatureSheetPF2e hook (hooks.js)
    → renderCreateActionButton(html, actor)  — adds button to proficiencies tab
    → renderActionSubsection(actor, html)    — reorganizes skill actions in UI
Button click → addSkillActions(actor) — fetches compendium, adds missing actions
```

## Localization

Four language files in `lang/` (en, es, fr, pl) with keys prefixed `PF2ESKILLACTIONS.*`. Use `game.i18n.localize()` for any user-facing strings.

## Rules

- YOU MUST use the Context7 MCP when I need library/API documentation, code generation, setup or configuration steps.

## Release Process

Releases are automated via `.github/workflows/main.yml`: creating a GitHub release triggers version substitution in `module.json`, packages a `module.zip`, and publishes to the Foundry VTT package repository.
