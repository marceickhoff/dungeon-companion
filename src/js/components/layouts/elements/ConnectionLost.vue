<template>
	<modal :active="connectionLost" class="connection-lost">
		<slot>
			<div class="modal-headline"><fa icon="unlink"/> Connection lost!</div>
			<error-message message="The connection to the server has been lost. Sorry for that!"/>
			<p><fa icon="spinner-third" class="fa-spin"/> Trying to reconnect...</p>
		</slot>
	</modal>
</template>
<script>
import { mapGetters } from 'vuex';
import ErrorMessage from "../../base/ErrorMessage";
import Modal from "../../base/Modal";

export default {
	components: {
		'error-message': ErrorMessage,
		'modal': Modal
	},
	computed: {
		...mapGetters(['connectionLost'])
	}
}
</script>