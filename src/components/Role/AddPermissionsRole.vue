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
            v-model="selectedPermissionNames"
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

const { role } = defineProps(["role"]);

const permissions = ref([]);
const selectedPermissionNames = ref([]);
const myForm = ref(null);

const getPermissions = async () => {
  let res = await sendRequest("GET", null, "/api/permission", "");
  permissions.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

const marcarToggles = () => {
  if (role) {
    for (const permissions of role.permissions) {
      selectedPermissionNames.value.push(permissions.name);
    }
  }
};

onMounted(() => {
  getPermissions();
  marcarToggles();
});

defineExpose({
  validate,
  selectedPermissionNames,
});
</script>
