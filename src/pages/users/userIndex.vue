<template>
  <div class="q-pa-md">
    <q-btn
      label="Registrar usuario"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />

    <div><br /></div>

    <q-input
      outlined
      class="boton"
      color="gray-9"
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
      title="Users"
      :rows="filteredUsers"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      dense
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Users</div>

        <q-dialog
          v-model="showAdd"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="max-width: 1000px">
            <q-card-section>
              <div class="text-h6">Registrar usuario</div>
            </q-card-section>
            <q-separator />

            <q-separator />
            <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <add-user-form ref="form_1"></add-user-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn flat label="Registrar" color="blue" @click="crearUser" />
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
          flat
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
      <q-card style="max-width: 1000px">
        <q-card-section>
          <div class="text-h6">Actualizar usuario</div>
        </q-card-section>
        <q-separator />

        <q-separator />
        <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="tab_form_one">
              <edit-user-form
                ref="edit_1"
                :user="selectedUser"
              ></edit-user-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn
            flat
            label="Actualizar"
            color="blue"
            @click="actualizarUser()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddUserForm from "src/components/User/AddUserForm.vue";
import EditUserForm from "src/components/User/EditUserForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedUser = ref(null);

const visibleColumns = ref(["id", "name", "email", "email_verified_at"]);

const tab = ref("tab_form_one");
const searchTerm = ref("");
const showAdd = ref(false);
const users = ref([]);

const onRowClick = (row) => {
  selectedUser.value = row;
  showDetails.value = true;
};

const crearUser = async () => {
  if (
    !form_1.value.formUser.name ||
    !form_1.value.formUser.email ||
    !form_1.value.formUser.password ||
    !form_1.value.formUser.confirmPassword
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  if (
    form_1.value.formUser.password !== form_1.value.formUser.confirmPassword
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La contraseña y la confirmación de la contraseña no coinciden"
    });
    return;
  }
  const final = {
    ...form_1.value.formUser
  };
  console.log(final);
  try {
    let res = await sendRequest("POST", final, "/api/user", "");
    console.log(res);

    // Si la solicitud es exitosa, recarga la página
    showAdd.value = false;
    getUsers();
  } catch (error) {
    // Maneja el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const actualizarUser = async () => {
  if (
    edit_1.value.formUser.password !== edit_1.value.formUser.confirmPassword
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La contraseña y la confirmación de la contraseña no coinciden"
    });
    return;
  }
  const final = {
    ...edit_1.value.formUser
  };
  console.log(final);
  try {
    let res = await sendRequest("PUT", final, "/api/user/" + final.id, "");
    console.log(res);

    // Si la solicitud es exitosa, cierra el diálogo y actualiza la lista de usuarios
    showDetails.value = false;
    getUsers();
  } catch (error) {
    // Manejar el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const getUsers = async () => {
  let res = await sendRequest("GET", null, "/api/user/all", "");
  users.value = res;
};

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
    sortable: true
  },
  {
    name: "email",
    label: "Email",
    align: "left",
    field: "email",
    sortable: true
  },
  {
    name: "email_verified_at",
    label: "Email_verified_at",
    align: "left",
    field: "email_verified_at",
    sortable: true
  }
];

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });
});

onMounted(() => {
  getUsers();
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
