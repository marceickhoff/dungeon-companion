<template>
	<div class="setup">
		<h1>Dungeon Companion</h1>
		<p>Dungeon Companion is a collaborative score tracker and combat calculator app for the tabletop RPG card game "Munchkin" by Steve Jackson.</p>
		<h2><fa icon="swords"/> {{ hasPartyParameter ? 'Join party' : 'Create a party' }}</h2>
		<form @submit="submit" class="setup-form">
			<label for="name">What's your name?</label>
			<error-message message="Please enter a name" v-if="error"/>
			<input id="name" type="text" minlength="1" :maxlength="config.maxNameLength" v-model="name" autofocus autocomplete="off">
			<button class="button big" type="submit"><fa icon="dungeon"/> Start</button>
		</form>
	</div>
</template>
<script>
import ErrorMessage from '../base/ErrorMessage';
import Modal from '../base/Modal';

export default {
	components: {
		'error-message': ErrorMessage,
		'modal': Modal
	},
	data() {
		return {
			hasPartyParameter: typeof URLSearchParams === "undefined" ? true : new URLSearchParams(window.location.search).get('party'),
			name: '',
			error: false
		}
	},
	methods: {
		submit: function (event) {
			event.preventDefault();
			if (this.name) {
				localStorage.setItem('name', this.name);
				this.$socket.emit('party.join', {
					name: this.name
				});
			} else {
				this.error = true;
				document.getElementById('name').focus();
			}
		},
	}
}
</script>