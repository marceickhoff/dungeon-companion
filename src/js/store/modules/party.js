export default {
	namespaced: true,
	state: {
		id: null
	},
	getters: {
		id: (state) => state.id
	},
	mutations: {
		setId(state, data) {
			state.id = data.id;
		},
	},
	actions: {
		'socket.party.init': ({ commit, rootState }, data) => {
			commit('setId', data);
			localStorage.setItem('latestParty', data.id);
			window.history.replaceState(null, null, '?party='+data.id);
			commit('players/remove', null, { root: true });
			data.players.forEach(player => commit('players/add', player, { root: true }));
			if (data.battle) {
				commit('battle/update', data.battle, { root: true });
				data.battle.monsters.forEach(monster => commit('monsters/add', monster, { root: true }));
			}
			else if (rootState.battle.active) commit('battle/end', null, { root: true });
		},
	}
}