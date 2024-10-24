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

import { system } from '@minecraft/server'

class Tag {
    /**
     * Adds a tag to a player.
     * @param {Object} player - The player object.
     * @param {string} name - The name of the tag to add.
     * @param {string} prefix - (Optional, e.g., "rank:") A prefix to prepend to the tag. Defaults to an empty string.
     */
    add(player, name, prefix = '') {
        system.run(() => {
            player.addTag((prefix ? prefix : '') + name);
        })
    }

    /**
     * Gets all tags for a player that start with the specified prefix.
     * @param {Object} player - The player object.
     * @param {string} prefix (e.g., "rank:") The prefix to filter tags..
     */
    get(player, prefix) {
        return player.getTags()
            .filter((v) => v.startsWith(prefix))
            .map((v) => v.substring(prefix.length))
            .filter((x) => x);
    }

    /**
     * Checks if the player has a tag.
     * @param {Object} player - The player object.
     * @param {string} name - The name of the tag to check.
     * @param {string} prefix - (Optional, e.g., "rank:") A prefix to prepend to the tag. Defaults to an empty string.
     */
    has(player, name, prefix = '') {
        return player.hasTag((prefix ? prefix : '') + name);
    }

    /**
     * Removes a tag from the player.
     * @param {Object} player - The player object.
     * @param {string} name - The name of the tag to remove.
     * @param {string} prefix - (Optional, e.g., "rank:") A prefix to prepend to the tag. Defaults to an empty string.
     */
    remove(player, name, prefix = '') {
        system.run(() => {
            player.removeTag((prefix ? prefix : '') + name);
        })
    }
}

export default new Tag();
