<template>
  <q-page class="flex flex-center">
    <img
      alt="Logo"
      src="~assets/logo2.jpg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
// import { defineComponent } from "vue";
import { useAuthStore } from "src/stores/auth";
import { onMounted } from "vue";

const auth = useAuthStore();
export default {
  setup() {
    onMounted(() => {
      // auth.getToken();
    });
  },
};
</script>
