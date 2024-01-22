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
          @update:model-value="obtenerDepartamento"
          v-model="departamento"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="departamentos"
          label="Departamento"
          option-value="id"
          option-label="nombre"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          @update:model-value="obtenerLinea"
          v-model="linea"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="lineas"
          label="Linea"
          option-value="id"
          option-label="nombre"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.status"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="estatus"
          label="Status"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          @update:model-value="obtenerPuesto"
          v-model="puesto"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="puestos"
          label="Puesto a desempeñar"
          option-value="id"
          option-label="nombre"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          @update:model-value="obtenerJefe"
          v-model="jefeDirecto"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="jefesDirectos"
          label="Jefe directo"
          option-value="id"
          option-label="nombre"
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
const linea = ref("");
const sucursales = ref([]);
const sucursal = ref("");
const departamentos = ref([]);
const departamento = ref("");
const puestos = ref([]);
const puesto = ref("");
const jefesDirectos = ref([]);
const jefeDirecto = ref("");
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

// const obtenerSucursal = (newValue) => {
//   sucursal.value = newValue;
//   formEmployeetwo.value.sucursal_id = newValue.id;
// };

const obtenerDepartamento = (newValue) => {
  departamento.value = newValue;
  formEmployeetwo.value.departamento_id = newValue.id;
};

const obtenerLinea = (newValue) => {
  linea.value = newValue;
  formEmployeetwo.value.linea_id = newValue.id;
};

const obtenerPuesto = (newValue) => {
  puesto.value = newValue;
  formEmployeetwo.value.puesto_id = newValue.id;
};

const obtenerJefe = (newValue) => {
  jefeDirecto.value = newValue;
  formEmployeetwo.value.jefe_directo_id = newValue.id;
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
