<template>
  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployeetwo.fecha_de_ingreso"
        mask="date"
        label="Fecha de ingreso"
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
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formEmployeetwo.departamento_id"
        :options="departamentos"
        label="Departamento"
        option-value="id"
        option-label="nombre"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
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
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formEmployeetwo.status"
        :options="estatus"
        transition-show="jump-up"
        transition-hide="jump-up"
        label="Status"
        dense
        readonly
        outlined
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
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
    <q-item-section>
      <q-input
        dense
        v-model="formEmployeetwo.descripcion_puesto"
        lazy-rules
        label="Descripcion del puesto"
        readonly
        outlined
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
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        dense
        v-model="formEmployeetwo.sueldo_base"
        label="Sueldo Base"
        mask="######"
        readonly
        outlined
      />
    </q-item-section>
    <q-item-section>
      <div class="q-pa-sm rounded-borders">
        <q-toggle
          dense
          v-model="formEmployeetwo.comision"
          class="text-black"
          label="Comision"
          readonly
          outlined
          disable
          :true-value="1"
          :false-value="0"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

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
  puesto_id: empleado.puesto.nombre,
  descripcion_puesto: empleado.descripcion_puesto,
  sucursal_id: empleado.sucursal.nombre,
  linea_id: empleado.linea.nombre,
  departamento_id: empleado.departamento.nombre,
  jefe_directo_id: empleado.jefe_directo_id
    ? empleado.jefe_directo.nombre
    : null,
});
</script>
