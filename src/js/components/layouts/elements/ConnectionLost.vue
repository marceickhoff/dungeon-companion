<template>
	<modal :active="connectionLost">
		<slot>
			<p><fa icon="exclamation-triangle"/> Connection lost!</p>
		</slot>
	</modal>
</template>
<script>
import { mapGetters } from 'vuex';
import Modal from "../../base/Modal";

export default {
	components: {
		'modal': Modal
	},
	computed: {
		...mapGetters(['connectionLost'])
	}
}
</script>