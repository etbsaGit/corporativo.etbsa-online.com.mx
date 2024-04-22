<template>
  <q-expansion-item
    icon="filter_alt"
    label="Filtros"
    caption="Opcoines de filtrado de empleados"
  >
    <q-item>
      <q-item-section>
        <q-select
          v-model="formFilter.sucursal_id"
          :options="sucursales"
          label="Sucursal"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formFilter.linea_id"
          :options="lineas"
          label="Linea"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formFilter.departamento_id"
          :options="departamentos"
          label="Departamentos"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formFilter.puesto_id"
          :options="puestos"
          label="Puestos"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          icon="search"
          label="Buscar"
          dense
          filled
          @click="getAll"
        />
      </q-item-section>
    </q-item>
  </q-expansion-item>
  <q-separator />
  <q-item v-for="evaluee in evaluees" :key="evaluee.id">
    <q-item-section avatar>
      <q-toggle color="blue" v-model="selectedEvaluee" :val="evaluee.user_id" />
    </q-item-section>
    <q-item-section>
      {{ evaluee.nombreCompleto }}
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { survey } = defineProps(["survey"]);
const evaluees = ref([]);
const selectedEvaluee = ref([]);
const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const puestos = ref([]);

const formFilter = ref({
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  puesto_id: null,
});

const marcarToggles = () => {
  // Verificar si existe la propiedad evaluee en survey y si tiene usuarios asociados
  if (survey.evaluee) {
    // Recorrer los usuarios asociados a survey.evaluee
    for (const usuario of survey.evaluee) {
      // Agregar el ID del usuario al array selectedEvaluee
      selectedEvaluee.value.push(usuario.id);
    }
  }
};

const getAll = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("POST", final, "/api/empleado/negocios", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  const evalueesConUserId = res.empleados.filter(
    (empleado) => empleado.user_id
  );
  evaluees.value = evalueesConUserId;
};

onMounted(() => {
  getAll();
  marcarToggles();
});

defineExpose({
  selectedEvaluee,
});
</script>
