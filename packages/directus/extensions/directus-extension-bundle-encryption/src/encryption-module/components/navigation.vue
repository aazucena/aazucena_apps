<template>
  <v-list nav v-if="links">
    <v-list-item clickable :key="link.name" v-for="link in links" :active="current === link.name" :to="`/encryption/${link.path}`">
      <v-list-item-icon v-if="link.props.icon">
        <v-icon :name="link.props.icon || 'list_alt'" />
      </v-list-item-icon>
      <v-list-item-content>
        <v-text-overflow :text="link.props.title || link.name" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import type { ModuleRoute } from "../routes/index";
  export default defineComponent({
    name: "Navigation",
    inheritAttrs: false,
    props: {
      links: {
        type: Array<ModuleRoute>,
        default: null,
      },
      current: {
        type: String,
        default: null,
      },
    },
  });
</script>