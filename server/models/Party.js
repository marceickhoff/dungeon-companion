const Socket = require('../util/Socket');
const Battle = require('./Battle');
const randomstring = require('randomstring');

/**
 * Players can join a party.
 * A party can host battles.
 */
class Party {

	/**
	 * The unique alphanumeric ID of this party.
	 * @type {String}
	 */
	id;

	/**
	 * A list of all players in this party.
	 * @type {Player[]}
	 */
	players = [];

	/**
	 * The current battle (or null if no battle).
	 * @type {Battle|null}
	 */
	battle = null;

	/**
	 * A list of all current parties.
	 * @type {Party[]}
	 */
	static parties = [];

	/**
	 * Creates a new party and assigns a randomly generated unique ID.
	 */
	constructor() {
		do this.id = randomstring.generate(10);
		while (Party.get(this.id));
		Party.parties.push(this);
	}

	/**
	 * Returns the party with the given ID.
	 * @param {String} id
	 * @return {Party}
	 */
	static get(id) {
		return Party.parties.find(party => party.id === id);
	}

	/**
	 * Adds a player to this party.
	 * @param {Player} player
	 */
	join(player) {
		this.removeDuplicates(player);
		this.players.push(player);
		player.party = this;
		player.socket.join(this.id);
		player.socket.to(this.id).emit('party.join', player.bundle());
		player.socket.emit('party.init', this.bundle());
		player.socket.on('disconnect', () => this.leave(player));
	}

	/**
	 * Removes all players from this party that have connected using the same UUID in the handshake query as the given player.
	 * This prevents users from spamming the refresh button, occasionally connecting multiple instances of themselves.
	 * @param {Player} player
	 */
	removeDuplicates(player) {
		for (let p of this.getPlayers()) {
			if (p.uuid === player.socket.handshake.query.uuid) {
				this.leave(p);
			}
		}
	}

	/**
	 * Checks if a given player has joined this party.
	 * @param {Player} player
	 * @return {boolean}
	 */
	joined(player) {
		return Boolean(this.getPlayers().find(p => p.uuid === player.uuid));
	}

	/**
	 * Removes a player from this party.
	 * @param {Player} player
	 */
	leave(player) {
		player.party = null;
		this.players = this.getPlayers().filter(p => p.uuid !== player.uuid);
		player.socket.to(this.id).emit('party.leave', player.bundle());
		if (this.getBattle() && this.getBattle().initiator.uuid === player.uuid) this.endBattle();
	}

	/**
	 * Returns a list with all players in this party.
	 * @return {Player[]}
	 */
	getPlayers() {
		return this.players;
	}

	/**
	 * Returns the player with the given UUID.
	 * @param {String} uuid
	 * @return {Player}
	 */
	getPlayer(uuid) {
		return this.getPlayers().find(player => player.uuid === uuid);
	}

	/**
	 * Starts a new battle in this party.
	 * @param {Player} initiator
	 */
	startBattle(initiator) {
		if (this.getBattle()) return;
		this.battle = new Battle(this, initiator);
	}

	/**
	 * Ends the currently active battle.
	 */
	endBattle() {
		let battle = this.getBattle();
		if (battle) {
			battle.end();
			this.battle = null;
		}
	}

	/**
	 * Returns the current battle.
	 * @return {Battle|null}
	 */
	getBattle() {
		return this.battle;
	}

	/**
	 * Emits a message to every player of this party.
	 * @param {String} event
	 * @param data
	 */
	emit(event, data) {
		Socket.io.to(this.id).emit(event, data);
	}

	/**
	 * Bundles data of this object to be sent to the clients.
	 * @return {{battle: ({battle: {initiator: String, assist: (String|null), monsters: *[]}, players: *[]}|{level: number, name: String, uuid: String, buff: number}|{initiator: {mod: number, uuid: (String|Player.uuid|null|string)}, assist: {mod: number, uuid: (String|Player.uuid|null|string)}, monsters: *[]}|{mod: number, level: number}|null), players: *[], id: String}}
	 */
	bundle() {
		return {
			id: this.id,
			players: this.getPlayers().map(player => player.bundle()),
			battle: this.getBattle()?.bundle() ?? null
		}
	}
}

module.exports = Party;