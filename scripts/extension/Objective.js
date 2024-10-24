import { DisplaySlotId, ObjectiveSortOrder, world, system } from "@minecraft/server";

class Objective {
    /**
     * Add scoreboard objective.
     * @param {string} objective - The objective name.
     * @param {string} display - The objective display name.
    */
    add(objective, display) {
        system.run(() => {
            return world.scoreboard.addObjective(objective, display);
        })
    }

    /**
     * Remove scoreboard objective.
     * @param {string} objective - The objective name.
    */
    remove(objective) {
        system.run(() => {
            return world.scoreboard.removeObjective(objective);
        })
    }

    /**
     * Set scoreboard objective at display slot with customizable options.
     * @param {string} objective - The objective name.
     * @param {string} display - The display slot to use (e.g., "Sidebar", "BelowName", "List").
     * @param {string} sort - The sort order (e.g., "Ascending", "Descending") default is "Ascending".
    */
    display(display, objective, sort = "Ascending") {
        const displayMap = {
            "Sidebar": DisplaySlotId.Sidebar,
            "BelowName": DisplaySlotId.BelowName,
            "List": DisplaySlotId.List
        };
    
        const sortMap = {
            "Ascending": ObjectiveSortOrder.Ascending,
            "Descending": ObjectiveSortOrder.Descending,
        };
        system.run(() => {
            return world.scoreboard.setObjectiveAtDisplaySlot(displayMap[display], {
                objective: world.scoreboard.getObjective(objective),
                sortOrder: sortMap[sort],
            });
        })
    }
};

export default new Objective();
