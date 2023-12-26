<template>
  <!-- <div class="q-pa-sm"> -->
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input v-model="hire_date" outlined type="date" label="Fecha Ingreso" />

    <q-toggle v-model="is_matriz" label="Empleado Matriz" />

    <q-select
      v-model="lineas"
      outlined
      :multiple="is_matriz"
      :options="optionsLineas"
      use-chips
      stack-label
      label="Lineas"
    />
    <q-select
      v-model="sucursales"
      outlined
      :multiple="is_matriz"
      :options="optionsSucursales"
      use-chips
      stack-label
      label="Sucursales"
    />
    <q-select
      v-model="sucursales"
      outlined
      :multiple="is_matriz"
      :options="optionsSucursales"
      use-chips
      stack-label
      label="Departamento"
    />
    <q-select
      v-model="sucursales"
      outlined
      :options="optionsSucursales"
      use-chips
      stack-label
      label="Puesto"
    />

    <q-input
      standout
      v-model="email"
      type="email"
      prefix="Email:"
      suffix="@etbsa.com.mx"
    >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-select
      v-model="sucursales"
      outlined
      :options="optionsBoss"
      use-chips
      option-value="id"
      option-label="name"
      options-dense
      object-value="id"
      label="Jefe Directo"
    />
  </q-form>
  <!-- </div> -->
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const is_matriz = ref(false);
    const email = ref(null);
    const hire_date = ref(null);
    const lineas = is_matriz.value ? ref([]) : ref();
    const sucursales = is_matriz.value ? ref([]) : ref();
    return {
      optionsBoss: [
        { id: 1, name: "Google" },
        { id: 2, name: "Facebook" }
      ],
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
      optionsLineas: ["Agricola", "Construccion", "Lubricantes"],
      optionsSucursales: [
        "Celaya",
        "Queretaro",
        "Salamanca",
        "Irapuato",
        "Abasolo",
        "etc..."
      ],
      is_matriz,
      lineas,
      sucursales,
      email,
      hire_date,

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first"
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted"
          });
        }
      },

      onReset() {
        is_matriz.value = null;
      }
    };
  }
};
</script>
