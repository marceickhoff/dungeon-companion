export default {
	namespaced: true,
	state: {
		active: false,
		initiator: null,
		assist: null
	},
	getters: {
		active: state => state.active,
		initiator: (state, getters, rootState, rootGetters) => rootGetters['players/players'].find(player => player.uuid === state.initiator),
		assist: (state, getters, rootState, rootGetters) => state.assist ? rootGetters['players/players'].find(player => player.uuid === state.assist) : null,
	},
	mutations: {
		update(state, data) {
			state.active = true;
			state.initiator = data.initiator;
			if(data.assist) state.assist = data.assist;
			else state.assist = null;
		},
		end(state) {
			state.active = false;
		},
		join(state, data) {
			state.assist = data.uuid;
		},
		leave(state) {
			state.assist = null;
		}
	},
	actions: {
		'socket.battle.start': ({ commit }, data) => {
			commit('monsters/remove', null, { root: true });
			data.monsters.forEach(monster => commit('monsters/add', monster, { root: true }));
			commit('update', data);
		},
		'socket.battle.end': ({ commit }) => commit('end'),
		'socket.battle.join': ({ commit }, data) => commit('join', data),
		'socket.battle.leave': ({ commit }) => commit('leave'),
		'socket.battle.update': ({ commit }, data) => commit('update', data),
		startBattle({ commit, state }) {
			if (state.active) return;
			commit('monsters/remove', null, { root: true });
			this._vm.$socket.emit('battle.start');
		},
		endBattle({ commit, state }) {
			if (!state.active) return;
			commit('end');
			this._vm.$socket.emit('battle.end');
		},
		joinBattle({ commit, state, rootState }) {
			if (!state.active) return;
			commit('join', { uuid: rootState.players.self });
			this._vm.$socket.emit('battle.join');
		},
		leaveBattle({ commit, state }) {
			if (!state.active) return;
			commit('leave');
			this._vm.$socket.emit('battle.leave');
		}
	}
}