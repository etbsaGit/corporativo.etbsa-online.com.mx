<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section>
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
    <q-separator/>
    <q-item>
      <q-item-section>
        <div class="text-h6">Que permisos tendra el rol</div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section v-for="permission in permissions" :key="permission.id">
        <q-toggle
          v-model="formRole.permissions"
          :label="permission.name"
          color="primary"
          dense
          :val="permission.name"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions"

const myForm = ref(null);
const permissions = ref([])

const formRole = ref({
  name: null,
  permissions: []
});

const getPermissions = async () => {
  let res = await sendRequest("GET", null, "/api/permission", "");
  permissions.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getPermissions();
});

defineExpose({
  formRole,
  validate
});
</script>
