<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formRole.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { role } = defineProps(["role"]);

const myForm = ref(null);

const validate = async () => {
  return await myForm.value.validate();
};

const formRole = ref({
  id: role ? role.id : null,
  name: role ? role.name : null,
});

defineExpose({
  formRole,
  validate,
});
</script>
