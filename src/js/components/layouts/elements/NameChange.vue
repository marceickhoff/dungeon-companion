<template>
  <div>
    <button @click="openModal" class="button inverted"><fa icon="pen"/></button>
    <modal :active="modal" class="name-change">
      <slot>
        <div class="modal-headline"><fa icon="pen"/> Change your name</div>
        <form @submit="submit">
          <label for="name">New name:</label>
          <error-message message="Please enter a name" v-if="error"/>
          <input id="name" type="text" minlength="1" :maxlength="config.maxNameLength" v-model="name" autocomplete="off">
          <div class="modal-actions">
            <button class="button big success" type="submit"><fa icon="check"/> Save</button>
            <button class="button big error" type="reset" @click="cancel"><fa icon="times"/> Cancel</button>
          </div>
        </form>
      </slot>
    </modal>
  </div>
</template>
<script>
import ErrorMessage from '../../base/ErrorMessage';
import Modal from '../../base/Modal';
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
      modal: false,
      input: null
    }
  },
  mounted() {
    this.input = document.getElementById('name');
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
      this.input.focus();
    },
    closeModal: function () {
      this.modal = false;
      this.input.blur();
    },
    cancel: function(event) {
      event.preventDefault();
      this.closeModal();
      this.name = this.self.name;
      this.error = false;
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