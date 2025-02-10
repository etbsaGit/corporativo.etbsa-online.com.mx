<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectMaquina.modelo"
          filled
          dense
          label="Modelo"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formProspectMaquina.anio"
          :options="anios"
          label="Año"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProspectMaquina.marca_id"
          :options="marcas"
          label="Marca"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formProspectMaquina.condicion_id"
          :options="condiciones"
          label="Condicion"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProspectMaquina.clas_equipo_id"
          :options="clasEquipos"
          label="Clasificacion de equipo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formProspectMaquina.tipo_equipo_id"
          :options="tiposEquipo"
          label="Tipo de equipo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { prospectMaquina, prospect } = defineProps([
  "prospectMaquina",
  "prospect",
]);

const marcas = ref([]);
const condiciones = ref([]);
const clasEquipos = ref([]);
const tiposEquipo = ref([]);
const anios = ref([
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
  2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988,
  1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975,
  1974, 1973, 1972, 1971, 1970,
]);

const myForm = ref(null);

const formProspectMaquina = ref({
  id: prospectMaquina ? prospectMaquina.id : null,
  modelo: prospectMaquina ? prospectMaquina.modelo : null,
  anio: prospectMaquina ? prospectMaquina.anio : null,
  prospect_id: prospectMaquina ? prospectMaquina.prospect_id : prospect.id,
  marca_id: prospectMaquina ? prospectMaquina.marca_id : null,
  condicion_id: prospectMaquina ? prospectMaquina.condicion_id : null,
  clas_equipo_id: prospectMaquina ? prospectMaquina.clas_equipo_id : null,
  tipo_equipo_id: prospectMaquina ? prospectMaquina.tipo_equipo_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/prospectMaquina/options", "");
  marcas.value = res.marcas;
  condiciones.value = res.condiciones;
  clasEquipos.value = res.clasEquipos;
  tiposEquipo.value = res.tiposEquipo;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formProspectMaquina,
  validate,
});
</script>
