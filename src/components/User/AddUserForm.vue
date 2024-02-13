<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
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
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          type="password"
        />
      </q-item-section>
    </q-item>
    <q-separator/>
    <q-item>
      <q-item-section>
        <div class="text-h6">Que roles tendra el usuario</div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section v-for="role in roles" :key="role.id">
        <q-toggle
          v-model="formUser.roles"
          :label="role.name"
          color="primary"
          dense
          :val="role.name"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const myForm = ref(null);
const roles = ref([]);

const formUser = ref({
  name: null,
  email: null,
  password: null,
  confirmPassword: null,
  roles: []
});

const getRoles = async () => {
  let res = await sendRequest("GET", null, "/api/role", "");
  roles.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getRoles();
});

defineExpose({
  formUser,
  validate
});
</script>
