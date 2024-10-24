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

const prefix = '!';

class CommandBuild {
  constructor() {
    /**
     * Stores information about registered commands.
     * @type {Array<Object>}
     * @private
     */
    this._registrationInformation = [];
  }

  /**
   * Registers a new command with the specified properties and callback function.
   * 
   * @param {Object} register - The command registration information.
   * @param {string} register.name - The name of the command (required).
   * @param {Array<string>} [register.aliases] - Optional aliases for the command.
   * @param {string} register.description - The description of the command (required).
   * @param {string|null} [register.usage=null] - Optional usage string showing how to use the command.
   * @param {boolean} [register.admin=false] - Optional flag indicating if the command requires admin privileges.
   * @param {Array<string>|string|null} [register.permission=null] - Optional permissions or roles required to use the command.
   * @param {Function} callback - The function to be executed when the command is run.
   */
  register(register, callback) {
    let form = {
      name: register.name.toLowerCase(),
      aliases: register.aliases
        ? register.aliases.map((v) => v.toLowerCase())
        : [],
      description: register.description,
      usage: register.usage || null,
      admin: register.admin || false,
      permission: register.permission || null,
      callback,
    };
    this._registrationInformation.push(form);
  }

  /**
   * Unregisters a command by name.
   * 
   * @param {string} name - The name of the command to unregister.
   */
  unregister(name) {
    const index = this._registrationInformation.findIndex(
      (element) => element.name.toLowerCase() === name.toLowerCase()
    );
    if (index !== -1) {
      this._registrationInformation.splice(index, 1);
    }
  }

  /**
   * Sends a message to all players in the world.
   * 
   * @param {string} text - The message text to send.
   */
  msg(text) {
    for (const player of world.getPlayers()) {
      player.sendMessage(text);
    }
  }

  /**
   * Sends an error message to all players in the world.
   * 
   * @param {string} text - The error message to send.
   */
  error(text) {
    for (const player of world.getPlayers()) {
      player.sendMessage(`§cSYSTEM §7>> §cError! ${text}`);
    }
  }

  /**
   * Validates if a command exists and if the player has the required permissions.
   * 
   * @param {string} command - The name of the command to validate.
   * @param {Object} player - The player attempting to run the command.
   * @returns {boolean} - True if the command is valid and the player has permission, otherwise false.
   */
  valid(command, player) {
    const cmd = this.getRegistration(command.toLowerCase());
    if (!cmd) {
      system.run(() => {
        player.sendMessage(
          `§cSYSTEM §7>> §cCommand §g${prefix}${command} §cnot found. Please check that command using §g${prefix}help §ccommand.`
        );
        player.playSound("note.bass");
      });
      return false;
    }
    if (cmd.admin && !player.hasTag("admin")) {
      system.run(() => {
        player.sendMessage(
          `§cSYSTEM §7>> §cYou do not have permission to use the §g${prefix}${command} §ccommand.`
        );
        player.playSound("note.bass");
      });
      return false;
    }
    if (cmd.permission && !player.hasTag("admin")) {
      const permissions = Array.isArray(cmd.permission)
        ? cmd.permission
        : [cmd.permission];
      const hasPermission = permissions.some((perm) => player.hasTag(perm));
      if (!hasPermission) {
        system.run(() => {
          player.sendMessage(
            `§cSYSTEM §7>> §cYou do not have permission to use the §g${prefix}${command} §ccommand.`
          );
          player.playSound("note.bass");
        });
        return false;
      }
    }
    return true;
  }

  /**
   * Gets a list of all registered command names that are not private.
   * 
   * @returns {Array<string>} - An array of all public command names.
   */
  get() {
    const commands = [];
    this._registrationInformation.forEach((element) => {
      if (!element.private) {
        commands.push(element.name);
      }
    });
    return commands;
  }

  /**
   * Retrieves all registered command information.
   * 
   * @returns {Array<Object>} - An array of all registered commands.
   */
  getAllRegistration() {
    return this._registrationInformation;
  }

  /**
   * Finds a registered command by its name or alias.
   * 
   * @param {string} name - The name or alias of the command.
   * @returns {Object|null} - The command registration information or null if not found.
   */
  getRegistration(name) {
    return this._registrationInformation.find(
      (element) =>
        element.name.toLowerCase() === name ||
        (element.aliases && element.aliases.includes(name))
    );
  }
}

export default new CommandBuild();
