<template>
  <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 400px">
        <q-input
          v-model="formUser.name"
          filled
          dense
          label="Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.email"
          filled
          dense
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.password"
          filled
          dense
          label="password"
          lazy-rules
          type="password"
        />
      </q-item-section>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.confirmPassword"
          filled
          dense
          label="confirm password"
          lazy-rules
          type="password"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { user } = defineProps(["user"]);
const myForm = ref(null);

const formUser = ref({
  id: user.id,
  name: user.name,
  email: user.email,
  password: null,
  confirmPassword: null
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formUser,
  validate
});
</script>
