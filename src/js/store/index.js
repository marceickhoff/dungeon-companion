import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import handshake from "../util/handshake";

// Configuration
const config = require('../../../config.json');

// Vuex modules
import battle from './modules/battle';
import monsters from './modules/monsters';
import party from './modules/party';
import players from './modules/players';

// Create socket connection
const socket = io(':' + config.port, {
	query: handshake.query()
});

// Register Vuex
Vue.use(Vuex);

// Create store
let store = new Vuex.Store({
	state: {
		loading: true,
		connectionLost: false
	},
	getters: {
		loading: state => state.loading,
		connectionLost: state => state.connectionLost,
	},
	mutations: {
		setLoading(state, data) {
			state.loading = data;
		},
		connectionLost(state) {
			state.connectionLost = true;
		},
		reconnected(state) {
			state.connectionLost = false;
		}
	},
	modules: {
		battle,
		monsters,
		party,
		players
	}
});

// Manage lost connection (can't use VueSocketIO actions since VueSocketIO is not registered yet)
socket.on('disconnect', () => {
	socket.io.opts.query = handshake.query();
	store.commit('connectionLost');
});
socket.on('connect', () => {
	if (store.getters.connectionLost) store.commit('reconnected');
});

// Register VueSocketIO
Vue.use(new VueSocketIO({
	debug: false,
	connection: socket,
	vuex: {
		store: store,
		actionPrefix: 'socket.'
	}
}));

export default store;