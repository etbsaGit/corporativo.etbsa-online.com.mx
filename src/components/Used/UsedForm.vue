<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="Informacion" label="Informacion" />
    <q-tab name="Archivos" label="Archivos" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="Informacion" class="q-pt-none">
      <q-form ref="myForm" greedy>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formUsed.name"
              outlined
              dense
              label="Nombre"
              hint
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formUsed.description"
              outlined
              dense
              label="Descripcion"
              hint
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formUsed.tipo_equipo_id"
              :options="tipos_equipo"
              label="Tipo de equipo"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formUsed.linea_id"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formUsed.origin_id"
              :options="sucursales"
              label="Origen"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formUsed.location_id"
              :options="sucursales"
              label="Ubicacion"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formUsed.serial"
              outlined
              dense
              label="# de serie"
              hint
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              outlined
              dense
              v-model="formUsed.year"
              label="Año"
              mask="####"
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              outlined
              dense
              v-model="formUsed.hours"
              label="Horas"
              mask="###,###,###,###"
              reverse-fill-mask
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              outlined
              dense
              v-model="formUsed.cost"
              prefix="$"
              label="Costo"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              outlined
              dense
              v-model="formUsed.price"
              prefix="$"
              label="Precio"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'El precio no puede estar vacío',
                (val) => parseFloat(val) > 0 || 'El precio debe ser mayor a 0',
              ]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formUsed.comments"
              outlined
              dense
              label="Comentarios"
              hint
              type="textarea"
            />
          </q-item-section>
        </q-item>

        <q-btn-toggle
          v-model="formUsed.status"
          spread
          no-caps
          rounded
          toggle-color="primary"
          color="grey-4"
          text-color="black"
          :options="[
            { label: 'Disponible', value: 1 },
            { label: 'En taller', value: 0 },
            { label: 'No disponible', value: null },
          ]"
        />
      </q-form>
    </q-tab-panel>
    <q-tab-panel name="Archivos" class="q-pa-none">
      <q-form ref="myForm" greedy>
        <q-item>
          <q-item-section>
            <q-file
              clearable
              outlined
              dense
              v-model="model"
              multiple
              max-files="3"
              label="Archivo"
              hint="Cada archivo no debe de pesar mas de 10 Mb"
              use-chips
              counter
              max-file-size="10485760"
              :filter="checkFileSize"
              @input="convertirFile($event)"
              @clear="formUsed.archivos = []"
              @rejected="onRejected"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-list separator>
          <q-item>
            <q-item-section> Archivos subidos </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Nombre</q-item-section>
            <q-item-section>Subido</q-item-section>
            <q-item-section avatar>Descargar</q-item-section>
            <q-item-section avatar>Borrar</q-item-section>
          </q-item>
          <q-item v-for="(ud, index) in local_docs" :key="index">
            <q-item-section>{{ ud.name }}</q-item-section>
            <q-item-section>{{ formatDate(ud.created_at) }}</q-item-section>
            <q-item-section avatar>
              <a :href="ud.realpath" target="_blank">
                <q-icon color="primary" name="download" size="sm" />
              </a>
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                icon="delete"
                flat
                color="red"
                @click="clickDelete(ud, index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-form>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";
import { formatDate } from "src/boot/formatFunctions";

const { used } = defineProps(["used"]);

const myForm = ref(null);

const $q = useQuasar();

const tab = ref("Informacion");

const local_docs = ref(used ? used.used_doc : []);

const sucursales = ref([]);
const tipos_equipo = ref([]);
const lineas = ref([]);
const model = ref(null);

const formUsed = ref({
  id: used ? used.id : null,
  name: used ? used.name : null,
  description: used ? used.description : null,
  comments: used ? used.comments : null,
  status: used ? used.status : null,
  serial: used ? used.serial : null,
  year: used ? used.year : null,
  hours: used ? used.hours : null,
  cost: used ? used.cost : null,
  price: used ? used.price : null,
  origin_id: used ? used.origin_id : null,
  location_id: used ? used.location_id : null,
  tipo_equipo_id: used ? used.tipo_equipo_id : null,
  linea_id: used ? used.linea_id : null,
  archivos: [],
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/used/forms", "");
  sucursales.value = res.sucursales;
  tipos_equipo.value = res.tipos_equipo;
  lineas.value = res.lineas;
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          extension: archivo.name.split(".").pop(),
          base64: base64Data,
        };
        formUsed.value.archivos.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  } else {
    formProduct.value.archivos = [];
  }
};

const onRejected = (rejectedEntries) => {
  $q.notify({
    type: "negative",
    message: `No se cargaron ${rejectedEntries.length} archivo(s)`,
  });
};

const checkFileSize = (files) => {
  return files.filter((file) => file.size < 10485760);
};

const clickDelete = async (userDoc, index) => {
  let res = await sendRequest("DELETE", null, "/api/usedDoc/" + userDoc.id, "");
  local_docs.value.splice(index, 1);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formUsed,
  validate,
});
</script>
