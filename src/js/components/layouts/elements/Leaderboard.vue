<template>
	<div class="leaderboard">
		<table>
			<thead>
				<tr>
					<td>Leaderboard</td>
					<td><fa icon="trophy-alt"/></td>
					<td><fa icon="plus"/></td>
					<td><fa icon="fist-raised"/></td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="player in players">
					<td>{{ player.name }}</td>
					<td>{{ player.level }}</td>
					<td>{{ player.buff }}</td>
					<td>{{ player.level + player.buff }}</td>
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