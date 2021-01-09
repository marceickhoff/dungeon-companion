<template>
	<div class="player-controls">
		<player v-if="self" :data="self" :tallies="['level', 'buff', 'total']" :hide-name="true"/>
		<battle/>
	</div>
</template>
<script>
import Battle from './Battle';
import Player from '../partials/Player';
import {mapGetters} from "vuex";

export default {
	components: {
		'battle': Battle,
		'player': Player
	},
	computed: {
		...mapGetters('players', [
			'self'
		])
	}
}
</script>