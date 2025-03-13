<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section v-if="checkSucursal('Corporativo')">
        <q-select
          v-model="formProspect.empleado_id"
          :options="filterEmpleados"
          label="Gerente"
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
          @update:model-value="getEmp(formProspect.empleado_id)"
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
      <q-item-section v-if="checkSucursal('Corporativo')">
        <q-select
          v-model="formProspect.vendedor_id"
          :options="subs"
          label="Vendedor"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
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
          v-model="formProspect.nombre"
          outlined
          dense
          label="Nombre"
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspect.ubicacion"
          outlined
          dense
          label="Ubicacion"
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspect.telefono"
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
        <q-toggle
          v-model="formProspect.candidato_agp"
          label="Candidato a Agricultura de presicion"
          :true-value="1"
          :false-value="0"
          color="green"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, checkRole, checkSucursal } from "src/boot/functions";

const { prospect } = defineProps(["prospect"]);

const authStore = useAuthStore();
const usuario = authStore.authUser;
const empleado = usuario.empleado;

const myForm = ref(null);
const empleados = ref([]);
const filterEmpleados = ref(null);
const subs = ref([]);

const formProspect = ref({
  id: prospect ? prospect.id : null,
  nombre: prospect ? prospect.nombre : null,
  ubicacion: prospect ? prospect.ubicacion : null,
  telefono: prospect ? prospect.telefono : null,
  empleado_id: prospect ? prospect.empleado_id : empleado ? empleado.id : null,
  candidato_agp: prospect ? prospect.candidato_agp : 0,
  vendedor_id: prospect ? prospect.vendedor_id : null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/prospect/forms", "");
  empleados.value = res.empleados;
};

const getEmp = async (id) => {
  let res = await sendRequest("GET", null, "/api/prospect/sub/" + id, "");
  subs.value = res.subordinates;
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
  // Si empleado_id tiene un valor inicial, dispara getEmp()
  if (formProspect.value.empleado_id) {
    getEmp(formProspect.value.empleado_id);
  }
});

defineExpose({
  formProspect,
  validate,
});
</script>
