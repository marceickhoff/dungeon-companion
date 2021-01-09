<template>
	<unsupported v-if="browserUnsupported"/>
	<app v-else-if="self !== null && id !== null"/>
	<setup v-else-if="!loading"></setup>
	<loading v-else/>
</template>
<script>
import { mapGetters } from 'vuex';
import App from './layouts/App';
import Loading from "./layouts/Loading";
import Setup from './layouts/Setup';
import Unsupported from "./layouts/Unsupported";

export default {
	components: {
		'app': App,
		'loading': Loading,
		'setup': Setup,
		'unsupported': Unsupported,
	},
	computed: {
		...mapGetters(['loading']),
		...mapGetters('players', ['self']),
		...mapGetters('party', ['id']),
		browserUnsupported: function () {
			return !Modernizr.localstorage
				|| !Modernizr.urlsearchparams
				|| !Modernizr.flexbox
				|| !Modernizr.cssgrid
				|| !Modernizr.csstransforms;
		}
	}
}
</script>