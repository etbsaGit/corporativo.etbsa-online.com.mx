<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRequisicion.sucursal_id"
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
          outlined
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formRequisicion.linea_id"
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
          outlined
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formRequisicion.departamento_id"
          :options="departamentos"
          label="Departamento"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          outlined
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formRequisicion.puesto_id"
          :options="puestos"
          label="Puesto"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          outlined
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.total_posiciones"
          type="number"
          outlined
          dense
          label="Total posiciones"
          :rules="[(val) => (val && val > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">
          <strong>- Tipo de vacante -</strong>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRequisicion.tipo_vacante"
          :options="['Remplazo', 'Nueva Creación', 'Temporal', 'Permanente']"
          label="Tipo de vacante"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.motivo_vacante"
          outlined
          dense
          label="Motivo"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.especificar_vacante"
          outlined
          dense
          label="Especificar"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">
          <strong>- Generales del puesto -</strong>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRequisicion.sexo"
          :options="['Masculino', 'Femenino', 'Ambos']"
          label="Sexo"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-range v-model="rangeProxy" :min="18" :max="60" label-always hint />
        <q-badge color="white" text-color="grey-7"> Rango de edad </q-badge>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formRequisicion.escolaridad_id"
          :options="escolaridades"
          label="Escolaridad"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          outlined
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <!-- <q-item-section>
        <q-select
          v-model="formRequisicion.idiomas"
          :options="['Español', 'Ingles']"
          label="Idiomas"
          outlined
          dense
          options-dense
          multiple
          clearable
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section> -->
      <q-item-section>
        <q-input
          v-model="formRequisicion.manejo_equipo"
          outlined
          dense
          label="Manejo de equipos"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.sueldo_mensual_inicial"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          outlined
          dense
          label="Sueldo mensual inicial"
          :rules="[(val) => (val && val > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.comisiones"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          outlined
          dense
          label="Comisiones aproximadas"
          :rules="[(val) => (val && val >= 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRequisicion.competencias"
          :options="competencias"
          label="Competencias"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          multiple
          use-chips
          stack-label
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.habilidades"
          type="textarea"
          outlined
          dense
          label="Habilidades"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formRequisicion.experiencia_conocimientos"
          type="textarea"
          outlined
          dense
          label="Experiencia y/o conocimiento"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRequisicion.actividades_desempenar"
          type="textarea"
          outlined
          dense
          label="Actividades a desempeñar"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRequisicion.herramientas"
          :options="herramientas"
          label="Herramientas de trabajo"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          multiple
          use-chips
          stack-label
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="checkRole('RRHH')">
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formRequisicion.file"
          label="Subir Banner"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif, .pdf"
          @clear="formRequisicion.base64 = null"
          @input="convertirFile($event)"
        >
          <template v-slot:before>
            <q-btn
              v-if="requisicion?.realpath"
              outline
              dense
              icon="fa-solid fa-file-image"
              color="primary"
              label="Banner ya cargado"
              @click="openDocument(requisicion.realpath)"
            />
          </template>
        </q-file>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";

const { requisicion } = defineProps(["requisicion"]);

const myForm = ref(null);

const puestos = ref([]);
const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const escolaridades = ref([]);
const competencias = ref([]);
const herramientas = ref([]);

const formRequisicion = ref({
  id: requisicion ? requisicion.id : null,
  puesto_id: requisicion ? requisicion.puesto_id : null,
  sucursal_id: requisicion ? requisicion.sucursal_id : null,
  linea_id: requisicion ? requisicion.linea_id : null,
  departamento_id: requisicion ? requisicion.departamento_id : null,
  escolaridad_id: requisicion ? requisicion.escolaridad_id : null,
  solicita_id: requisicion ? requisicion.solicita_id : null,
  autoriza_id: requisicion ? requisicion.autoriza_id : null,
  vo_bo_id: requisicion ? requisicion.vo_bo_id : null,
  recibe_id: requisicion ? requisicion.recibe_id : null,
  autorizacion: requisicion ? requisicion.autorizacion : 0,
  estatus: requisicion ? requisicion.estatus : 0,
  sexo: requisicion ? requisicion.sexo : null,
  rango_edad: requisicion ? requisicion.rango_edad : "De 21 a 50 años",
  habilidades: requisicion ? requisicion.habilidades : null,
  idiomas: requisicion ? requisicion.idiomas : null,
  manejo_equipo: requisicion ? requisicion.manejo_equipo : null,
  sueldo_mensual_inicial: requisicion ? requisicion.sueldo_mensual_inicial : 0,
  comisiones: requisicion ? requisicion.comisiones : 0,
  experiencia_conocimientos: requisicion
    ? requisicion.experiencia_conocimientos
    : null,
  actividades_desempenar: requisicion
    ? requisicion.actividades_desempenar
    : null,
  total_posiciones: requisicion ? requisicion.total_posiciones : null,
  tipo_vacante: requisicion ? requisicion.tipo_vacante : null,
  motivo_vacante: requisicion ? requisicion.motivo_vacante : null,
  especificar_vacante: requisicion ? requisicion.especificar_vacante : null,

  base64: null,
  file: [],

  competencias: requisicion ? requisicion.competencias.map((c) => c.id) : [],
  herramientas: requisicion ? requisicion.herramientas.map((h) => h.id) : [],
});

const rangeProxy = computed({
  get() {
    const val = formRequisicion.value.rango_edad;
    const match = val.match(/(\d+)\D+(\d+)/);
    if (match) {
      const [, min, max] = match;
      return { min: parseInt(min), max: parseInt(max) };
    }
    return { min: 21, max: 50 };
  },
  set(newVal) {
    formRequisicion.value.rango_edad = `De ${newVal.min} a ${newVal.max} años`;
  },
});

const getForms = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/requisicionPersonal/forms",
    ""
  );
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  escolaridades.value = res.escolaridades;
  competencias.value = res.competencias;
  herramientas.value = res.herramientas;
};

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formRequisicion.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formRequisicion.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const openDocument = (url) => {
  window.open(url, "_blank");
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formRequisicion,
  validate,
});
</script>
