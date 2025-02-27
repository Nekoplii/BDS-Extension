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

const prefixCommand = "!";
const roleAdminCommand = "admin";

class CommandBuilder {
  constructor() {
    /**
     * Stores information about registered commands.
     * @type {Array<Object>}
     * @private
     */
    this.registrationCommand = [];
  }

  /**
   * Registers a new command in the system.
   *
   * @param {Object} command - The command configuration object.
   * @param {string} command.name - The name of the command.
   * @param {string} command.description - A brief description of the command.
   * @param {string} [command.usage] - Optional usage instructions for the command.
   * @param {boolean} [command.admin=false] - Whether the command is restricted to admins.
   * @param {string | Array<string>} [command.permission] - Required permissions tag to execute the command.
   * @param {Function} callback - The function executed when the command is used.
   * @param {Player} callback.player - The player executing the command.
   * @param {Array<string>} callback.args - The arguments passed to the command.
   * @param {Object} callback.command - The command object.
   */
  register(command, callback) {
    let commandData = {
      name: command.name.toLowerCase(),
      description: command.description,
      usage: command.usage || null,
      admin: command.admin || false,
      permission: command.permission || null,
      callback,
    };
    this.registrationCommand.push(commandData);
  }

  /**
   * Unregisters a command from the system.
   *
   * @param {string} name - The name of the command to remove.
   */
  unregister(name) {
    const index = this.registrationCommand.findIndex(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    if (index !== -1) {
      this.registrationCommand.splice(index, 1);
    }
  }

  /**
   * Retrieves the command data by its name.
   *
   * @param {string} name - The name of the command.
   * @returns {Object | undefined} - The command object if found, otherwise undefined.
   */
  getRegistration(name) {
    return this.registrationCommand.find((e) => e.name.toLowerCase() === name);
  }

  /**
   * Gets a list of all registered commands.
   *
   * @returns {Array<Object>} - An array of all registered command objects.
   */
  getRegistrationAll() {
    return this.registrationCommand;
  }

  /**
   * Validates whether a player has permission to execute a command.
   *
   * @param {string} command - The command name to validate.
   * @param {Player} player - The player executing the command.
   * @returns {boolean} - Returns true if the player has permission, otherwise false.
   */
  validator(command, player) {
    const cmd = this.getRegistration(command.toLowerCase());
    if (!cmd) {
      system.run(() => {
        player.sendMessage(
          `§cSYSTEM §7>> §cCommand §g${prefixCommand}${command} §cnot found. Please check that command using §g${prefixCommand}help §ccommand.`
        );
        player.playSound("note.bass");
      });
      return false;
    }
    if (cmd.admin && !player.hasTag(roleAdminCommand)) {
      system.run(() => {
        player.sendMessage(
          `§cSYSTEM §7>> §cYou do not have permission to use the §g${prefixCommand}${command} §ccommand.`
        );
        player.playSound("note.bass");
      });
      return false;
    }
    if (cmd.permission && !player.hasTag(roleAdminCommand)) {
      const permissions = Array.isArray(cmd.permission)
        ? cmd.permission
        : [cmd.permission];
      const hasPermission = permissions.some((perm) => player.hasTag(perm));
      if (!hasPermission) {
        system.run(() => {
          player.sendMessage(
            `§cSYSTEM §7>> §cYou do not have permission to use the §g${prefixCommand}${command} §ccommand.`
          );
          player.playSound("note.bass");
        });
        return false;
      }
    }
    return true;
  }
}

export const Command = new CommandBuilder();

world.beforeEvents.chatSend.subscribe((data) => {
  if (data.message.startsWith(prefixCommand)) {
    let args = data.message.slice(prefixCommand.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();
    const player = data.sender;
    data.cancel = true;

    if (Command.validator(cmd, player)) {
      let getCommand = Command.getRegistration(cmd);
      getCommand.callback(player, args, getCommand);
    }
  }
});

Command.register(
  {
    name: "help",
    description: "Provides help/list of commands.",
    usage: "[command | page]",
  },
  (player, args) => {
    if (args.length > 0 && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const command = Command.getRegistration(commandName);

      if (!command || (command.admin && !player.hasTag(roleAdminCommand))) {
        return player.sendMessage(
          `§cSYSTEM §7>> §cCommand '${commandName}' not found.`
        );
      }

      return player.sendMessage(
        `§7>>-----<< §gCommand Help §7>>-----<<\n\n` +
          `§gCommand: §7${command.name}\n` +
          `§gDescription: §7${command.description}\n` +
          `§gUsage: §7${prefixCommand}${command.name} ${command.usage || ""}`
      );
    }

    const page = Math.max(parseInt(args[0]) || 1, 1);
    const listPerPage = 10;

    const commands = Command.getRegistrationAll()
      .filter((cmd) => !cmd.admin || player.hasTag(roleAdminCommand))
      .sort((a, b) => a.name.localeCompare(b.name));

    const totalPages = Math.ceil(commands.length / listPerPage);
    if (page > totalPages) {
      return player.sendMessage(`§cInvalid page. Max: ${totalPages}.`);
    }

    const commandList = commands
      .slice((page - 1) * listPerPage, page * listPerPage)
      .map(
        (cmd) =>
          `§g${prefixCommand}${cmd.name} ${cmd.usage ? cmd.usage : ""}§7>> §o${
            cmd.description
          }`
      )
      .join("\n§r");

    player.sendMessage(
      `§7>>-----<< §g[Mafly] BDS Extension §7>>-----<<\n\n` +
        // please don't change this social media as a form of support for MaFly
        `§cDiscord §7>> §bhttps://discord.gg/BUFxackwWb\n` +
        `§cYouTube §7>> §bhttps://youtube.com/c/MaFly16\n` +
        `§cGitHub §7>> §bhttps://github.com/Nekoplii\n\n` +
        `§7>>-----<< §gShowing help page ${page} of ${totalPages} §7>>-----<<\n${commandList}`
    );
    system.run(() => player.playSound("random.pop"));
  }
);
