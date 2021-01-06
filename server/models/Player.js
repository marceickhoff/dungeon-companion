const UniqueEntity = require('./UniqueEntity');
const Party = require('./party');

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
		socket.emit('player.self', {
			uuid: this.uuid
		});
		this.fromQuery(query);
		this.registerSocketEvents();
		if (!this.name) socket.on('party.create', data => {
			this.setName(data.name);
			this.createParty();
		});
		else if (this.getParty()) {
			this.createParty();
		}
	}

	createParty() {
		this.party = new Party;
		this.party.join(this);
		this.socket.on('disconnect', () => {
			this.party.leave(this);
		});
	}

	/**
	 * Initiates this player with client submitted query data.
	 * @param {Object} query
	 */
	fromQuery(query) {
		if (query.name) this.setName(query.name);
		if (query.party) this.party = Party.getById(String(query.party));
		if (query.level) this.setLevel(query.level);
		if (query.buff) this.setBuff(query.buff);
		if (query.mod) this.setMod(query.mod);
	}

	/**
	 * Registers socket events.
	 */
	registerSocketEvents() {
		// Player events
		this.socket.on('player.update', (data) => { data.hasOwnProperty('uuid') ? this.getParty()?.getPlayer(data.uuid)?.update(data) : this.update(data) });
		this.socket.on('player.name', (data) => { this.setName(data.name) });

		// Battle events
		this.socket.on('battle.start', () => { this.getParty()?.getBattle()?.start(this) });
		this.socket.on('battle.end', () => { this.getParty()?.getBattle()?.end() });
		this.socket.on('battle.join', () => { this.getParty()?.getBattle()?.join(this) });
		this.socket.on('battle.leave', () => { this.getParty()?.getBattle()?.leave() });

		// Monster events
		this.socket.on('monster.add', () => { this.getParty()?.getBattle()?.addMonster() });
		this.socket.on('monster.remove', (data) => { if (data.hasOwnProperty('uuid')) this.getParty()?.getBattle()?.removeMonster(data.uuid) });
		this.socket.on('monster.update', (data) => { if (data.hasOwnProperty('uuid')) this.getParty()?.getBattle()?.getMonster(data.uuid)?.update(data) });
	}

	/**
	 * Set this player's name.
	 * @param {String} name
	 */
	setName(name) {
		this.name = String(name).substring(0, 20);
	}

	/**
	 * Sets this player's level.
	 * @param {number} level
	 */
	setLevel(level) {
		if (isNaN(level = Number(level))) return;
		if (level >= 1 && level <= 10) {
			this.level = level | 0;
		}
	}

	/**
	 * Sets this player's buff modifier.
	 * @param {number} buff
	 */
	setBuff(buff) {
		if (isNaN(buff = Number(buff))) return;
		this.buff = buff | 0;
	}

	/**
	 * Sets this player's one-shot modifier.
	 * @param {number} mod
	 */
	setMod(mod) {
		if (isNaN(mod = Number(mod))) return;
		this.mod = mod | 0;
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
	 * @param {{name: String, level: number, buff: number, mod: number}} data
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
			buff: this.buff
		}
	}
}

module.exports = Player;