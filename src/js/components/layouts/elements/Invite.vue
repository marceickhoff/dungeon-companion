<template>
	<div class="invite-button">
		<button class="show-invite button inverted" @click="openModal"><fa icon="user-plus"/></button>
		<modal :active="modal" class="invite">
			<slot>
				<div class="modal-headline"><fa icon="user-plus"></fa> Invite your friends</div>
				<p>Let your friends scan this QR code to join your party:</p>
				<qr-code :data="url"/>
				<p>Or alternatively: </p>
				<div class="invite-actions">
					<a class="button" role="button" :href="'whatsapp://send?text=' + url" data-action="share/whatsapp/share"><fa :icon="['fab', 'whatsapp']"/> Share link on WhatsApp</a>
					<button class="button" @click="copyUrlToClipboard"><span v-show="copySuccess" class="invite-copy-success"><fa icon="clipboard-check"/> Link copied</span><span v-show="!copySuccess"><fa :icon="['far', 'clipboard']"/> Copy link</span></button>
				</div>
				<div class="modal-actions">
					<button class="button big success" @click="closeModal"><fa icon="check"/> Done</button>
				</div>
			</slot>
		</modal>
	</div>
</template>
<script>
import Modal from '../../base/Modal'
import QRCode from '../../base/QRCode'
import { mapGetters } from 'vuex';

const copy = require('clipboard-copy')

export default {
	components: {
		'modal': Modal,
		'qr-code': QRCode
	},
	data() {
		return {
			modal: false,
			copySuccess: false
		}
	},
	computed: {
		...mapGetters('players', [
			'players'
		]),
		...mapGetters('party', [
			'id'
		]),
		url: function () {
			return window.location.href.split('?')[0] + '?party=' + this.id;
		}
	},
	mounted() {
		if (this.players.length === 1) this.openModal();
	},
	methods: {
		openModal: function () {
			this.modal = true;
		},
		closeModal: function () {
			this.modal = false;
		},
		setCopySuccess: function () {
			this.copySuccess = true;
			setTimeout(() => this.copySuccess = false, 2000);
		},
		copyUrlToClipboard: function () {
			let promise = copy(this.url);
			if (Modernizr.promises) promise.then(this.setCopySuccess).catch(() => alert('Failed to copy link to clipboard! Please copy the link manually from the web address bar of your browser.'));
			else this.setCopySuccess();
		}
	}
}
</script>