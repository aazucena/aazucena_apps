<template>
	<layout title="Encryption Module">
    {{description}}
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Layout } from '../layouts';
import { description, version } from "../../../package.json";

export default defineComponent({
  components: {
    Layout
  },
  data() {
    return {
      description,
      version
    }
  }
});
</script>
