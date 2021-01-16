<template>
	<div class="app">
		<header-bar/>
		<controls/>
		<leaderboard/>
		<connection-lost/>
	</div>
</template>

<script>
import ConnectionLost from './elements/ConnectionLost';
import Controls from './elements/Controls';
import Leaderboard from './elements/Leaderboard';
import HeaderBar from './elements/HeaderBar';

export default {
	components: {
		'connection-lost': ConnectionLost,
		'leaderboard': Leaderboard,
		'controls': Controls,
		'header-bar': HeaderBar
	}
}
</script>