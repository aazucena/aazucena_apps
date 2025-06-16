<template>
	<layout title="Generate Key Pair">
    <div class="v-form grid">
      <div class="field full first-visible-field">
        <div class="field-label type-label">
          <span class="field-name">
            <v-text-overflow text="Type" />
            <v-icon name="star" :sup="true" class="required" />
          </span> 
        </div>
        <v-fancy-select :items="types" v-model="type" label="Type" />
      </div>
      <div class="field full">
        <div class="field-label type-label">
        <span class="field-name">
            <v-text-overflow text="Curve encryption" />
          </span>
        </div>
        <v-select :items="curves" v-model="curve" label="Curve encryption" />
      </div>
      <div class="field full" v-if="type">
        <v-divider />
      </div>
      <div class="field full" v-if="type === 'user'">
        <div class="field-label type-label">
          <span class="field-name">
            <v-text-overflow text="User" />
          </span>
        </div>
        <v-select :items="users" v-model="user" label="User" />
      </div>
      <div class="field full" v-if="type === 'manual'">
        <div class="field-label type-label">
          <span class="field-name">
            <v-text-overflow text="Email" />
          </span>
        </div>
        <v-input autocomplete="username" v-model="email" label="Email" />
      </div>
      <div class="field full" v-if="type">
        <div class="field-label type-label">
        <span class="field-name">
            <v-text-overflow text="Passphrase" />
          </span>
        </div>
        <interface-system-input-password autocomplete="current-password" :placeholder="type == 'manual' ? userStore.currentUser.password : (userItem?.password ?? '')" v-model="passphrase" label="Passphrase" />
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { Layout } from '../layouts';
import { useStores } from '@directus/extensions-sdk';
import { useItems } from '@directus/extensions-sdk';

export default defineComponent({
  components: {
    Layout
  },
  props: {
    email: {
      type: String,
      default: null
    },
    passphrase: {
      type: String,
      default: null
    },
    curve: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    user: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { useUserStore } = useStores();
    const userStore = useUserStore();
    const store = reactive(userStore);

    const collectionRef = ref('directus_users');

    const query = {
      fields: ref(['*']),
      limit: ref(1),
      sort: ref(null),
      search: ref(null),
      filter: ref(null),
      page: ref(1),
    }

    const { getItems, items } = useItems(collectionRef, query);
    getItems();
    const data = reactive(items);
    const users = computed(() => data.value.map(item => ({ text: item.first_name + ' ' + item.last_name, value: item.id })));
    const email = computed(() => store.currentUser?.email || props.email);
    const user = computed(() => store.currentUser?.id || props.user);
    const passphrase = computed(() => props.passphrase);
    const curve = ref("curve25519");
    const curves = ref([
      {"value": "curve25519", "text": "curve25519"},
      {"value": "ed25519", "text": "ed25519"},
      {"value": "p256", "text": "p256"},
      {"value": "p384", "text": "p384"},
      {"value": "p521", "text": "p521"}
    ])
    const type = ref('manual');
    const types = ref([
      {value: "manual", text: "Manual", icon: "edit_note"},
      {value: "user", text: "User", icon: "person"},
    ])
    // const user = ref(store.currentUser?.id || props.user);
    return {
      email,
      passphrase,
      curve,
      curves,
      type,
      types,
      userStore,
      data,
      users,
      user,
    }
  },
  computed: {
    currentUser() {
      const user = this.userStore.currentUser;
      return user;
    },
    userItem() {
      const user = this.user || this.userStore.currentUser.id;
      const result = this.data.find(item => item.id === user);
      return result;
    }
  }
});
</script>