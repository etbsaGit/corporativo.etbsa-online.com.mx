<template>
  <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
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
    <q-item v-for="(permission, index) in permissions" :key="index">
      <q-item-section style="max-width: 800px">
        <q-toggle v-model="permission.selected" />
        {{ permission.name }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div v-if="selectedPermissions.length > 0">
          <p>Permisos seleccionados:</p>
          <ul>
            <li v-for="(permission, index) in selectedPermissions" :key="index">
              {{ permission.name }}
            </li>
          </ul>
        </div>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const { role } = defineProps(["role"]);

const myForm = ref(null);
const permissions = ref([]);

const selectedPermissions = computed(() =>
  permissions.value.filter((permission) => permission.selected)
);

const getPermissions = async () => {
  let res = await sendRequest("GET", null, "/api/permission", "");
  permissions.value = res.map((permission) => ({
    ...permission,
    selected: false
  }));
};

const validate = async () => {
  return await myForm.value.validate();
};

const formRole = ref({
  id: role.id,
  name: role.name
});

onMounted(() => {
  getPermissions();
});

defineExpose({
  formRole,
  validate,
  selectedPermissions
});
</script>
