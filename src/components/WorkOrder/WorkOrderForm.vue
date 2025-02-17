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
    <q-tab-panel name="Informacion" class="q-pa-none">
      <q-form ref="myForm" greedy>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formWO.ot"
              filled
              dense
              label="# Orden de trabajo"
              mask="######"
              :rules="[(val) => (val && val > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formWO.cliente"
              filled
              dense
              label="Cliente"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formWO.maquina"
              filled
              dense
              label="Maquina"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formWO.descripcion"
              filled
              dense
              label="descripcion"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.fecha_ingreso"
              mask="date"
              label="Fecha de ingreso"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formWO.fecha_ingreso" minimal>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.fecha_entrega"
              mask="date"
              label="Fecha de entrega"
              hint
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formWO.fecha_entrega" minimal>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.mano_obra"
              prefix="$"
              label="Mano de obra"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.refacciones"
              prefix="$"
              label="Refacciones"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.km"
              prefix="$"
              label="km"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.foraneo"
              prefix="$"
              label="Foraneo"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              readonly
              filled
              dense
              v-model="total_factura"
              prefix="$"
              label="Total factura"
              hint
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formWO.tecnico_id"
              :options="tecnicos"
              label="Tecnico"
              option-value="id"
              option-label="nombreCompleto"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              filled
              dense
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formWO.bay_id"
              :options="bays"
              label="Bahia"
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
              hint
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formWO.estatus_taller_id"
              :options="estatus_taller"
              label="Estatus del taller"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formWO.estatus_id"
              :options="estatus"
              label="Estatus"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formWO.type_id"
              :options="types"
              label="Tipo de orden de trabajo"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.horas_facturadas"
              type="number"
              label="Horas facturadas"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              dense
              v-model="formWO.horas_reales"
              type="number"
              label="Horas reales"
              hint
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formWO.comentarios"
              filled
              dense
              label="Comentarios"
              hint
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formWO.sucursal_id"
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
              :readonly="!checkSucursal('Corporativo')"
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formWO.linea_id"
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
              :readonly="!checkSucursal('Corporativo')"
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
      </q-form>
    </q-tab-panel>
    <q-tab-panel name="Archivos" class="q-pa-none">
      <q-form ref="myForm" greedy>
        <q-item>
          <q-item-section>
            <q-file
              clearable
              filled
              dense
              v-model="model"
              multiple
              max-files="3"
              label="Archivo"
              hint
              @input="convertirFile($event)"
              @clear="formPost.archivos = []"
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
          <q-item v-for="(wod, index) in local_docs" :key="index">
            <q-item-section>{{ wod.name }}</q-item-section>
            <q-item-section>{{ formatDate(wod.created_at) }}</q-item-section>
            <q-item-section avatar>
              <a :href="wod.realpath" target="_blank">
                <q-icon color="primary" name="download" size="sm" />
              </a>
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                icon="delete"
                flat
                color="red"
                @click="clickDelete(wod, index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-form>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest, checkSucursal } from "src/boot/functions";
import { formatDate } from "src/boot/formatFunctions";
import { useAuthStore } from "src/stores/auth";
import WorkOrderDocslist from "src/components/WorkOrder/WorkOrderDocsList.vue";

const authStore = useAuthStore();
const usuario = authStore.authUser;

const { wo } = defineProps(["wo"]);

const local_docs = ref(wo ? wo.work_order_doc : []);

const myForm = ref(null);
const bays = ref([]);
const estatus = ref([]);
const estatus_taller = ref([]);
const lineas = ref([]);
const sucursales = ref([]);
const tecnicos = ref([]);
const types = ref([]);
const model = ref(null);
const tab = ref("Informacion");

const formWO = ref({
  id: wo ? wo.id : null,
  ot: wo ? wo.ot : null,
  cliente: wo ? wo.cliente : null,
  maquina: wo ? wo.maquina : null,
  descripcion: wo ? wo.descripcion : null,
  fecha_ingreso: wo ? wo.fecha_ingreso : null,
  fecha_entrega: wo ? wo.fecha_entrega : null,
  mano_obra: wo ? wo.mano_obra : 0,
  refacciones: wo ? wo.refacciones : 0,
  MediaKeyMessageEvent: wo ? wo.MediaKeyMessageEvent : 0,
  foraneo: wo ? wo.foraneo : 0,
  tecnico_id: wo ? wo.tecnico_id : null,
  estatus_id: wo ? wo.estatus_id : null,
  estatus_taller_id: wo ? wo.estatus_taller_id : null,
  type_id: wo ? wo.type_id : null,
  bay_id: wo ? wo.bay_id : null,
  horas_facturadas: wo ? wo.horas_facturadas : null,
  horas_reales: wo ? wo.horas_reales : null,
  comentarios: wo ? wo.comentarios : null,
  sucursal_id: wo
    ? wo.sucursal_id
    : !checkSucursal("Corporativo") &&
      usuario.empleado &&
      usuario.empleado.sucursal
    ? usuario.empleado.sucursal.id
    : null,
  linea_id: wo
    ? wo.linea_id
    : !checkSucursal("Corporativo") &&
      usuario.empleado &&
      usuario.empleado.linea
    ? usuario.empleado.linea.id
    : null,
  archivos: [],
});

const total_factura = computed(() => {
  // Convertir a números usando Number() antes de sumar
  const manoObra = Number(formWO.value.mano_obra);
  const refacciones = Number(formWO.value.refacciones);
  const km = Number(formWO.value.km);
  const foraneo = Number(formWO.value.foraneo);

  // Verificar que las conversiones sean válidas (si son NaN, asignar 0)
  const manoObraNumber = isNaN(manoObra) ? 0 : manoObra;
  const refaccionesNumber = isNaN(refacciones) ? 0 : refacciones;
  const kmNumber = isNaN(km) ? 0 : km;
  const foraneoNumber = isNaN(foraneo) ? 0 : foraneo;

  // Realizar la suma y multiplicación
  const subtotal =
    (manoObraNumber + refaccionesNumber + kmNumber + foraneoNumber) * 1.16;

  // Redondear el resultado a dos decimales y retornarlo como string
  return subtotal.toFixed(2);
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/wos/getform", "");
  bays.value = res.bays;
  estatus.value = res.estatus;
  estatus_taller.value = res.estatus_taller;
  lineas.value = res.lineas;
  sucursales.value = res.sucursales;
  tecnicos.value = res.tecnicos;
  types.value = res.types;
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
        formWO.value.archivos.push(objetoArchivo);
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

const clickDelete = async (wod, index) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/workOrderDoc/" + wod.id,
    ""
  );
  local_docs.value.splice(index, 1);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formWO,
  validate,
});
</script>
