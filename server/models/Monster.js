const UniqueEntity = require('./UniqueEntity');

/**
 * A monster.
 */
class Monster extends UniqueEntity {

	/**
	 * The monster's level.
	 * @type {number}
	 */
	level = 1;

	/**
	 * The monster's one-shot modifier.
	 * @type {number}
	 */
	mod = 0;

	/**
	 * The battle this monster is involved in.
	 * @type {Battle}
	 */
	battle;

	/**
	 * Creates a new monster.
	 * @param battle
	 */
	constructor(battle) {
		super();
		this.battle = battle;
	}


	/**
	 * Sets this monster's level.
	 * @param level
	 */
	setLevel(level) {
		if (!isNaN(level = Number(level)) && level >= 1) this.level = level | 0;
	}

	/**
	 * Sets this monster's one-shot modifier.
	 * @param mod
	 */
	setMod(mod) {
		if (!isNaN(mod = Number(mod))) this.mod = mod | 0;
	}

	/**
	 * Returns the battle this monster is involved in.
	 * @return {Battle}
	 */
	getBattle() {
		return this.battle;
	}

	/**
	 * Updates and broadcasts this monster's data to the party.
	 * @param {{level: number, mod: number}} data
	 */
	update(data) {
		if (data.hasOwnProperty('level')) this.setLevel(data.level);
		if (data.hasOwnProperty('mod')) this.setMod(data.mod);
		this.getBattle()?.getParty()?.emit('monster.update', this.bundle());
	}

	/**
	 * Bundles data of this object to be sent to the clients.
	 * @return {{mod: number, level: number}}
	 */
	bundle() {
		return {
			uuid: this.uuid,
			level: this.level,
			mod: this.mod
		}
	}
}

module.exports = Monster;