<template>
	<layout title="Decrypt a message">
    <div class="v-form grid">
      <div class="field half first-visible-field">
        <div class="field-label type-label">
          <span class="field-name">
            <v-text-overflow text="Message" />
          </span>
        </div>
        <v-textarea :model-value="message" label="Message" />
      </div>
      <div class="field half-right">
        <div class="field-label type-label">
        <span class="field-name">
            <v-text-overflow text="Private Key" />
          </span>
        </div>
        <v-textarea :model-value="private_key" label="Private Key" />
      </div>
      <div class="field full">
        <div class="field-label type-label">
        <span class="field-name">
            <v-text-overflow text="Passphrase" />
          </span>
        </div>
        <interface-system-input-password autocomplete="current-password" :placeholder="userStore.currentUser.password" :value="passphrase" label="Passphrase" />
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Layout } from '../layouts';
import { useStores } from '@directus/extensions-sdk';

export default defineComponent({
  components: {
    Layout
  },
  props: {
    passphrase: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    private_key: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { useUserStore } = useStores();
    const userStore = useUserStore();
    const message = computed(() => props.message);
    const private_key = computed(() => props.private_key);
    const passphrase = computed(() => props.passphrase);
    return {
      message,
      private_key,
      passphrase,
      userStore
    }
  },
  computed: {
    currentUser() {
      const user = this.userStore.currentUser;
      return user;
    }
  }
});
</script>
