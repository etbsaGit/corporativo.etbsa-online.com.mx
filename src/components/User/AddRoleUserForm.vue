<template>
  <q-form ref="myForm" greedy class="q-gutter-y-sm">
    <div class="row items-start">
      <q-item v-for="role in roles" :key="role.id" class="col-4">
        <q-item-section>
          <q-toggle
            v-model="selectedRolesNames"
            :label="role.name"
            :val="role.name"
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
const roles = ref([]);
const selectedRolesNames = ref([]);

const getRoles = async () => {
  let res = await sendRequest("GET", null, "/api/role", "");
  roles.value = res;
};

const marcarToggles = () => {
  if (user) {
    for (const role of user.roles) {
      selectedRolesNames.value.push(role.name);
    }
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getRoles();
  marcarToggles();
});

defineExpose({
  validate,
  selectedRolesNames,
});
</script>
