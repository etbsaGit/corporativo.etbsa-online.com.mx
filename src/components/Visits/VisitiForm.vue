<template>
  <q-form ref="myForm" greedy>
    <q-item v-if="checkRole('Admin')">
      <q-item-section>
        <q-select
          v-model="formVisit.empleado_id"
          :options="filterEmpleados"
          label="Empleado"
          option-value="id"
          option-label="apellidoCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          clearable
          options-dense
          use-input
          @filter="filterFn"
          input-debounce="0"
          behavior="menu"
          :rules="[(val) => val !== null || 'Obligatorio']"
          :readonly="!checkRole('Admin')"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> no options </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formVisit.dia"
          mask="date"
          label="Fecha"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formVisit.dia" minimal>
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
        <q-input
          v-model="formVisit.cliente"
          outlined
          dense
          label="Cliente"
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVisit.telefono"
          outlined
          dense
          label="Telefono"
          mask="(###) ### - ####"
          hint
          unmasked-value
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVisit.ubicacion"
          outlined
          dense
          label="Ubicacion de visita"
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVisit.hectareas"
          outlined
          dense
          label="Hectareas"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVisit.maquinaria"
          outlined
          dense
          label="Maquinaria"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          dense
          outlined
          v-model="formVisit.cultivos"
          multiple
          use-chips
          :options="cultivos"
          label="Cultivos"
          option-value="name"
          option-label="name"
          emit-value
          map-options
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVisit.comentarios"
          outlined
          dense
          label="Comentarios"
          hint
          type="textarea"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="visit">
      <q-item-section>
        <q-input
          v-model="formVisit.retroalimentacion"
          outlined
          dense
          label="Retroalimentacion"
          hint
          type="textarea"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, checkRole } from "src/boot/functions";

const { visit } = defineProps(["visit"]);

const authStore = useAuthStore();
const usuario = authStore.authUser;
const empleado = usuario.empleado;

const myForm = ref(null);
const cultivos = ref([]);
const empleados = ref([]);
const filterEmpleados = ref(null);

const formVisit = ref({
  id: visit ? visit.id : null,
  dia: visit ? visit.dia : null,
  cliente: visit ? visit.cliente : null,
  ubicacion: visit ? visit.ubicacion : null,
  telefono: visit ? visit.telefono : null,
  cultivos: visit ? visit.cultivos : null,
  hectareas: visit ? visit.hectareas : null,
  maquinaria: visit ? visit.maquinaria : null,
  comentarios: visit ? visit.comentarios : null,
  retroalimentacion: visit ? visit.retroalimentacion : null,
  empleado_id: visit ? visit.empleado_id : empleado ? empleado.id : null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/visit/forms", "");
  empleados.value = res.empleados;
  cultivos.value = res.cultivos;
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = empleados.value.filter(
      (empleado) => empleado.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formVisit,
  validate,
});
</script>
