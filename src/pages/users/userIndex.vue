<template>
  <q-item>
    <q-btn
      label="Registrar usuario"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        class="boton"
        color="gray-9"
        v-model="searchTerm"
        label="Buscar"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-table
    flat
    bordered
    title="Users"
    :rows="filteredUsers"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:top="props">
      <div class="col-2 q-table__title">Users</div>
      <q-space />
      <q-btn
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
        class="q-ml-md"
      />
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn-dropdown flat color="primary" icon="menu" dense>
          <q-list v-close-popup>
            <q-item>
              <q-btn
                @click="onRowClick(props.row)"
                color="primary"
                flat
                size="sm"
                label="Editar"
                icon="edit"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-td>
    </template>
  </q-table>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Registrar Usuario</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Registrar" color="blue" @click="crearUser" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <user-form ref="form_1" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showDetails"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Actualizar usuario {{ selectedUser.name }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Actualizar" color="blue" @click="actualizarUser()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <user-form ref="edit_1" :user="selectedUser" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import UserForm from "src/components/User/UserForm.vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedUser = ref(null);

const searchTerm = ref("");
const showAdd = ref(false);
const users = ref([]);

const onRowClick = (row) => {
  selectedUser.value = row;
  showDetails.value = true;
};

const crearUser = async () => {
  const form1_valid = await form_1.value.validate();
  if (!form1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
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
      message: "La contraseña y la confirmación de la contraseña no coinciden",
    });
    return;
  }
  const final = {
    ...form_1.value.formUser,
  };
  let res = await sendRequest("POST", final, "/api/user", "");
  showAdd.value = false;
  getUsers();
};

const actualizarUser = async () => {
  const edit1_valid = await edit_1.value.validate();
  if (!edit1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  if (edit_1.value.formUser.password === "") {
    edit_1.value.formUser.password = null;
    edit_1.value.formUser.confirmPassword = null;
  }
  if (
    edit_1.value.formUser.password !== edit_1.value.formUser.confirmPassword
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La contraseña y la confirmación de la contraseña no coinciden",
    });
    return;
  }
  const final = {
    ...edit_1.value.formUser,
  };
  let res = await sendRequest("PUT", final, "/api/user/" + final.id, "");
  showDetails.value = false;
  getUsers();
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
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    align: "left",
    field: "email",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
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

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>
