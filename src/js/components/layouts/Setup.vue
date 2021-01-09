<template>
	<div class="setup">
		<form @submit="submit">
			<error-message message="Please enter a name" v-if="error"/>
			<label for="name">Name:</label>
			<input id="name" type="text" minlength="1" :maxlength="config.maxNameLength" v-model="name">
			<button type="submit">{{ hasPartyParameter ? 'Join party' : 'Create party' }}</button>
		</form>
	</div>
</template>
<script>
import ErrorMessage from '../base/ErrorMessage';

export default {
	components: {
		'error-message': ErrorMessage
	},
	data() {
		return {
			hasPartyParameter: typeof URLSearchParams === "undefined" ? true : new URLSearchParams(window.location.search).has('party'),
			name: '',
			error: false
		}
	},
	methods: {
		submit: function(event) {
			event.preventDefault();
			if (this.name) {
				localStorage.setItem('name', this.name);
				this.$socket.emit('party.join', {
					name: this.name
				});
			}
			else this.error = true;
		},
	}
}
</script>