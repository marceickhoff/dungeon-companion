<template>
	<div class="app">
		<header class="header">
			<player-name/>
			<party-invite/>
		</header>
		<main class="body">
			<player-controls/>
			<leaderboard/>
		</main>
		<connection-lost class="connection-lost"/>
	</div>
</template>

<script>
import ConnectionLost from './elements/ConnectionLost';
import Leaderboard from './elements/Leaderboard';
import PartyInvite from './elements/PartyInvite';
import PlayerControls from './elements/PlayerControls';
import PlayerName from './elements/PlayerName';

export default {
	components: {
		'connection-lost': ConnectionLost,
		'leaderboard': Leaderboard,
		'party-invite': PartyInvite,
		'player-controls': PlayerControls,
		'player-name': PlayerName,
	}
}
</script>