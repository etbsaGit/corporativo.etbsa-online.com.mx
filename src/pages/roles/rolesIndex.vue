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
      <template v-slot:body-cell-permisos="props">
        <q-td>
          <q-btn @click="onRowClickFile(props.row)" flat round color="primary" icon="key" />
          <!-- <q-btn flat round color="primary" icon="key" /> -->
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

    <q-dialog
          v-model="showPermissions"
          transition-show="rotate"
          transition-hide="rotate"
          persistent
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">
                Permisos del rol {{ selectedRole.name }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab2" animated keep-alive>
                <q-tab-panel name="tab_form_two">
                  <add-permissions-role
                    ref="edit"
                    :role="selectedRole"
                  />
                </q-tab-panel>
              </q-tab-panels>
              <q-separator />
              <q-card-actions align="right">
                <q-btn label="Cancelar" color="red" v-close-popup />
                <q-btn
                  label="Actualizar permisos"
                  color="blue"
                  @click="asignPermissionsRole()"
                />
              </q-card-actions>
            </q-card>
          </q-card>
        </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddRoleForm from "src/components/Role/AddRoleForm.vue";
import EditRoleForm from "src/components/Role/EditRoleForm.vue";
import AddPermissionsRole from "src/components/Role/AddPermissionsRole.vue"

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);
const edit = ref(null)

const $q = useQuasar();

const showDetails = ref(false);
const selectedRole = ref(null);

const visibleColumns = ref(["id", "name", "permisos"]);

const tab = ref("tab_form_one");
const tab2 = ref("tab_form_two");
const searchTerm = ref("");
const showAdd = ref(false);
const showPermissions = ref(false);
const roles = ref([]);

const onRowClick = (row) => {
  selectedRole.value = row;
  showDetails.value = true;
};

const onRowClickFile = (row) => {
  selectedRole.value = row;
  showPermissions.value = true;
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
  try {
    let res = await sendRequest("PUT", final, "/api/role/" + final.id, "");
    showDetails.value = false;
    getRoles();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const asignPermissionsRole = async () => {
  const final = {
    id: selectedRole.value.id,
    name: selectedRole.value.name,
    permissions: edit.value.selectedPermissionNames
  }
  try {
    let res = await sendRequest("PUT", final, "/api/role/" + final.id, "");
    $q.notify({
      color: "green-5",
      textColor: "white",
      icon: "check",
      message: "Permisos actualizados con exito"
    });
    showPermissions.value = false
    getRoles()
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }

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
  },
  {
    name: "permisos",
    label: "Permisos",
    align: "left",
    field: "permisos",
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
