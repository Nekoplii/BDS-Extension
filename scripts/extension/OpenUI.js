/*
----------------------------------
Creator: Mafly
Discord:
https://discord.gg/BUFxackwWb
Youtube: MaFly
https://www.youtube.com/c/MaFly16

Website:
https://mcblibrary.com/user/Mafly
----------------------------------
*/

import { system, world } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";

class OpenUI {
    /**
     * Opens a UI form when a specified item is used by the player.
     * 
     * @param {string} item - The item identifier in the format "IDENTIFIER:ITEM_NAME". This is the item that triggers the UI when used.
     * @param {Function} form - A callback function that will be executed to open the UI for the player.
    */
    item(item, form) {
        world.beforeEvents.itemUse.subscribe((eventData) => {
            const items = eventData.itemStack;
            const player = eventData.source;
            if (items.typeId === item) {
                system.run(() => {
                    form(player);
                });
            }
        });
    }

    /**
     * Opens a UI form when a player hits an entity with a specific tag.
     * 
     * @param {string} tag - The entity tag that the hit entity must have for the UI to open.
     * @param {Function} form - A callback function that will be executed to open the UI for the player.
    */
    entity(tag, form) {
        world.afterEvents.entityHitEntity.subscribe((data) => {
            const entity = data.hitEntity;
            const player = data.damagingEntity;
            if (entity.hasTag(tag)) {
                form(player);
            }
        });
    }

    /**
     * Forces a form to open for a player, retrying if the player is busy until a timeout is reached.
     * 
     * @param {Object} player - The player object to whom the form will be shown.
     * @param {Object} form - The form object to display to the player.
     * @param {number} [timeout=Infinity] - (Optional) The maximum number of ticks to keep retrying if the player is busy. Defaults to Infinity (no timeout).
     * 
     * @returns {Promise<Object>} - Resolves with the form response if the player accepts or interacts with it before the timeout.
     * 
     * @throws {Error} - Throws an error if the operation times out after the specified number of ticks.
    */
    async force(player, form, timeout = Infinity) {
        const startTick = system.currentTick;
        while (system.currentTick - startTick < timeout) {
            const response = await form.show(player);
            if (response.cancelationReason !== FormCancelationReason.UserBusy) {
                return response;
            }
        }
        throw new Error(`Timed out after ${timeout} ticks`);
    }
}

export default new OpenUI();
