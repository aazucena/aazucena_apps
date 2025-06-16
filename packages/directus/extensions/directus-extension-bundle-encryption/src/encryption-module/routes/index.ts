import MainPage from "./index.vue";
import GenerateKeysPage from "./keys.vue";
import EncryptPage from "./encrypt.vue";
import DecryptPage from "./decrypt.vue";

export interface ModuleRoute {
  path: string,
  name: string,
  component: any,
  props: Record<string, any>
}

const routes: ModuleRoute[] = [
  {
    path: '',
    name: 'encryption-index',
    component: MainPage,
    props: {
      icon: "home",
      title: "Home",
      description: ""
    }
  },
  {
    path: 'keys',
    name: 'encryption-generate-keys',
    component: GenerateKeysPage,
    props: {
      icon: "key",
      title: "Keys",
      description: ""
    }
  },
  {
    path: 'encrypt',
    name: 'encryption-encrypt',
    component: EncryptPage,
    props: {
      icon: "lock",
      title: "Encrypt",
      description: ""
    }
  },
  {
    path: 'decrypt',
    name: 'encryption-decrypt',
    component: DecryptPage,
    props: {
      icon: "lock_open",
      title: "Decrypt",
      description: ""
    }
  },
];

export default routes;