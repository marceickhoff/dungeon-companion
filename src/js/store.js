import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
const config = require('../../config.json');

// Create socket connection
let socket = io(':' + config.port, {
	query: window.location.search.substring(1),
	reconnect: true
});

// Register Vuex
Vue.use(Vuex);

// Create store
let store = new Vuex.Store({
});

// Register VueSocketIO
Vue.use(new VueSocketIO({
		debug: false,
		connection: socket,
		vuex: {
			store,
			actionPrefix: "socket."
		}
	})
);

export default store;