import Vue from 'vue';
import store from './store';
import FontAwesomeIcon from "./util/icons";
import wakelock from "./util/wakelock";

// Enable wake lock
wakelock.enable();

// Config
Vue.prototype.config = require('../../config.json');

// Font Awesome icons
Vue.component('fa', FontAwesomeIcon);

// Create Vue instance
window.Vue = new Vue({
	el: '#app',
	store: store,
	components: {
		'dungeon-companion': require('./components/Index.vue').default
	}
});