import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

const config = require('../../config.json');

let player = {
	name: localStorage.getItem('name') ?? '',
	level: localStorage.getItem('level') ?? 1,
	buff: localStorage.getItem('buff') ?? 0,
	mod: localStorage.getItem('mod') ?? 0,
	party: localStorage.getItem('party') ?? null
};

// Create socket connection
const socket = io(':' + config.port, {
	query: (window.location.search ? window.location.search.substring(1)+'&' : '')+'name='+player.name+'&level='+player.level+'&buff='+player.buff+'&mod='+player.mod
});

// Register Vuex
Vue.use(Vuex);

// Create store
let store = new Vuex.Store({
	state: {
		self: null,
		party: {
			players: [],
			battle: null
		}
	},
	mutations: {
		setParty(state, data) {
			if (!data.id) return;
			Object.assign(state.party, data);
			window.history.replaceState(null, null, '?party='+data.id);
			localStorage.setItem('party', data.id);
		},
		setSelf(state, data) {
			if (!data.uuid) return;
			state.self = data.uuid;
		},
		addPlayer(state, data) {
			if (!state.party) return;
			state.party.players.push(data);
		},
		removePlayer(state, data){
			if (!state.party || !data.uuid) return;
			let index = state.party.players.findIndex(player => player.uuid === data.uuid);
			if (index) state.party.players.splice(index, 1);
		},
		updatePlayer(state, data) {
			if (!state.party || !data.uuid) return;
			let index = state.party.players.findIndex(player => player.uuid === data.uuid ? data.uuid : state.self);
			if (index) {
				state.party.players[index] = data;
				if (!data.uuid || data.uuid === state.self) {
					localStorage.setItem('name', data.name);
					localStorage.setItem('level', data.level);
					localStorage.setItem('buff', data.buff);
					localStorage.setItem('mod', data.mod);
				}
			}
		},
		addMonster(state, data) {
			if (!state.party || !state.party.battle) return;
			state.party.battle.monsters.push(data);
		},
		removeMonster(state, data) {
			if (!state.party || !state.party.battle || !data.uuid) return;
			let index = state.party.battle.monsters.findIndex(monster => monster.uuid === data.uuid);
			if (index) state.party.battle.monsters.splice(index, 1);
		},
		updateMonster(state, data) {
			if (!state.party || !state.party.battle || !data.uuid) return;
			let index = state.party.monsters.findIndex(monster => monster.uuid === data.uuid);
			if (index) state.party.battle.monsters[index] = data;
		},
		startBattle(state, data) {
			if (!state.party) return;
			state.party.battle = data;
		},
		endBattle(state) {
			if (!state.party) return;
			state.party.battle = null;
		},
		joinBattle(state, data) {
			if (!state.party || !state.party.battle || !data.uuid) return;
			state.party.battle.assist = data.uuid;
		},
		leaveBattle(state) {
			if (!state.party || !state.party.battle) return;
			state.party.battle.assist = null;
		},
	},
	actions: {
		'socket.player.self': ({commit}, data) => {
			commit('setSelf', data);
		},
		'socket.party.init': ({commit}, data) => {
			commit('setParty', data);
		},
		'socket.party.join': ({commit}, data) => {
			commit('removePlayer', data);
			commit('addPlayer', data);
		},
		'socket.party.leave': ({commit}, data) => {
			commit('removePlayer', data);
		},
		'socket.battle.start': ({commit}, data) => {
			commit('startBattle', data);
		},
		'socket.battle.end': ({commit}) => {
			commit('endBattle');
		},
		'socket.battle.join': ({commit}, data) => {
			commit('joinBattle', data);
		},
		'socket.battle.leave': ({commit}) => {
			commit('leaveBattle');
		},
		'socket.player.update': ({commit}, data) => {
			commit('updatePlayer', data);
		},
		'socket.monster.add': ({commit}, data) => {
			commit('addMonster', data);
		},
		'socket.monster.remove': ({commit}, data) => {
			commit('removeMonster', data);
		},
		'socket.monster.update': ({commit}, data) => {
			commit('updateMonster', data);
		},
		updatePlayer({commit, state}, data) {
			if (!state.party || !data.uuid) return;
			let player = state.party.players.find(player => player.uuid === data.uuid);
			if (player) {
				Object.assign(player, data);
				commit('updatePlayer', data);
			}
		},
		updateMonster({commit, state}, data) {
			if (!state.party || !state.party.battle || !data.uuid) return;
			let monster = state.party.battle.monsters.find(monster => monster.uuid === data.uuid);
			if (monster) {
				Object.assign(monster, data);
				commit('updateMonster', data);
			}
		},
		addMonster({commit}, data) {
			commit('addMonster', data);
		},
		removeMonster({commit}, data) {
			commit('removeMonster', data);
		},
		startBattle({commit}) {
			commit('startBattle');
		},
		endBattle({commit}) {
			commit('endBattle');
		},
		joinBattle({commit, state}) {
			commit('joinBattle', {uuid: state.self});
		},
		leaveBattle({commit}) {
			commit('leaveBattle');
		}
	}
});

// Register VueSocketIO
Vue.use(new VueSocketIO({
	debug: false,
	connection: socket,
	vuex: {
		store,
		actionPrefix: 'socket.'
	}
}));

export default store;