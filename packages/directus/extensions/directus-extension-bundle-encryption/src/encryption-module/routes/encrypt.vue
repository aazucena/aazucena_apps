<template>
	<layout title="Encrypt a message">
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
            <v-text-overflow text="Public Key" />
          </span>
        </div>
        <v-textarea :model-value="public_key" label="Public Key" />
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Layout } from '../layouts';

export default defineComponent({
  components: {
    Layout
  },
  props: {  
    message: {
      type: String,
      default: null
    },
    public_key: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const message = computed(() => props.message);
    const public_key = computed(() => props.public_key);
    return {
      message,
      public_key
    }
  }
});
</script>
