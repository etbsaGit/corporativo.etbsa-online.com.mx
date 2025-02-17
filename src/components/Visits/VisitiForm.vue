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
        <q-select
          dense
          outlined
          v-model="formVisit.prospect_id"
          :options="prospects"
          label="Cliente"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          :hint="'Telefono: ' + formatPhoneNumber(selectedProspect?.telefono)"
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <!-- <template v-slot:after>
            <q-btn
              dense
              color="primary"
              @click="showAdd = true"
              icon="add_circle"
            />
          </template> -->
        </q-select>
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

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <prospect-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, checkRole, dataIncomplete } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/formatFunctions";

import ProspectForm from "src/components/Prospect/ProspectForm.vue";

const { visit } = defineProps(["visit"]);

const authStore = useAuthStore();
const usuario = authStore.authUser;
const empleado = usuario.empleado;

const myForm = ref(null);
const empleados = ref([]);
const prospects = ref([]);
const filterEmpleados = ref(null);
const selectedProspect = ref(null);
const showAdd = ref(false);
const add = ref(null);

const formVisit = ref({
  id: visit ? visit.id : null,
  dia: visit ? visit.dia : null,
  ubicacion: visit ? visit.ubicacion : null,
  comentarios: visit ? visit.comentarios : null,
  retroalimentacion: visit ? visit.retroalimentacion : null,
  empleado_id: visit ? visit.empleado_id : empleado ? empleado.id : null,
  prospect_id: visit ? visit.prospect_id : null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/visit/forms", "");
  empleados.value = res.empleados;
  prospects.value = res.prospects;
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

// Watch para obtener los datos del cliente seleccionado
watch(
  () => formVisit.value.prospect_id,
  (newValue) => {
    selectedProspect.value =
      prospects.value.find((prospect) => prospect.id === newValue) || null;
  }
);

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formProspect,
  };
  let res = await sendRequest("POST", final, "/api/prospect", "");
  showAdd.value = false;
  getForms();
  formVisit.value.prospect_id = res.id;
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
