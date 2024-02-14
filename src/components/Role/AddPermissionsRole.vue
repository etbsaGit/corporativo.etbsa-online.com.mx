<template>
    <div>
      <q-form ref="myForm" greedy>
            <q-toggle
              v-for="permission in permissions" :key="permission.id"
              v-model="rolePermissions[permission.id]"
              :label="permission.name"
              color="primary"
            />
      </q-form>
    </div>
  </template>
  
<script setup>
import { onMounted, ref, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const { role } = defineProps(["role"]);

const permissions = ref([]);
const rolePermissions = ref({});
const myForm = ref(null);

const getPermissions = async () => {
    let res = await sendRequest("GET", null, "/api/permission", "");
    permissions.value = res;

    for (const permission of res) {
        rolePermissions.value[permission.id] = false;
    }

    for (const rolePermission of role.permissions) {
        const matchingPermission = res.find(permission => permission.id === rolePermission.id);
        if (matchingPermission) {
            rolePermissions.value[matchingPermission.id] = true;
        }
    }
};

const validate = async () => {
    return await myForm.value.validate();
};

onMounted(() => {
    getPermissions();
});

const selectedPermissionNames = computed(() => {
    return permissions.value.filter(permission => rolePermissions.value[permission.id]).map(permission => permission.name);
});

defineExpose({
    validate,
    selectedPermissionNames
});
</script>