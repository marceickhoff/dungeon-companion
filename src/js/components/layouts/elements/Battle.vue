<template>
	<div>
		<button @click="startBattle"><fa icon="swords"/> Start battle</button>
		<modal :active="active" class="battle" v-if="initiator">
			<slot>
				<player v-if="initiator" :data="initiator" :tallies="['level', 'buff', 'mod']"/>
				<player v-if="assist" :data="assist" :tallies="['level', 'buff', 'mod']"/>
				<button v-else-if="initiator.uuid !== self.uuid" @click="joinBattle"><fa icon="swords"/> Join</button>
				<button v-if="assist && assist.uuid === self.uuid" @click="leaveBattle"><fa icon="running"/></button>
				<button @click="endBattle"><fa icon="swords"/> End battle</button>
				<button @click="addMonster"><fa icon="pastafarianism"/> Add</button>
				<monster v-for="monster in monsters" :key="monster.uuid" :data="monster"/>
				<p><fa icon="user-friends" v-if="assist"/><fa v-else icon="user"/> {{ playerStrength }} vs {{ monsterStrength }} <fa icon="pastafarianism"/></p>
			</slot>
		</modal>
	</div>
</template>
<script>
import Modal from '../../base/Modal';
import Monster from '../partials/Monster';
import Player from '../partials/Player';
import {mapActions, mapGetters} from "vuex";

export default {
	components: {
		'modal': Modal,
		'monster': Monster,
		'player': Player
	},
	data() {
		return {
			showVictory: false,
			showDefeat: false,
			saveInitiator: {},
		}
	},
	computed: {
		...mapGetters('players', [
			'self',
			'players'
		]),
		...mapGetters('battle', [
			'active',
			'initiator',
			'assist'
		]),
		...mapGetters('monsters', [
			'monsters'
		]),
		playerStrength: function() {
			let strength = this.initiator.level + this.initiator.buff + this.initiator.mod;
			if (this.assist) strength += this.assist.level + this.assist.buff + this.assist.mod;
			return strength;
		},
		monsterStrength: function() {
			let strength = 0;
			this.monsters.forEach(monster => strength += monster.level + monster.mod);
			return strength;
		}
	},
	methods: {
		...mapActions('battle', [
			'startBattle',
			'endBattle',
			'joinBattle',
			'leaveBattle'
		]),
		...mapActions('monsters', [
			'addMonster'
		])
	}
}
</script>