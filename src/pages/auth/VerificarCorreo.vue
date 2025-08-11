<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 350px; max-width: 400px">
      <q-card-section>
        <div class="text-h6 q-mb-md">Verificando correo...</div>
        <q-spinner v-if="loading" color="primary" size="50px" />
        <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref(null);

import { useAuthStore } from "src/stores/auth";

const auth = useAuthStore();

onMounted(async () => {
  const token = ref(route.query.token);

  if (!token.value) {
    error.value = "Token de verificación no encontrado.";
    loading.value = false;
    return;
  }

  try {
    const final = {
      token: token.value,
    };
    const res = await sendRequest("POST", final, "/api/verificar-correo", "");
    $q.notify({
      type: "positive",
      message: res.message || "Correo verificado correctamente",
      icon: "done_all",
    });

    auth.logout();

    // // Redirigir a login después de 2 segundos
    // setTimeout(() => {
    //   router.push("/login");
    // }, 2000);
  } catch (err) {
    error.value = err.message || "Error al verificar el correo.";
    $q.notify({
      type: "negative",
      message: error.value,
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
});
</script>
