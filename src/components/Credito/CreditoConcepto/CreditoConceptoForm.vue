<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formConcepto.tipo"
          :options="['Activo', 'Pasivo', 'Capital']"
          label="Tipo"
          outlined
          dense
          options-dense
          clearable
          :rules="[requiredSelect]"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formConcepto.categoria"
          :options="categorias"
          label="Categoria"
          outlined
          dense
          options-dense
          clearable
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formConcepto.nombre"
          outlined
          dense
          label="Nombre"
          lazy-rules
          :rules="[required]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { required, requiredSelect } from "src/boot/rules";

const { concepto } = defineProps(["concepto"]);

const myForm = ref(null);

const categorias = ref([
  "Circulante",
  "Fijo",
  "Diferido",
  "A corto plazo",
  "A largo plazo",
]);

const formConcepto = ref({
  id: concepto ? concepto.id : null,
  tipo: concepto ? concepto.tipo : null,
  categoria: concepto ? concepto.categoria : null,
  nombre: concepto ? concepto.nombre : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formConcepto,
  validate,
});
</script>
