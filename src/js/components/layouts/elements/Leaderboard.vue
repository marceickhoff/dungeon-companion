<template>
	<div class="leaderboard">
		<table>
			<thead>
			<tr>
				<th class="leaderboard-name">Leaderboard</th>
				<th class="leaderboard-level"><fa icon="trophy-alt"/></th>
				<th class="leaderboard-bonus"><fa icon="plus"/></th>
				<th class="leaderboard-total"><fa icon="fist-raised"/></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="player in players">
				<td class="leaderboard-name">{{ player.name }}</td>
				<td class="leaderboard-level"><div :class="[player.level === 9 ? 'leaderboard-level-alert' : '', player.level >= 10 ? 'leaderboard-level-finish' : '']">{{ player.level }}</div> </td>
				<td class="leaderboard-bonus">{{ player.bonus }}</td>
				<td class="leaderboard-total">{{ player.level + player.bonus }}</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('players', [
			'players'
		])
	}
}
</script>