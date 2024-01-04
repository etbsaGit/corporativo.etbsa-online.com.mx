<template>
  <q-form class="q-gutter-y-sm text-uppercase">
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
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="sucursales"
          label="Sucursal"
          emit-value
          map-options
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.departamento_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="departamentos"
          label="Departamento"
          option-label="nombre"
          emit-value
          map-options
          option-disable="inactive"
          option-value="id"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.linea_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="lineas"
          label="Linea"
          emit-value
          map-options
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
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
          v-model="formEmployeetwo.puesto_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="puestos"
          label="Puesto a desempeñar"
          emit-value
          map-options
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.jefe_directo_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :options="jefesDirectos"
          label="Jefe directo"
          emit-value
          map-options
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
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
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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

const { empleado } = defineProps(["empleado"]);

const $q = useQuasar();

const lineas = ref([]);
const sucursales = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const jefesDirectos = ref([]);
const estatus = ["Activo", "Baja", "Pencionado", "Suspendido"];

const formEmployeetwo = ref({
  sueldo_base: empleado.sueldo_base,
  comision: empleado.comision,
  matriz: empleado.matriz,
  fecha_de_ingreso: empleado.fecha_de_ingreso,
  status: empleado.status,
  puesto_id: empleado.puesto.id,
  sucursal_id: empleado.sucursal.id,
  linea_id: empleado.linea.id,
  departamento_id: empleado.departamento.id,
  jefe_directo_id: empleado.jefe_directo_id ? empleado.jefe_directo.id : null
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

onMounted(() => {
  getLineas();
  getSucursales();
  getDepartamentos();
  getPuestos();
  getJefes();
});

defineExpose({
  formEmployeetwo
});
</script>
