<template>
	<div>
		<button @click="openModal"><fa icon="user-plus"/></button>
		<modal :active="modal" class="party-invite">
			<slot>
				<qr-code :data="url"/>
				<a :href="'whatsapp://send?text=' + url" data-action="share/whatsapp/share"><fa :icon="['fab', 'whatsapp']"/> Share party link on WhatsApp</a>
				<button @click="copyUrlToClipboard"><span v-show="copySuccess"><fa icon="check"/> Link copied</span><span v-show="!copySuccess"><fa icon="clipboard"/> Copy party link to clipboard</span></button>
				<button @click="closeModal"><fa icon="check"/> Done</button>
			</slot>
		</modal>
	</div>
</template>
<script>
import Modal from '../../base/Modal'
import QRCode from '../../base/QRCode'
import {mapGetters} from 'vuex';

const copy = require('clipboard-copy')

export default {
	components: {
		'modal': Modal,
		'qr-code': QRCode
	},
	data() {
		return {
			modal: false,
			url: window.location.href,
			copySuccess: false
		}
	},
	computed: {
		...mapGetters('players', [
			'players'
		])
	},
	mounted() {
		if (this.players.length === 1) this.openModal();
	},
	methods: {
		openModal: function() {
			this.modal = true;
		},
		closeModal: function () {
			this.modal = false;
		},
		setCopySuccess: function() {
			this.copySuccess = true;
			setTimeout(() => this.copySuccess = false, 2000);
		},
		copyUrlToClipboard: function() {
			let promise = copy(this.url);
			if (Modernizr.promises) promise.then(this.setCopySuccess).catch(() => alert('Failed to copy link to clipboard! Please copy the link manually from the web address bar of your browser.'));
			else this.setCopySuccess();
		}
	}
}
</script>