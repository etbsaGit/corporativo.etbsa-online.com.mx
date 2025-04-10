<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="selectedEmpleados"
        :options="filterEmpleados"
        label="Empleados"
        option-value="id"
        option-label="apellidoCompleto"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        multiple
        use-chips
        outlined
        dense
        options-dense
        use-input
        @filter="filterFn"
        input-debounce="0"
        behavior="menu"
        :rules="[(val) => val !== null || 'Obligatorio']"
      >
        <template v-slot:no-option>
          <q-item dense>
            <q-item-section class="text-grey"> no options </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { vehicle } = defineProps(["vehicle"]);

const empleados = ref([]);
const selectedEmpleados = ref([]);
const filterEmpleados = ref(null);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = empleados.value.filter(
      (empleado) => empleado?.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/vehicle/forms", "");
  empleados.value = res.empleados;
};

const marcarToggles = () => {
  if (vehicle.empleados) {
    for (const usuario of vehicle.empleados) {
      selectedEmpleados.value.push(usuario.id);
    }
  }
};

onMounted(() => {
  getForms();
  marcarToggles();
});

defineExpose({
  selectedEmpleados,
});
</script>
