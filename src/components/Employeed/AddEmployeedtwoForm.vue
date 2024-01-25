<template>
  <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployeetwo.fecha_de_ingreso"
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
                <q-date v-model="formEmployeetwo.fecha_de_ingreso">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <!-- <q-item>
      <q-item-section>
        <div
          class="q-pa-sm rounded-borders"
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        >
          <q-toggle
            filled
            dense
            v-model="formEmployeetwo.matriz"
            class="text-grey-7"
            label="El empleado pertenece a matriz"
          />
        </div>
      </q-item-section>
    </q-item> -->
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.sucursal_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.departamento_id"
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
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.linea_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.status"
          :options="estatus"
          label="Status"
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
          v-model="formEmployeetwo.puesto_id"
          :options="puestos"
          label="Puesto a desempeñar"
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
        <q-select
          v-model="formEmployeetwo.jefe_directo_id"
          :options="jefesDirectos"
          option-value="id"
          option-label="nombre"
          label="Jefe directo"
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
        <q-input
          filled
          dense
          v-model="formEmployeetwo.sueldo_base"
          label="Sueldo Base"
          mask="######"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div
          class="q-pa-sm rounded-borders"
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        >
          <q-toggle
            filled
            dense
            v-model="formEmployeetwo.comision"
            class="text-grey-7"
            label="Comision"
            hint
          />
        </div>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const $q = useQuasar();

const lineas = ref([]);
const sucursales = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const jefesDirectos = ref([]);
const estatus = ["Activo", "Baja", "Pencionado", "Suspendido"];
const myForm = ref(null);

const formEmployeetwo = ref({
  sueldo_base: null,
  comision: false,
  matriz: false,
  fecha_de_ingreso: null,
  status: null,
  puesto_id: null,
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  jefe_directo_id: null
});

const getLineas = async () => {
  let res = await sendRequest("GET", null, "/api/linea/all", "");
  lineas.value = res;
};

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const getDepartamentos = async () => {
  let res = await sendRequest("GET", null, "/api/departamento/all", "");
  departamentos.value = res;
};

const getPuestos = async () => {
  let res = await sendRequest("GET", null, "/api/puesto/all", "");
  puestos.value = res;
};

const getJefes = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/all", "");
  jefesDirectos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getLineas();
  getSucursales();
  getDepartamentos();
  getPuestos();
  getJefes();
});

defineExpose({
  formEmployeetwo,
  validate
});
</script>
