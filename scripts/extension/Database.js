/*
----------------------------------
Creator: Mafly
Discord:
https://discord.gg/BUFxackwWb
Youtube: MaFly
https://www.youtube.com/c/MaFly16

Website:
https://mcblibrary.com/user/mafly
----------------------------------
*/

import { world } from "@minecraft/server";

export class Database extends Map {
  /**
   * Returns the total byte count of dynamic properties in the world.
   * @private
   */
  __total_byte__() {
    return world.getDynamicPropertyTotalByteCount();
  }

  /** Indicates whether the database has been loaded from dynamic properties. */
  __loaded__ = false;

  /** Gets the JSON parser. */
  get __parser__() {
    return JSON;
  }

  /**
   * Constructs a new Database instance.
   * @param {string} identifier - The identifier for the database.
   */
  constructor(identifier) {
    super();
    this.id = identifier;
  }

  /**
   * Sets a key-value pair in the database and updates the corresponding dynamic property.
   * @param {string} key - The key.
   * @param {any} value - The value.
   */
  set(key, value) {
    super.set(key, value);
    world.setDynamicProperty(
      `${this.id}_${key}`,
      this.__parser__.stringify(value)
    );
  }

  /** Loads the database from dynamic properties if not already loaded. */
  load() {
    if (this.__loaded__) return this;
    if (this.totalByte() > 500000)
      throw new Error("Usage of database: byte > 500mb");
    for (const key of world
      .getDynamicPropertyIds()
      .filter((key) => key.startsWith(`${this.id}_`))) {
      super.set(
        key.split("_")[1],
        this.__parser__.parse(world.getDynamicProperty(key))
      );
    }
    this.__loaded__ = true;
    return this;
  }

  /**
   * Returns an iterator of key-value pairs in the database.
   * @returns {Iterator<[string, any]>}
   */
  entries() {
    return super.entries();
  }

  /**
   * Returns an iterator of keys in the database.
   * @returns {Iterator<string>}
   */
  keys() {
    return Array.from(super.keys());
  }

  /**
   * Gets the value associated with the specified key, parsed from JSON.
   * @param {string} key - The key.
   * @returns {any} - The parsed value.
   */
  get(key) {
    const storedValue = super.get(key);
    return this.__parser__.parse(storedValue);
  }

  /**
   * Checks if the database contains a specific key.
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key exists, otherwise false.
   */
  has(key) {
    return super.has(key);
  }

  /**
   * Deletes a key-value pair from the database and the corresponding dynamic property.
   * @param {string} key - The key to delete.
   */
  delete(key) {
    super.delete(key);
    world.setDynamicProperty(`${this.id}_${key}`, undefined);
  }

  /** Clears all key-value pairs from the database and removes corresponding dynamic properties. */
  clear() {
    super.clear();
    for (let [key] of this) {
      world.setDynamicProperty(`${this.id}_${key}`, undefined);
    }
  }

  /** Returns the total byte count of dynamic properties in the world. */
  totalByte() {
    return this.__total_byte__;
  }
}
