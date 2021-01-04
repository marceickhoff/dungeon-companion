import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import store from './store';
import config from '../../config.json';

const io = require('socket.io-client');
const socket = io(config.port);

// Register VueSocketIO
Vue.use(new VueSocketIO({
		debug: false,
		connection: socket,
		vuex: {
			store,
			actionPrefix: 'socket.'
		}
	})
);

// Create Vue instance
window.Vue = new Vue({
	el: '#app',
	store,
	components: {
		'app': require('./components/app.vue').default
	}
});