<template>
	<div class="qr-code">
		<img v-if="uri" :src="uri" :alt="data">
		<span v-else><fa icon="spinner-third" class="fa-spin"/> Loading QR Code...</span>
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
  data() {
    return {
      uri: null
    }
  },
  mounted() {
	  this.setUri();
  },
  watch: {
	  data: function() {
	    this.setUri();
    }
	},
  methods: {
	  setUri: function() {
      QRCode.toDataURL(
        this.data, {
          scale: 10
        }, (err, uri) => {
          this.uri = uri;
        });
    }
  }
}
</script>