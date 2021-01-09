<template>
	<div class="player">
		<button v-if="monsters.length > 1" @click="remove"><fa icon="times"></fa></button>
		<tally-counter label="Level" :min="1" :value="data.level" @increase="increaseLevel" @decrease="decreaseLevel"></tally-counter>
		<tally-counter label="Mod" :value="data.mod" @increase="increaseMod" @decrease="decreaseMod"></tally-counter>
	</div>
</template>
<script>
import TallyCounter from '../../base/TallyCounter';
import {mapActions, mapGetters} from "vuex";

export default {
	components: {
		'tally-counter': TallyCounter
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	computed: {
		...mapGetters('monsters', [
			'monsters'
		]),
	},
	methods: {
		...mapActions('monsters', [
			'updateMonster',
			'removeMonster'
		]),
		increaseLevel: function() {
			this.update({ level: this.data.level + 1 });
		},
		decreaseLevel: function() {
			if (this.data.level > 1) {
				this.update({ level: this.data.level - 1 });
			}
		},
		increaseMod: function() {
			this.update({ mod: this.data.mod + 1 });
		},
		decreaseMod: function() {
			this.update({ mod: this.data.mod - 1 });
		},
		update: function(data) {
			this.updateMonster(Object.assign({}, this.data, data));
		},
		remove: function() {
			this.removeMonster({ uuid: this.data.uuid });
		}
	}
}
</script>