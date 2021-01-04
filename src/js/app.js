import Vue from 'vue';
import store from './store';

// Create Vue instance
window.Vue = new Vue({
	el: '#app',
	store,
	components: {
		'app': require('./components/app.vue').default
	}
});