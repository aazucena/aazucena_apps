<template>
	<private-view :title="title">
    <template v-if="breadcrumb" #headline>
      <v-breadcrumb :items="breadcrumb" />
    </template>
    <template #navigation>
      <navigation :current="current" :links="links" />
    </template>
    
    <template #title-outer:prepend>
      <v-button class="header-icon" rounded disabled icon secondary>
        <v-icon name="admin_panel_settings" />
      </v-button>
    </template>
    
    <div class="encryption-container">
      <slot></slot>
    </div>
  
  </private-view>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import routes from '../routes/index';
  import Navigation from '../components/navigation.vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    components: {
      Navigation
    },
    props: {
      title: String,
      links: {
        type: Array,
        default: () => []
      },
      current: {
        type: String,
        default: "encryption-index",
      },
    },
    setup(props) {
      const links = ref<typeof routes>(routes);
      const router = useRouter()
      // setup() receives props as the first argument.
      const current = computed(() => {
        return router.currentRoute.value.name || props.current || "encryption-index"
      });
      const breadcrumb = computed(() => {
        const array = links.value.slice(0, 1).map((route) => ({ name: route.props.title, to: `/encryption/${route.path}` }));

        const name = router.currentRoute.value.name;
        if (name && name === "encryption-index") {
          array.pop();
        }
        return array
      });
      return {
        links,
        current,
        breadcrumb
      }
    }
  })
</script>
<style>
  .encryption-container {
    padding: var(--content-padding);
    padding-top: 0;
    width: 100%;
    max-width: 1024px;
  }
  .encryption-container > div {
		margin-bottom: var(--content-padding);
  }
  .v-form {
    display: grid;
    grid-template-columns: [start] minmax(0, var(--form-column-max-width)) [half] minmax(0, var(--form-column-max-width)) [full] 1fr [fill];
    gap: var(--theme--form--row-gap) var(--theme--form--column-gap);
  }
  
  .field {
    position: relative;
  }
  @media (min-width: 960px) {
    .field-label .field-name {
      display: flex;
    }
  }
  .field-label {
    position: relative;
    display: flex;
    margin-bottom: 8px;
    cursor: pointer;
    color: var(--theme--form--field--label--foreground);
  }
  .field-label .required {
    --v-icon-color: var(--theme--primary);
    margin-left: 3px;
  }
  .v-form .field {
    grid-column: start / fill;
  }
  .v-form .full {
    grid-column: start / fill;
  }
  .v-form .half, .v-form .half-left, .v-form .half-space {
    grid-column: start / fill;
  }
  .v-form .half+.half, .v-form .half-right {
    grid-column: half / fill;
  }
  @media (min-width: 960px) {
    .v-form .field {
      grid-column: start / full;
    }
    .v-form .full {
      grid-column: start / full;
    }
    .v-form .half, .v-form .half-left, .v-form .half-space {
      grid-column: start / half;
    }
    .v-form .half+.half, .v-form .half-right {
      grid-column: half / full;
    }
  }
</style>