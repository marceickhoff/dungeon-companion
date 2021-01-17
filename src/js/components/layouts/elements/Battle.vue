<template>
	<div>
		<div class="start-battle">
			<button @click="startBattle" class="button big"><fa icon="swords"/> Start battle</button>
		</div>
		<modal :active="active" class="battle">
			<slot v-if="initiator">
				<div class="modal-headline"><fa icon="swords"></fa> Battle!</div>
				<div class="battle-entities battle-players">
					<div class="battle-entity-container battle-player-container" v-if="initiator">
						<player :data="initiator" :tallies="['level', 'bonus', 'mod']"/>
					</div>
					<div class="battle-entity-container battle-player-container" v-if="assist">
						<player :data="assist" :tallies="['level', 'bonus', 'mod']"/>
					</div>
					<div class="battle-entity-container battle-player-container" v-else-if="initiator.uuid !== self.uuid">
						<div class="battle-action">
							<button class="button big" @click="joinBattle"><fa icon="hands-helping"/> Assist</button>
						</div>
					</div>
				</div>
				<div class="battle-state">
					<span class="battle-state-icon"><fa icon="user-friends" v-if="assist"/><fa v-else icon="user"/></span>
					<span class="battle-state-strength">{{ playerStrength }}</span>
					<span class="battle-state-vs">vs</span>
					<span class="battle-state-strength">{{ monsterStrength }}</span>
					<span class="battle-state-icon"><fa icon="pastafarianism"/></span>
				</div>
				<div class="battle-entities battle-monsters">
					<div class="battle-entity-container battle-monster-container" v-for="monster in monsters">
						<monster :key="monster.uuid" :data="monster"/>
					</div>
					<div class="battle-entity-container battle-monster-container">
						<div class="battle-action">
							<button class="button big" @click="addMonster"><fa icon="pastafarianism"/> Add</button>
						</div>
					</div>
				</div>
				<div class="battle-controls">
					<button class="battle-end button big success" @click="endBattle"><fa icon="dungeon"/> End battle</button>
					<button class="battle-leave button big error" v-if="assist && assist.uuid === self.uuid" @click="leaveBattle"><fa icon="running"/> Bail</button>
				</div>
				<leaderboard/>
			</slot>
		</modal>
	</div>
</template>
<script>
import Modal from '../../base/Modal';
import Monster from '../partials/Monster';
import Player from '../partials/Player';
import Leaderboard from "./Leaderboard";
import { mapActions, mapGetters } from "vuex";

export default {
	components: {
		'modal': Modal,
		'monster': Monster,
		'player': Player,
		'leaderboard': Leaderboard
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
		playerStrength: function () {
			let strength = this.initiator.level + this.initiator.bonus + this.initiator.mod;
			if (this.assist) strength += this.assist.level + this.assist.bonus + this.assist.mod;
			return strength;
		},
		monsterStrength: function () {
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