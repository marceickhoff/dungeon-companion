const UniqueEntity = require('./UniqueEntity');
const Party = require('./Party');
const Socket = require('../util/Socket');
const config = require('../../config.json');

/**
 * A player.
 */
class Player extends UniqueEntity {

	/**
	 * The socket associated with this player.
	 * @type {Socket}
	 */
	socket;

	/**
	 * The name of this player.
	 * @type {String}
	 */
	name;

	/**
	 * The level of this player.
	 * @type {number}
	 */
	level = 1;

	/**
	 * The buff modifier of this player.
	 * @type {number}
	 */
	buff = 0;

	/**
	 * The one-shot modifier of this player.
	 * @type {number}
	 */
	mod = 0;

	/**
	 * The party this player is part of.
	 * @type {Party}
	 */
	party;

	/**
	 * Creates a new player from a socket connection.
	 * @param {Socket} socket
	 */
	constructor(socket) {
		super();
		this.socket = socket;
		let query = socket.handshake.query;
		socket.emit('player.self', {uuid: this.uuid});
		this.fromQuery(query);
		this.registerSocketEvents();
		if (this.name) {
			if (this.party) this.party.join(this);
			else this.createParty();
		}
		else {
			if (this.party) socket.on('party.join', data => {
				this.setName(data.name);
				this.party.join(this);
			});
			else socket.on('party.join', data => {
				this.setName(data.name);
				this.createParty();
			});
		}
	}

	/**
	 * Creates a new party and joins this player.
	 */
	createParty() {
		this.party = new Party;
		this.party.join(this);
	}

	/**
	 * Initiates this player with client submitted query data.
	 * @param {Object} query
	 */
	fromQuery(query) {
		if (query.name) this.setName(query.name);
		if (query.party) {
			this.party = Party.get(String(query.party));
		}
		if (!query.party || query.latestParty === query.party) {
			if (query.level) this.setLevel(query.level);
			if (query.buff) this.setBuff(query.buff);
			if (query.mod) this.setMod(query.mod);
		}
		if (query.uuid && this.party) {
			let battle = this.party.getBattle();
			if (battle) {
				if (battle.initiator.uuid === query.uuid) battle.update({ initiator: this });
				else if (battle.assist && battle.assist.uuid === query.uuid) battle.update({ assist: this });
			}
		}
	}

	/**
	 * Registers socket events.
	 */
	registerSocketEvents() {
		// Player events
		this.socket.on('player.update', (data) => (data && data.hasOwnProperty('uuid')) ? this.getParty()?.getPlayer(data.uuid)?.update(data) : this.update(data));
		this.socket.on('player.name', (data) => { if (data) this.setName(data.name) });

		// Battle events
		this.socket.on('battle.start', () => this.getParty()?.startBattle(this));
		this.socket.on('battle.end', () => this.getParty()?.endBattle());
		this.socket.on('battle.join', () => this.getParty()?.getBattle()?.join(this));
		this.socket.on('battle.leave', () => this.getParty()?.getBattle()?.leave());

		// Monster events
		this.socket.on('monster.add', () => this.getParty()?.getBattle()?.addMonster());
		this.socket.on('monster.remove', (data) => { if (data && data.hasOwnProperty('uuid')) this.getParty()?.getBattle()?.removeMonster(data.uuid) });
		this.socket.on('monster.update', (data) => { if (data && data.hasOwnProperty('uuid')) this.getParty()?.getBattle()?.getMonster(data.uuid)?.update(data) });
	}

	/**
	 * Set this player's name.
	 * @param {String} name
	 */
	setName(name) {
		name = String(name);
		if (name && name.substring(0, config.maxNameLength)) this.name = name;
	}

	/**
	 * Sets this player's level.
	 * @param {number} level
	 */
	setLevel(level) {
		if (!isNaN(level = Number(level)) && level >= 1 && level <= 10) this.level = level | 0;
	}

	/**
	 * Sets this player's buff modifier.
	 * @param {number} buff
	 */
	setBuff(buff) {
		if (!isNaN(buff = Number(buff))) this.buff = buff | 0;
	}

	/**
	 * Sets this player's one-shot modifier.
	 * @param {number} mod
	 */
	setMod(mod) {
		if (!isNaN(mod = Number(mod))) this.mod = mod | 0;
	}

	/**
	 * Gets the party where the player is currently joined.
	 * @return {Party}
	 */
	getParty() {
		return this.party && this.party.joined(this) ? this.party : undefined;
	}

	/**
	 * Updates and broadcasts this player's data to the party.
	 * @param {{name: String|undefined, level: number|undefined, buff: number|undefined, mod: number|undefined}} data
	 */
	update(data) {
		if (data.hasOwnProperty('name')) this.setName(data.name);
		if (data.hasOwnProperty('level')) this.setLevel(data.level);
		if (data.hasOwnProperty('buff')) this.setBuff(data.buff);
		if (data.hasOwnProperty('mod')) this.setMod(data.mod);
		this.getParty()?.emit('player.update', this.bundle());
	}

	/**
	 * Bundles data of this object to be sent to the clients.
	 * @return {{level: number, name: String, uuid: String, buff: number}}
	 */
	bundle() {
		return {
			uuid: this.uuid,
			name: this.name,
			level: this.level,
			buff: this.buff,
			mod: this.mod
		}
	}
}

module.exports = Player;