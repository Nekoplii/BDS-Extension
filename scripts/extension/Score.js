import { system, world } from "@minecraft/server";

class Score {
    /**
     * Add score to an entity for a specific objective.
     * @param {Entity} entity - The entity to update the score.
     * @param {string} objective - The objective name.
     * @param {number} amount - The score amount to add.
     */
    add(entity, objective, amount) {
        system.run(() => {
            return world.scoreboard.getObjective(objective).addScore(entity, amount);
        })
    }
    
    /**
     * Get score to an entity for a specific objective.
     * @param {Entity} entity - The entity to update the score.
     * @param {string} objective - The objective name.
    */
   get(entity, objective) {  
        return world.scoreboard.getObjective(objective).getScore(entity) ?? 0;
    }

    /**
     * Set score to an entity for a specific objective.
     * @param {Entity} entity - The entity to update the score.
     * @param {string} objective - The objective name.
     * @param {number} amount - The score amount to set.
     */
    set(entity, objective, amount) {
        system.run(() => {
            return world.scoreboard.getObjective(objective).setScore(entity, amount);
        })
    }

    /**
     * Reset score to an entity for a specific objective.
     * @param {Entity} entity - The entity to update the score.
     * @param {string} objective - The objective name.
     */
    reset(entity, objective) {
        system.run(() => {
            return world.scoreboard.getObjective(objective).removeParticipant(entity);
        })
    }

    /**
     * Remove score to an entity for a specific objective.
     * @param {Entity} entity - The entity to update the score.
     * @param {string} objective - The objective name.
     * @param {number} amount - The score amount to remove.
     */
    remove(entity, objective, amount) {
        let score = world.scoreboard.getObjective(objective).getScore(entity) ?? 0;
        let newScore = score - amount;
        system.run(() => {
            return world.scoreboard.getObjective(objective).setScore(entity, newScore);
        })
    }
        
};

export default new Score();
