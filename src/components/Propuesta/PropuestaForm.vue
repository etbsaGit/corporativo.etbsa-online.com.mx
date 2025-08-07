<template>
  <q-form ref="myForm" greedy>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey q-pa-none"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="general" label="Informacion general" />
      <q-tab name="detalles" label="Detalles" v-if="checkRole('authProp')" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="general">
        <q-item>
          <q-item-section>
            <q-input
              v-model="formPropuesta.title"
              outlined
              dense
              label="Titulo"
              :rules="[required]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formPropuesta.description"
              type="textarea"
              outlined
              dense
              label="Descripcion de la campaña"
              :rules="[required]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formPropuesta.departamento_id"
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
              :rules="[requiredSelect]"
            />
          </q-item-section>
          <!-- <q-item-section>
            <q-select
              v-model="formPropuesta.linea_id"
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
              :rules="[requiredSelect]"
            />
          </q-item-section> -->
          <!-- <q-item-section>
            <q-select
              v-model="formPropuesta.category_id"
              :options="categories"
              label="Categoria"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              :rules="[requiredSelect]"
            />
          </q-item-section> -->
          <q-item-section>
            <q-select
              v-model="formPropuesta.estatus_id"
              :options="estatus"
              label="Tipo"
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
              :rules="[requiredSelect]"
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>

      <q-tab-panel name="detalles">
        <q-item>
          <q-item-section>
            <q-select
              v-model="formPropuesta.status"
              :options="[
                { id: null, nombre: 'Esperando autorizacion' },
                { id: 0, nombre: 'Rechazada' },
                { id: 1, nombre: 'Autorizada' },
              ]"
              label="Estatus"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              options-dense
              :bg-color="getDropdownPropsStatus(formPropuesta.status).color"
              hint
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formPropuesta.notas"
              type="textarea"
              outlined
              dense
              label="Notas del administrador"
              :rules="[required]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-date landscape v-model="model" range @range-end="onRange" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-input
                v-model="formPropuesta.start_date"
                outlined
                dense
                label="Inicia"
                readonly
                hint
              />
            </q-item-label>
            <q-item-label>
              <q-input
                v-model="formPropuesta.end_date"
                outlined
                dense
                label="Termina"
                readonly
                hint
              />
            </q-item-label>
            <q-item-label>
              <q-file
                clearable
                color="secondary"
                dense
                outlined
                v-model="formPropuesta.file"
                label="Pantalla de la promocion"
                lazy-rules
                accept=".jpg, .jpeg, .png, .jfif"
                @clear="formPropuesta.base64 = null"
                @input="convertirFile($event)"
                hint
              />
            </q-item-label>
            <q-item-label>
              <q-input
                v-model="formPropuesta.url"
                outlined
                dense
                label="Url de la campaña"
                :rules="[validateURL]"
              />
            </q-item-label>
            <q-item-label>
              <q-input
                v-model="formPropuesta.inversion"
                prefix="$"
                mask="###,###,###,###"
                reverse-fill-mask
                unmasked-value
                outlined
                dense
                label="Presupuesto"
                hint
              />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-avatar rounded size="180px" v-if="formPropuesta.base64 || path">
              <q-img
                :src="formPropuesta.base64 ? formPropuesta.base64 : path"
              />
            </q-avatar>
            <q-avatar v-else size="180px">
              <q-icon name="fa-solid fa-image" />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { checkRole } from "src/boot/functions";
import {
  required,
  requiredSelect,
  validateURL,
  requiredGreaterThan0,
} from "src/boot/rules";

const { propuesta } = defineProps(["propuesta"]);

const path = propuesta ? propuesta.pic : null;

const myForm = ref(null);

const tab = ref("general");

const departamentos = ref([]);
const lineas = ref([]);
const categories = ref([]);
const estatus = ref([]);

const model = ref(null);

const formPropuesta = ref({
  id: propuesta ? propuesta.id : null,
  title: propuesta ? propuesta.title : null,
  description: propuesta ? propuesta.description : null,
  status: propuesta ? propuesta.status : null,
  notas: propuesta ? propuesta.notas : null,
  image: propuesta ? propuesta.image : null,
  url: propuesta ? propuesta.url : null,
  start_date: propuesta ? propuesta.start_date : null,
  end_date: propuesta ? propuesta.end_date : null,
  inversion: propuesta ? propuesta.inversion : null,
  estatus_id: propuesta ? propuesta.estatus_id : null,
  linea_id: propuesta ? propuesta.linea_id : null,
  departamento_id: propuesta ? propuesta.departamento_id : null,
  created_by: propuesta ? propuesta.created_by : null,
  auth_by: propuesta ? propuesta.auth_by : null,
  auth_at: propuesta ? propuesta.auth_at : null,
  category_id: propuesta ? propuesta.category_id : null,

  base64: null,
  file: [],
});

const onRange = (date) => {
  formPropuesta.value.start_date = formatearFecha(date.from);
  formPropuesta.value.end_date = formatearFecha(date.to);
};

function formatearFecha({ year, month, day }) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}/${mm}/${dd}`;
}

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/propuesta/forms", "");
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  categories.value = res.categories;
  estatus.value = res.estatus;
};

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "red-3",
    };
  } else if (validated === 1) {
    return {
      color: "green-3",
    };
  } else {
    return {
      color: "grey-5",
    };
  }
}

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formPropuesta.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formPropuesta.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formPropuesta,
  validate,
});
</script>

