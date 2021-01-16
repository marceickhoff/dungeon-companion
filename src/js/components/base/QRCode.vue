<template>
	<div class="qr-code">
		<img v-if="uri" :src="uri" :alt="data">
		<span v-else>Loading...</span>
	</div>
</template>

<script>
import QRCode from 'qrcode'

export default {
	props: {
		data: {
			type: String,
			required: true
		}
	},
	mounted() {
		QRCode.toDataURL(this.data, {
			scale: 10
		}, (err, uri) => {
			this.uri = uri;
		});
	},
	data() {
		return {
			uri: null
		}
	}
}
</script>