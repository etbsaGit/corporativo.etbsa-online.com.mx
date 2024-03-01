<template>
    <div>
      <q-form ref="myForm" greedy>
            <q-toggle
              v-for="role in roles" :key="role.id"
              v-model="userRoles[role.id]"
              :label="role.name"
              color="primary"
            />
      </q-form>
    </div>
  </template>
  
<script setup>
import { onMounted, ref, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const { user } = defineProps(["user"]);

const roles = ref([]);
const userRoles = ref({});
const myForm = ref(null);

const getRoles = async () => {
    let res = await sendRequest("GET", null, "/api/role", "");
    roles.value = res;

    for (const role of res) {
        userRoles.value[role.id] = false;
    }

    for (const userRole of user.roles) {
        const matchingRole = res.find(role => role.id === userRole.id);
        if (matchingRole) {
            userRoles.value[matchingRole.id] = true;
        }
    }
};

const validate = async () => {
    return await myForm.value.validate();
};

onMounted(() => {
    getRoles();
});

const selectedRolesNames = computed(() => {
    return roles.value.filter(role => userRoles.value[role.id]).map(role => role.name);
});

defineExpose({
    validate,
    selectedRolesNames
});
</script>
  