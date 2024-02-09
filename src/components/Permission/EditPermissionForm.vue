<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formPermission.name"
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

const { permission } = defineProps(["permission"]);
const myForm = ref(null);

const formPermission = ref({
  id: permission.id,
  name: permission.name
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formPermission,
  validate
});
</script>
