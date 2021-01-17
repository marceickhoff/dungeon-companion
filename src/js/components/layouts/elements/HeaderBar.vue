<template>
	<header class="header">
		<div class="header-container">
			<invite/>
			<div class="name">{{ self.name }}</div>
      <name-change/>
		</div>
	</header>
</template>
<script>
import Invite from "./Invite";
import NameChange from "./NameChange";
import {mapGetters} from 'vuex';

export default {
	components: {
		'invite': Invite,
		'name-change': NameChange,
	},
	computed: {
		...mapGetters('players', [
			'self'
		]),
	}
}
</script>