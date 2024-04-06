<template>
  <q-form ref="myForm" greedy class="q-gutter-y-sm">
    <div class="row items-start">
      <q-item
        v-for="permission in permissions"
        :key="permission.id"
        class="col-4"
      >
        <q-item-section>
          <q-toggle
            v-model="selectedPermissionsNames"
            :label="permission.name"
            :val="permission.name"
            color="blue"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-form>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { sendRequest } from "src/boot/functions";

const { user } = defineProps(["user"]);

const myForm = ref(null);
const permissions = ref([]);
const selectedPermissionsNames = ref([]);

const getPermissions = async () => {
  let res = await sendRequest("GET", null, "/api/permission", "");
  permissions.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

const marcarToggles = () => {
  if (user) {
    for (const permission of user.permissions) {
      selectedPermissionsNames.value.push(permission.name);
    }
  }
};

onMounted(() => {
  getPermissions();
  marcarToggles();
});

defineExpose({
  validate,
  selectedPermissionsNames,
});
</script>
