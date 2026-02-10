import { renderActionSubsection, renderCreateActionButton } from "../scripts/views.js";

Hooks.on("renderCreatureSheetPF2e", (sheet, html, sheetData) => {
    const actor = sheet.actor;
    if (!actor || (actor.type !== "character" && actor.type !== "npc")) return;

    renderCreateActionButton(html, actor);
    renderActionSubsection(actor, html);
});

