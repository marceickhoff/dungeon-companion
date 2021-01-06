const Monster = require('./Monster');

/**
 * A battle holds information about involved players and monsters.
 */
class Battle {

	/**
	 * The initiator of the battle.
	 * @type {Player}
	 */
	initiator;

	/**
	 * The assisting player.
	 * @type {Player|null}
	 */
	assist = null;

	/**
	 * A list of all monsters involved in this battle.
	 * @type {Monster[]}
	 */
	monsters = [];

	/**
	 * The party this battle takes place in.
	 * @type {Party}
	 */
	party;

	/**
	 * Creates a new battle.
	 * @param {Party} party
	 * @param {Player} initiator
	 */
	constructor(party, initiator) {
		this.party = party;
		this.initiator = initiator;
		this.resetPlayerMod();
		party.emit('battle.start', this.bundle());
	}

	/**
	 * Ends the battle.
	 */
	end() {
		this.party.emit('battle.end');
	}

	/**
	 * Adds an assisting player to the battle.
	 * @param {Player} player
	 */
	join(player) {
		if (this.assist) return;
		this.assist.player = player;
		this.party.emit('battle.join', {
			uuid: player.uuid
		});
	}

	/**
	 * Removes the current assisting player from the battle.
	 */
	leave() {
		if (!this.assist) return;
		this.assist = null;
		this.party.emit('battle.leave');
	}

	/**
	 * Resets the one-shot modifier of all players.
	 */
	resetPlayerMod() {
		for (let player of this.party.getPlayers()) player.setMod(0);
	}

	/**
	 * Adds a new monster to the battle.
	 */
	addMonster() {
		let monster = new Monster(this);
		this.monsters.push(monster);
		this.party.emit('battle.monster.add', monster.bundle());
	}

	/**
	 * Removes the monster with the given UUID.
	 * @param {String} uuid
	 */
	removeMonster(uuid) {
		let monsters = this.getMonsters();
		if (monsters) {
			let index = monsters.findIndex(monster => monster.uuid === uuid);
			if (index) {
				monsters.splice(index, 1);
				this.getParty().emit('battle.monster.remove', {
					uuid
				});
			}
		}
	}

	/**
	 * Returns all monster involved in this battle.
	 * @return {Monster[]}
	 */
	getMonsters() {
		return this.monsters;
	}

	/**
	 * Returns the monster with the specified UUID.
	 * @param {String} uuid
	 * @return {Monster}
	 */
	getMonster(uuid) {
		return this.getMonsters().find(monster => monster.uuid === uuid);
	}

	/**
	 * Returns the party this battle takes place in.
	 * @return {Party}
	 */
	getParty() {
		return this.party;
	}

	/**
	 * Bundles data of this object to be sent to the clients.
	 * @return {{initiator: {mod: number, uuid: (String|Player.uuid|null|string)}, assist: {mod: number, uuid: (String|Player.uuid|null|string)}, monsters: []}}
	 */
	bundle() {
		return {
			initiator: this.initiator,
			assist: this.assist,
			monsters: this.getMonsters().map(monster => monster.bundle())
		}
	}
}

module.exports = Battle;