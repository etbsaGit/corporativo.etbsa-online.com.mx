<template>
  <div class="q-pa-md">
    <q-btn
      label="Registrar role"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />

    <div><br /></div>

    <q-input
      outlined
      class="boton"
      color="green-9"
      v-model="searchTerm"
      label="Buscar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <br />

    <q-table
      flat
      bordered
      title="Roles"
      :rows="filteredRoles"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      dense
      class="text-uppercase"
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Roles</div>

        <q-dialog
          v-model="showAdd"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="width: 2000px">
            <q-card-section>
              <div class="text-h6">Registrar Role</div>
            </q-card-section>
            <q-separator />

            <q-separator />
            <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <add-role-form ref="form_1"></add-role-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn label="Registrar" color="blue" @click="crearRole" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          style="min-width: 150px"
          option-value="name"
        />

        <q-btn
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <template v-slot:body-cell-name="props">
        <q-td @click="onRowClick(props.row)">
          <q-item class="q-my-none" dense>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">{{
                props.row.name.charAt(0).toUpperCase()
              }}</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ props.row.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showDetails"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="width: 2000px">
        <q-card-section>
          <div class="text-h6">Actualizar role</div>
        </q-card-section>
        <q-separator />

        <q-separator />
        <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="tab_form_one">
              <edit-role-form
                ref="edit_1"
                :role="selectedRole"
              ></edit-role-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn label="Actualizar" color="blue" @click="actualizarRole()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddRoleForm from "src/components/Role/AddRoleForm.vue";
import EditRoleForm from "src/components/Role/EditRoleForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedRole = ref(null);

const visibleColumns = ref(["id", "name"]);

const tab = ref("tab_form_one");
const searchTerm = ref("");
const showAdd = ref(false);
const roles = ref([]);

const onRowClick = (row) => {
  selectedRole.value = row;
  showDetails.value = true;
};

const crearRole = async () => {
  const form1_valid = await form_1.value.validate();
  if (!form1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...form_1.value.formRole
  };
  try {
    let res = await sendRequest("POST", final, "/api/role", "");

    showAdd.value = false;
    getRoles();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const actualizarRole = async () => {
  const edit1_valid = await edit_1.value.validate();
  if (!edit1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...edit_1.value.formRole
  };
  console.log(edit_1.value.selectedPermissions);
  // try {
  //   let res = await sendRequest("PUT", final, "/api/role/" + final.id, "");
  //   showDetails.value = false;
  //   getRoles();
  // } catch (error) {
  //   console.error("Error al enviar la solicitud:", error);
  // }
};

const getRoles = async () => {
  let res = await sendRequest("GET", null, "/api/role", "");
  roles.value = res;
};

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name",
    sortable: true
  }
];

const filteredRoles = computed(() => {
  return roles.value.filter((role) => {
    return role.name.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

onMounted(() => {
  getRoles();
});
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
