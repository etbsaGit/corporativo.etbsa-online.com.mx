<template>
  <q-form ref="myForm" greedy>
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
          v-model="formEmployeetwo.estatus_id"
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
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployeetwo.descripcion_puesto"
          lazy-rules
          label="Descripcion del puesto"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployeetwo.jefe_directo_id"
          :options="jefesDirectos"
          option-value="id"
          :option-label="
            (item) =>
              item.nombre +
              ' ' +
              item.apellido_paterno +
              ' ' +
              item.apellido_materno
          "
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
            :true-value="1"
            :false-value="0"
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

const { empleado } = defineProps(["empleado"]);

const $q = useQuasar();

const lineas = ref([]);
const sucursales = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const jefesDirectos = ref([]);
const estatus = ref([]);
const myForm = ref(null);

const formEmployeetwo = ref({
  sueldo_base: empleado ? empleado.sueldo_base : null,
  comision: empleado ? empleado.comision : 0,
  matriz: empleado ? empleado.matriz : false,
  fecha_de_ingreso: empleado ? empleado.fecha_de_ingreso : null,
  estatus_id: empleado ? empleado.estatus_id : null,
  puesto_id: empleado ? empleado.puesto.id : null,
  descripcion_puesto: empleado ? empleado.descripcion_puesto : null,
  sucursal_id: empleado ? empleado.sucursal.id : null,
  linea_id: empleado ? empleado.linea.id : null,
  departamento_id: empleado ? empleado.departamento.id : null,
  jefe_directo_id:
    empleado && empleado.jefe_directo_id ? empleado.jefe_directo.id : null,
});

const getAll = async () => {
  const final = null;
  let res = await sendRequest("POST", final, "/api/empleado/negocios", "");
  jefesDirectos.value = res.empleados;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getAll();
});

defineExpose({
  formEmployeetwo,
  validate,
});
</script>
