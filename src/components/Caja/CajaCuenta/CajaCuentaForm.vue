<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCuenta.numeroCuenta"
          filled
          dense
          label="Numero de cuenta"
          type="number"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCuenta.caja_banco_id"
          :options="bancos"
          label="Banco"
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
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCuenta.descripcion"
          filled
          dense
          label="Descripcion"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { cuenta } = defineProps(["cuenta"]);

const bancos = ref([]);

const myForm = ref(null);

const formCuenta = ref({
  id: cuenta ? cuenta.id : null,
  numeroCuenta: cuenta ? cuenta.numeroCuenta : null,
  descripcion: cuenta ? cuenta.descripcion : null,
  caja_banco_id: cuenta ? cuenta.caja_banco_id : null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/caja/cajaCuenta/forms", "");
  bancos.value = res.bancos;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formCuenta,
  validate,
});
</script>
