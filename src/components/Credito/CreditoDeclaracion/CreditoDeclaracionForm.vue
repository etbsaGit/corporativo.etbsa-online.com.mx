<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formDeclaracion.cliente_id"
          :options="filterClientes"
          label="Cliente"
          option-value="id"
          option-label="nombre"
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
          :rules="[requiredSelect]"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="formDeclaracion.giro"
          outlined
          dense
          label="Giro"
          :rules="[required]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formDeclaracion.inicio"
          mask="date"
          label="Inicio"
          lazy-rules
          readonly
          :rules="[required]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formDeclaracion.inicio">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="gray" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>

      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formDeclaracion.termino"
          mask="date"
          label="Termino"
          lazy-rules
          readonly
          :rules="[required]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formDeclaracion.termino">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="gray" flat />
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
          v-model="formDeclaracion.feedback"
          outlined
          dense
          type="textarea"
          label="Retroalimentacion o motivo de rechazo"
          hint
        />
      </q-item-section>
    </q-item>

    <!-- Relaciones -->
    <q-item>
      <q-item-section align="center">
        <q-item-label caption>- Relacion analitica de balance -</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="(rel, index) in formDeclaracion.relaciones" :key="index">
      <q-item-section>
        <q-select
          v-model="rel.credito_concepto_id"
          :options="conceptos"
          label="Concepto"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          outlined
          dense
          :rules="[requiredSelect]"
        >
          <template v-slot:before>
            <q-btn
              color="negative"
              icon="delete"
              outline
              round
              dense
              @click="removeRelacion(rel.id, index)"
            />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                {{ scope.opt.tipo }}
              </q-item-section>
              <q-item-section>
                {{ scope.opt.categoria }}
              </q-item-section>
              <q-item-section>
                {{ scope.opt.nombre }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="rel.nombre"
          outlined
          dense
          label="nombre"
          :rules="[required]"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="rel.valor"
          outlined
          dense
          label="Valor"
          prefix="$"
          reverse-fill-mask
          input-class="text-right"
          mask="###,###,###,###"
          unmasked-value
          :rules="[requiredGreaterThan0]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          label="Agregar"
          color="primary"
          @click="addRelacion"
          icon="add"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { required, requiredGreaterThan0, requiredSelect } from "src/boot/rules";

const { declaracion } = defineProps(["declaracion"]);

const myForm = ref(null);

const clientes = ref([]);
const filterClientes = ref([]);
const conceptos = ref([]);

const formDeclaracion = ref({
  id: declaracion ? declaracion.id : null,
  giro: declaracion ? declaracion.giro : null,
  status: declaracion ? declaracion.status : null,
  inicio: declaracion ? declaracion.inicio : null,
  termino: declaracion ? declaracion.termino : null,
  cliente_id: declaracion ? declaracion.cliente_id : null,
  feedback: declaracion ? declaracion.feedback : null,
  relaciones: declaracion ? declaracion.relaciones : [],
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/creditoDeclaracion/forms", "");
  clientes.value = res.clientes;
  conceptos.value = res.conceptos;
};

onMounted(() => {
  getForms();
});

const addRelacion = () => {
  formDeclaracion.value.relaciones.push({
    id: null,
    credito_declaracion_id: null,
    credito_concepto_id: null,
    valor: null,
    nombre: null,
  });
};

const removeRelacion = async (id, index) => {
  if (id) {
    await sendRequest("DELETE", null, "/api/creditoRelacion/" + id, "");
  }
  formDeclaracion.value.relaciones.splice(index, 1);
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterClientes.value = clientes.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterClientes.value = clientes.value.filter(
      (cliente) => cliente?.nombre.toLowerCase().indexOf(needle) > -1
    );
  });
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formDeclaracion,
  validate,
});
</script>
