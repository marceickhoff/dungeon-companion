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
		this.addMonster();
		party.emit('battle.start', this.bundle());
	}

	/**
	 * Ends the battle.
	 */
	end() {
		delete this.monsters;
		this.party.emit('battle.end');
	}

	/**
	 * Adds an assisting player to the battle.
	 * @param {Player} player
	 */
	join(player) {
		if (this.assist || this.initiator.uuid === player.uuid) return;
		this.assist = player;
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
		for (let player of this.party.getPlayers()) player.update({ mod: 0 });
	}

	/**
	 * Adds a new monster to the battle.
	 */
	addMonster() {
		let monster = new Monster(this);
		this.monsters.push(monster);
		this.party.emit('monster.add', monster.bundle());
	}

	/**
	 * Removes the monster with the given UUID.
	 * @param {String} uuid
	 */
	removeMonster(uuid) {
		this.monsters = this.getMonsters().filter(monster => monster.uuid !== uuid);
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
	 * Updates and broadcasts the data of this battle to the party.
	 * @param {{initiator: Player|undefined, assist: Player|undefined, monsters: Monster[]|undefined}} data
	 */
	update(data) {
		if (data.hasOwnProperty('initiator')) this.initiator = data.initiator;
		if (data.hasOwnProperty('assist')) this.assist = data.assist;
		if (data.hasOwnProperty('monsters')) this.monsters = data.monsters;
		this.getParty().emit('battle.update', this.bundle());
	}

	/**
	 * Bundles data of this object to be sent to the clients.
	 * @return {{initiator: String, assist: (String|null), monsters: *[]}}
	 */
	bundle() {
		return {
			initiator: this.initiator.uuid,
			assist: this.assist?.uuid ?? null,
			monsters: this.getMonsters().map(monster => monster.bundle())
		}
	}
}

module.exports = Battle;