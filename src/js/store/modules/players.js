const config = require('../../../../config.json');

/**
 * Helper function to update the locally stored player data.
 * @param state
 * @param data
 */
const updateLocalStorage = function(state, data) {
	if (data.uuid === state.self) {
		['name', 'level', 'bonus', 'mod'].forEach(property => {
			if (typeof data[property] !== 'undefined') localStorage.setItem(property, data[property])
		})
	}
}

export default {
	namespaced: true,
	state: {
		self: null,
		players: []
	},
	getters: {
		self: state => state.self ? state.players.find(player => player.uuid === state.self) : null,
		players: state => state.players.sort((a, b) => {
			// Sort players by level, then bonus, then alphabetically
			if (a.level !== b.level) return a.level < b.level ? 1 : -1;
			else if (a.bonus !== b.bonus) return a.bonus < b.bonus ? 1 : -1;
			else return a.name > b.name ? 1 : -1;
		})
	},
	mutations: {
		setSelf(state, data) {
			state.self = data.uuid;
			localStorage.setItem('uuid', data.uuid);
		},
		add(state, data) {
			state.players.push(data);
			updateLocalStorage(state, data);
		},
		remove(state, data = null) {
			if (data) state.players = state.players.filter(player => player.uuid !== data.uuid);
			else state.players = [];
		},
		update(state, data) {
			let player = state.players.find(player => player.uuid === (data.uuid ? data.uuid : state.self));
			if (player) {
				if (data.name) data.name = data.name.substring(0, config.maxNameLength);
				player = Object.assign(player, data);
				updateLocalStorage(state, data);
			}
		},
		updateLocalStorage(state, data) {

		}
	},
	actions: {
		'socket.player.self': ({ commit }, data) => {
			commit('setSelf', data);
			commit('setLoading', false, { root: true });
		},
		'socket.party.join': ({ commit }, data) => commit('add', data),
		'socket.party.leave': ({ commit }, data) => commit('remove', data),
		'socket.player.update': ({ commit }, data) => commit('update', data),
		updatePlayer({ commit, state }, data) {
			commit('update', data);
			this._vm.$socket.emit('player.update', data);
		}
	}
}