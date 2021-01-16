<template>
	<div class="entity player">
		<div class="entity-name" v-if="!hideName">{{ data.name }}</div>
		<div class="entity-stats">
			<tally-counter v-if="showTally('level')" label="Level" :min="1" :max="10" :value="data.level" @increase="increaseLevel" @decrease="decreaseLevel"></tally-counter>
			<tally-counter v-if="showTally('buff')" label="Buff" :value="data.buff" @increase="increaseBuff" @decrease="decreaseBuff"></tally-counter>
			<tally-counter v-if="showTally('mod')" label="One-Shot" :value="data.mod" @increase="increaseMod" @decrease="decreaseMod"></tally-counter>
			<tally-counter v-if="showTally('total')" :controls="false" label="Sum" :value="data.level + data.buff"></tally-counter>
		</div>
	</div>
</template>
<script>
import TallyCounter from '../../base/TallyCounter';
import {mapActions} from "vuex";

export default {
	components: {
		'tally-counter': TallyCounter
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		tallies: {
			type: Array,
			required: false
		},
		hideName: {
			type: Boolean,
			required: false
		},
	},
	methods: {
		...mapActions('players', [
			'updatePlayer'
		]),
		showTally: function(tally) {
			return !this.tallies || this.tallies.find(t => t === tally);
		},
		increaseLevel: function() {
			if (this.data.level < 10) {
				this.update({ level: this.data.level + 1 });
			}
		},
		decreaseLevel: function() {
			if (this.data.level > 1) {
				this.update({ level: this.data.level - 1 });
			}
		},
		increaseBuff: function() {
			this.update({ buff: this.data.buff + 1 });
		},
		decreaseBuff: function() {
			this.update({ buff: this.data.buff - 1 });
		},
		increaseMod: function() {
			this.update({ mod: this.data.mod + 1 });
		},
		decreaseMod: function() {
			this.update({ mod: this.data.mod - 1 });
		},
		update: function(data) {
			this.updatePlayer(Object.assign({}, this.data, data));
		}
	}
}
</script>