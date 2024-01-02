<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> ETBSA </q-toolbar-title>

        <!-- <div>ETBSA v{{ $q.version }}</div> -->
        <q-btn
          label="Login"
          class="q-ml-md"
          size="sm"
          color="blue"
          to="/login"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
// import EssentialLink from 'components/EssentialLink.vue'
// import MenuList from "./MenuList.vue";
import { useAuthStore } from "src/stores/auth";

export default defineComponent({
  name: "DefaultLayout",

  components: {
    // EssentialLink
    // MenuList
  },

  setup() {
    const auth = useAuthStore();
    const { login } = auth;

    return {
      // essentialLinks: linksList,
      // leftDrawerOpen,
      // toggleLeftDrawer() {
      //   leftDrawerOpen.value = !leftDrawerOpen.value;
      // }
      login
    };
  }
});
</script>
