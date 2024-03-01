<template>
    <div>
      <q-form ref="myForm" greedy>
            <q-toggle
              v-for="permission in permissions" :key="permission.id"
              v-model="userPermissions[permission.id]"
              :label="permission.name"
              color="primary"
            />
      </q-form>
    </div>
  </template>
  
<script setup>
import { onMounted, ref, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const { user } = defineProps(["user"]);

const permissions = ref([]);
const userPermissions = ref({});
const myForm = ref(null);

const getPermissions = async () => {
    let res = await sendRequest("GET", null, "/api/permission", "");
    permissions.value = res;

    for (const permission of res) {
        userPermissions.value[permission.id] = false;
    }

    for (const userPermission of user.permissions) {
        const matchingPermission = res.find(permission => permission.id === userPermission.id);
        if (matchingPermission) {
            userPermissions.value[matchingPermission.id] = true;
        }
    }
};

const validate = async () => {
    return await myForm.value.validate();
};

onMounted(() => {
    getPermissions();
});

const selectedPermissionsNames = computed(() => {
    return permissions.value.filter(permission => userPermissions.value[permission.id]).map(permission => permission.name);
});

defineExpose({
    validate,
    selectedPermissionsNames
});
</script>
  