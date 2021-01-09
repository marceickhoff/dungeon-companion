<template>
	<div class="player-name">
		{{ self.name }}
		<button @click="openModal"><fa icon="pen"/></button>
		<modal :active="modal" class="player-name-change">
			<slot>
				<form @submit="submit">
					<error-message message="Please enter a name" v-if="error"/>
					<label for="name">New name:</label>
					<input id="name" type="text" minlength="1" :maxlength="config.maxNameLength" v-model="name">
					<button type="submit"><fa icon="check"/> Save</button>
					<button type="reset" @click="cancel"><fa icon="times"/> Cancel</button>
				</form>
			</slot>
		</modal>
	</div>
</template>
<script>
import Modal from '../../base/Modal'
import ErrorMessage from '../../base/ErrorMessage';
import {mapActions, mapGetters} from 'vuex';

export default {
	components: {
		'error-message': ErrorMessage,
		'modal': Modal
	},
	data() {
		return {
			name: '',
			error: false,
			modal: false
		}
	},
	computed: {
		...mapGetters('players', [
			'self'
		]),
	},
	watch: {
		self (self) {
			this.name = self.name;
		}
	},
	methods: {
		...mapActions('players', [
			'updatePlayer'
		]),
		openModal: function() {
			this.modal = true;
		},
		closeModal: function () {
			this.modal = false;
		},
		cancel: function(event) {
			event.preventDefault();
			this.closeModal();
			this.name = this.self.name;
		},
		submit: function(event) {
			console.log('test');
			event.preventDefault();
			if (this.name) {
				if (this.self.name !== this.name) this.updatePlayer(Object.assign({}, this.self, { name: this.name }));
				this.closeModal();
			}
			else this.error = true;
		}
	}
}
</script>