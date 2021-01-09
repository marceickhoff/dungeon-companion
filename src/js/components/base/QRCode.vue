<template>
	<div class="qr-code">
		<img v-if="dataUri" :src="dataUri" :alt="data">
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
		QRCode.toDataURL(this.data, (err, uri) => {
			this.dataUri = uri;
		});
	},
	data() {
		return {
			dataUri: null
		}
	}
}
</script>