<template>
  <div class="q-pa-md">
    <q-card>
      <div class="q-pa-md">
        <q-btn
          label="Registrar Empleado"
          color="primary"
          @click="showAdd = true"
          icon="person_add"
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
          title="Empleados"
          :rows="filteredEmployees"
          :columns="columns"
          row-key="name"
          :visible-columns="visibleColumns"
          dense
        >
          <template v-slot:top="props">
            <div class="col-2 q-table__title">Empleados</div>

            <q-dialog
              v-model="showAdd"
              transition-show="rotate"
              transition-hide="rotate"
            >
              <q-card style="width: 1800px">
                <q-card-section>
                  <div class="text-h6">Registrar Empleado</div>
                </q-card-section>
                <q-separator />

                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                >
                  <q-tab name="tab_form_one" label="Datos Personales" />
                  <q-tab name="tab_form_two" label="Unidad Negocio" />
                  <q-tab name="tab_form_three" label="Expediente" />
                </q-tabs>

                <q-separator />
                <q-card style="height: 65vh" class="q-pa-none scroll" flat>
                  <q-tab-panels v-model="tab" animated keep-alive>
                    <q-tab-panel name="tab_form_one">
                      <add-employeed-form ref="form_1"></add-employeed-form>
                    </q-tab-panel>

                    <q-tab-panel name="tab_form_two">
                      <add-employeedtwo-form
                        ref="form_2"
                      ></add-employeedtwo-form>
                    </q-tab-panel>
                    <q-tab-panel name="tab_form_three">
                      <add-employeedthree-form
                        ref="form_3"
                      ></add-employeedthree-form>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card>

                <q-separator />

                <q-card-actions align="right">
                  <q-btn label="Cancelar" color="red" v-close-popup />
                  <q-btn
                    flat
                    label="Registrar"
                    color="primary"
                    @click="crearEmpleado()"
                  />
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

          <template v-slot:body-cell-nombre="props">
            <q-td @click="onRowClick(props.row)">
              <q-item class="q-my-none" dense>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white"
                    >{{ props.row.nombre.charAt(0).toUpperCase()
                    }}{{
                      props.row.apellidoPaterno.charAt(0).toUpperCase()
                    }}</q-avatar
                  >
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ props.row.nombre }}</q-item-label>
                  <q-item-label caption lines="1">
                    {{ props.row.apellidoPaterno }}
                    {{ props.row.nombre }}@etbsa.com.mx
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </template>

          <template v-slot:body-cell-puesto="props">
            <q-td :props="props">
              {{ props.row.puesto_id.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-sucursal="props">
            <q-td :props="props">
              {{ props.row.sucursal_id.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-linea="props">
            <q-td :props="props">
              {{ props.row.linea_id.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-departamento="props">
            <q-td :props="props">
              {{ props.row.departamento_id.nombre }}
            </q-td>
          </template>
        </q-table>

        <q-dialog
          v-model="showDetails"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="width: 1800px">
            <q-card-section>
              <div class="text-h6">Actualizar Empleado</div>
            </q-card-section>
            <q-separator />

            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="tab_form_one" label="Datos Personales" />
              <q-tab name="tab_form_two" label="Unidad Negocio" />
              <q-tab name="tab_form_three" label="Expediente" />
            </q-tabs>

            <q-separator />
            <q-card style="height: 65vh" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <edit-employeed-form
                    ref="edit_1"
                    :empleado="selectedEmployee"
                  ></edit-employeed-form>
                </q-tab-panel>

                <q-tab-panel name="tab_form_two">
                  <edit-employeedtwo-form
                    ref="edit_2"
                    :empleado="selectedEmployee"
                  ></edit-employeedtwo-form>
                </q-tab-panel>
                <q-tab-panel name="tab_form_three">
                  <edit-employeedthree-form
                    ref="edit_3"
                    :empleado="selectedEmployee"
                  ></edit-employeedthree-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn
                flat
                label="Actualizar"
                color="primary"
                @click="actualizarEmpleado()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddEmployeedForm from "src/components/Employeed/AddEmployeedForm.vue";
import AddEmployeedtwoForm from "src/components/Employeed/AddEmployeedtwoForm.vue";
import AddEmployeedthreeForm from "src/components/Employeed/AddEmployeedthreeForm.vue";
import EditEmployeedForm from "src/components/Employeed/EditEmployeedForm.vue";
import EditEmployeedtwoForm from "src/components/Employeed/EditEmployeedtwoForm.vue";
import EditEmployeedthreeForm from "src/components/Employeed/EditEmployeedthreeForm.vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const form_2 = ref(null);
const form_3 = ref(null);
const edit_1 = ref(null);
const edit_2 = ref(null);
const edit_3 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedEmployee = ref(null);

const visibleColumns = ref([
  "id",
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "sucursal",
  "linea",
  "departamento",
  "puesto"
]);

const tab = ref("tab_form_one");
const searchTerm = ref("");
const showAdd = ref(false);
const employees = ref([]);

const onRowClick = (row) => {
  selectedEmployee.value = row;
  showDetails.value = true;
};

const crearEmpleado = async () => {
  if (
    !form_1.value.formEmployee.nombre ||
    !form_1.value.formEmployee.apellidoPaterno ||
    !form_1.value.formEmployee.apellidoMaterno ||
    !form_1.value.formEmployee.telefono ||
    !form_1.value.formEmployee.fechaDeNacimiento ||
    !form_1.value.formEmployee.curp ||
    !form_1.value.formEmployee.rfc ||
    !form_1.value.formEmployee.ine ||
    !form_1.value.formEmployee.nss ||
    !form_1.value.formEmployee.escolaridad_id ||
    !form_1.value.formEmployee.numeroExterior ||
    !form_1.value.formEmployee.calle ||
    !form_1.value.formEmployee.colonia ||
    !form_1.value.formEmployee.codigoPostal ||
    !form_1.value.formEmployee.ciudad ||
    !form_1.value.formEmployee.estado ||
    !form_1.value.formEmployee.cuentaBancaria ||
    !form_1.value.formEmployee.estadoCivil_id ||
    !form_1.value.formEmployee.tipoDeSangre_id ||
    !form_2.value.formEmployeetwo.sueldoBase ||
    !form_2.value.formEmployeetwo.fechaDeIngreso ||
    !form_2.value.formEmployeetwo.status ||
    !form_2.value.formEmployeetwo.puesto_id ||
    !form_2.value.formEmployeetwo.sucursal_id ||
    !form_2.value.formEmployeetwo.linea_id ||
    !form_2.value.formEmployeetwo.departamento_id
    //  !form_2.value.formEmployeetwo.jefeDirecto_id
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...form_1.value.formEmployee,
    ...form_2.value.formEmployeetwo
  };
  console.log(final);
  try {
    let res = await sendRequest("POST", final, "/api/empleado", "");
    console.log(res);

    // Si la solicitud es exitosa, recarga la página
    //window.location.reload();
    showAdd.value = false;
    getEmployees();
  } catch (error) {
    // Maneja el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const actualizarEmpleado = async () => {
  const final = {
    ...edit_1.value.formEmployee,
    ...edit_2.value.formEmployeetwo
  };
  console.log(final);
  try {
    let res = await sendRequest("PUT", final, "/api/empleado/" + final.id, "");
    console.log(res);

    // Si la solicitud es exitosa, recarga la página
    showDetails.value = false;
    getEmployees();
  } catch (error) {
    // Maneja el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const getEmployees = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/all", "");
  employees.value = res;
};

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true
  },
  {
    name: "apellido_paterno",
    label: "Apellido Paterno",
    align: "left",
    field: "apellidoPaterno",
    sortable: true
  },
  {
    name: "apellido_materno",
    label: "Apellido Materno",
    align: "left",
    field: "apellidoMaterno",
    sortable: true
  },

  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: "puesto_id",
    sortable: true
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: "sucursal_id",
    sortable: true
  },
  {
    name: "linea",
    label: "Linea",
    align: "left",
    field: "linea_id",
    sortable: true
  },
  {
    name: "departamento",
    label: "Departamento",
    align: "left",
    field: "departamento_id",
    sortable: true
  }
];

const filteredEmployees = computed(() => {
  return employees.value.filter((employee) => {
    return (
      employee.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      employee.apellidoPaterno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.apellidoMaterno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.sucursal_id.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.linea_id.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.departamento_id.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.puesto_id.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
  });
});

onMounted(() => {
  getEmployees();
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
