<template>
	<div class="entity monster">
		<div class="entity-name">Monster</div>
		<div class="entity-stats">
			<tally-counter label="Level" :min="1" :value="data.level" @increase="increaseLevel" @decrease="decreaseLevel"></tally-counter>
			<tally-counter label="One-Shot" :value="data.mod" @increase="increaseMod" @decrease="decreaseMod"></tally-counter>
		</div>
		<button class="entity-remove button" :disabled="monsters.length <= 1" @click="remove"><fa icon="times"></fa> Remove</button>
	</div>
</template>
<script>
import TallyCounter from '../../base/TallyCounter';
import { mapActions, mapGetters } from "vuex";

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
		increaseLevel: function () {
			this.update({level: this.data.level + 1});
		},
		decreaseLevel: function () {
			if (this.data.level > 1) {
				this.update({level: this.data.level - 1});
			}
		},
		increaseMod: function () {
			this.update({mod: this.data.mod + 1});
		},
		decreaseMod: function () {
			this.update({mod: this.data.mod - 1});
		},
		update: function (data) {
			this.updateMonster(Object.assign({}, this.data, data));
		},
		remove: function () {
			this.removeMonster({uuid: this.data.uuid});
		}
	}
}
</script>