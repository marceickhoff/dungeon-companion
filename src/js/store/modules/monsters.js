export default {
	namespaced: true,
	state: {
		monsters: []
	},
	getters: {
		monsters: state => state.monsters
	},
	mutations: {
		add(state, data) {
			state.monsters.push(data);
		},
		remove(state, data = null) {
			if (data) state.monsters = state.monsters.filter(monster => monster.uuid !== data.uuid);
			else state.monsters = [];
		},
		update(state, data) {
			let monster = state.monsters.find(monster => monster.uuid === data.uuid);
			if (monster) monster = Object.assign(monster, data);
		},
	},
	actions: {
		'socket.monster.add': ({ commit }, data) => commit('add', data),
		'socket.monster.remove': ({ commit }, data) => commit('remove', data),
		'socket.monster.update': ({ commit }, data) => commit('update', data),
		updateMonster({ commit, state, rootState }, data) {
			if (!rootState.battle.active) return;
			commit('update', data);
			this._vm.$socket.emit('monster.update', data);
		},
		addMonster({ rootState }) {
			if (!rootState.battle.active) return;
			this._vm.$socket.emit('monster.add');
		},
		removeMonster({ commit, rootState }, data) {
			if (!rootState.battle.active) return;
			commit('remove', data);
			this._vm.$socket.emit('monster.remove', data);
		},
	}
}