<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formDenominacion.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formDenominacion.valor"
          filled
          dense
          label="Valor"
          lazy-rules
          hint
          prefix="$"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formDenominacion.tipo"
          :options="['Billete', 'Moneda']"
          label="Tipo"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { denominacion } = defineProps(["denominacion"]);

const myForm = ref(null);

const formDenominacion = ref({
  id: denominacion ? denominacion.id : null,
  nombre: denominacion ? denominacion.nombre : "$",
  valor: denominacion ? denominacion.valor : null,
  tipo: denominacion ? denominacion.tipo : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formDenominacion,
  validate,
});
</script>
