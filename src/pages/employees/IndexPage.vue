<template>
  <q-item v-if="checkRole('RRHH')">
    <q-btn
      dense
      label="Registrar Empleado"
      color="primary"
      @click="showAdd = true"
      icon="person_add"
    />
  </q-item>
  <q-item>
    <q-btn
      dense
      color="primary"
      icon-right="archive"
      label="Export to csv"
      no-caps
      @click="exportTableCSV(columns, filteredEmployees)"
    />
  </q-item>
  <q-item v-if="checkRole('RRHH')">
    <q-item-section>
      <q-select
        v-model="formFilter.sucursal_id"
        :options="sucursales"
        label="Sucursal"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formFilter.linea_id"
        :options="lineas"
        label="Linea"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formFilter.departamento_id"
        :options="departamentos"
        label="Departamentos"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formFilter.puesto_id"
        :options="puestos"
        label="Puesto"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-btn
        color="primary"
        icon="search"
        label="Buscar"
        dense
        filled
        @click="getAll"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        class="boton"
        color="green-9"
        v-model="searchTerm"
        label="Buscar empleado"
      >
        <template v-slot:prepend>
          <q-icon name="person_search" />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Empleados"
        :rows="filteredEmployees"
        :columns="columns"
        row-key="name"
        :visible-columns="visibleColumns"
        dense
        :rows-per-page-options="[0]"
        class="my-sticky-last-column-table"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">Empleados</div>
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
        <template v-slot:body-cell-id="props">
          <q-td>
            <q-item class="q-my-none" dense>
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  v-if="props.row.picture"
                >
                  <img :src="props.row.picture" alt="Foto del empleado" />
                </q-avatar>
                <q-avatar v-else color="primary" text-color="white">
                  {{ props.row.nombre.charAt(0).toUpperCase()
                  }}{{ props.row.apellido_paterno.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn-dropdown dense flat color="primary" icon="menu">
              <q-list v-close-popup>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="onRowClickCV(props.row)"
                    flat
                    size="sm"
                    label="Perfil"
                    icon="face"
                  />
                </q-item>
                <q-item v-if="checkRole('RRHH')">
                  <q-btn
                    color="primary"
                    @click="onRowClick(props.row)"
                    flat
                    size="sm"
                    label="Editar"
                    icon="edit"
                  />
                </q-item>
                <q-item v-if="checkRole('RRHH')">
                  <q-btn
                    color="primary"
                    @click="onRowClickFile(props.row)"
                    flat
                    size="sm"
                    label="Expediente"
                    icon="folder"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="onRowClickSkill(props.row)"
                    flat
                    size="sm"
                    label="Skill"
                    icon="analytics"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="openCareerDialog(props.row)"
                    flat
                    size="sm"
                    label="Carreras"
                    icon="work"
                  />
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
        <template v-slot:body-cell-puesto="props">
          <q-td :props="props">
            {{ props.row.puesto.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.sucursal.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-linea="props">
          <q-td :props="props">
            {{ props.row.linea.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-departamento="props">
          <q-td :props="props">
            {{ props.row.departamento.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-estado_civil="props">
          <q-td :props="props">
            {{ props.row.estado_civil.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-escolaridad="props">
          <q-td :props="props">
            {{ props.row.escolaridad.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-tipo_de_sangre="props">
          <q-td :props="props">
            {{ props.row.tipo_de_sangre.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-jefe_directo="props">
          <q-td :props="props">
            <template v-if="props.row.jefe_directo">
              {{ props.row.jefe_directo.nombre }}
            </template>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>
  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 1800px">
      <q-card-section
        class="d-flex bg-primary text-white justify-between items-center q-pa-sm"
      >
        <div class="text-h6">Registrar Empleado</div>
        <q-card-actions align="right">
          <q-item>
            <q-item-section>
              <q-btn label="Cerrar" color="red" v-close-popup />
            </q-item-section>
            <q-item-section>
              <q-btn
                :disable="!form_1 || !form_2"
                label="Registrar"
                color="blue"
                @click="crearEmpleado()"
              />
            </q-item-section>
          </q-item>
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="tab_form_one" label="Datos Personales" />
        <q-tab name="tab_form_two" label="Unidad Negocio" />
      </q-tabs>
      <q-separator />
      <div class="survey-form-container">
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab_form_one" class="q-pa-none">
            <employeed-form ref="form_1" :empleado="null" />
          </q-tab-panel>
          <q-tab-panel name="tab_form_two" class="q-pa-none">
            <employeed-two-form ref="form_2" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="showDetails"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card>
      <q-card-section
        class="d-flex bg-primary text-white justify-between items-center q-pa-sm"
      >
        <div class="text-h6">
          Actualizar {{ selectedEmployee.nombreCompleto }}
        </div>
        <q-card-actions align="right">
          <q-item>
            <q-item-section>
              <q-btn label="Cerrar" color="red" v-close-popup />
            </q-item-section>
            <q-item-section>
              <q-btn
                :disable="!edit_1 || !edit_2"
                label="Actualizar"
                color="blue"
                @click="actualizarEmpleado()"
              />
            </q-item-section>
          </q-item>
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="tab_form_one" label="Datos Personales" />
        <q-tab name="tab_form_two" label="Unidad Negocio" />
      </q-tabs>
      <q-separator />
      <div class="survey-form-container">
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab_form_one" class="q-pa-none">
            <employeed-form ref="edit_1" :empleado="selectedEmployee" />
          </q-tab-panel>
          <q-tab-panel name="tab_form_two" class="q-pa-none">
            <employeed-two-form ref="edit_2" :empleado="selectedEmployee" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showFiles"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Expediente de {{ selectedEmployee.nombreCompleto }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <employeed-three-form ref="edit_3" :empleado="selectedEmployee" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showSkill"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Skill de {{ selectedEmployee.nombreCompleto }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
            <q-btn label="Guardar" color="blue" @click="saveSkillRatings" />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <skill-rating-form :employee="selectedEmployee" ref="skill" />
      </q-page-container>
    </q-layout>
  </q-dialog>
  <q-dialog
    v-model="showCareerDialog"
    transition-show="rotate"
    transition-hide="rotate"
    full-height
    persistent
  >
    <q-card style="width: 500px">
      <q-card-section
        class="d-flex bg-primary text-white justify-between items-center q-pa-sm"
      >
        <div class="text-h6">
          Carrera de {{ selectedEmployee.nombreCompleto }}
        </div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <employee-time-line :empleado="selectedEmployee" :editable="true" />
      </div>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="showCV"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Historico y habilidades de {{ selectedEmployee.nombreCompleto }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <cv-employee :employee="selectedEmployee" />
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { sendRequest, checkRole } from "src/boot/functions";
import { exportTableCSV } from "src/boot/exportData";
import { useQuasar, exportFile } from "quasar";
import EmployeedForm from "src/components/Employeed/EmployeedForm.vue";
import EmployeedTwoForm from "src/components/Employeed/EmployeedTwoForm.vue";
import EmployeedThreeForm from "src/components/Employeed/EmployeedThreeForm.vue";
import SkillRatingForm from "src/components/Skill/SkillRatingForm.vue";
import EmployeeTimeLine from "src/components/Employeed/EmployeeTimeLine.vue";
import CvEmployee from "src/components/Employeed/CvEmployee.vue";

const bus = inject("bus"); // inside setup()

const form_1 = ref(null);
const form_2 = ref(null);
const edit_1 = ref(null);
const edit_2 = ref(null);
const edit_3 = ref(null);
const skill = ref(null);
const skill_valid = ref();
const edit1_valid = ref();
const edit2_valid = ref();
const $q = useQuasar();
const showDetails = ref(false);
const showFiles = ref(false);
const showSkill = ref(false);
const showCareerDialog = ref(false);
const showCV = ref(false);
const showAdd = ref(false);
const selectedEmployee = ref(null);
const employees = ref([]);
const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const tab = ref("tab_form_one");
const searchTerm = ref("");

const formFilter = ref({
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  puesto_id: null,
});

const visibleColumns = ref([
  "id",
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "sucursal",
  "linea",
  "departamento",
  "puesto",
  "actions",
]);

const columns = [
  { name: "id", label: "Foto", align: "left", field: "id", sortable: false },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "segundo_nombre",
    label: "Segundo nombre",
    align: "left",
    field: "segundo_nombre",
    sortable: true,
  },
  {
    name: "apellido_paterno",
    label: "Apellido Paterno",
    align: "left",
    field: "apellido_paterno",
    sortable: true,
  },
  {
    name: "apellido_materno",
    label: "Apellido Materno",
    align: "left",
    field: "apellido_materno",
    sortable: true,
  },
  {
    name: "telefono",
    label: "Telefono",
    align: "left",
    field: "telefono",
    sortable: true,
  },
  {
    name: "telefono_institucional",
    label: "Telefono institucional",
    align: "left",
    field: "telefono_institucional",
    sortable: true,
  },
  {
    name: "correo_institucional",
    label: "Correo institucional",
    align: "left",
    field: "correo_institucional",
    sortable: true,
  },
  {
    name: "fecha_de_nacimiento",
    label: "Fecha de nacimiento",
    align: "left",
    field: "fecha_de_nacimiento",
    sortable: true,
  },
  {
    name: "rfc",
    label: "RFC",
    align: "left",
    field: "rfc",
    sortable: true,
  },
  {
    name: "ine",
    label: "INE",
    align: "left",
    field: "ine",
    sortable: true,
  },
  {
    name: "pasaporte",
    label: "Pasaporte",
    align: "left",
    field: "pasaporte",
    sortable: true,
  },
  {
    name: "visa",
    label: "VISA",
    align: "left",
    field: "visa",
    sortable: true,
  },
  {
    name: "licencia_de_manejo",
    label: "Licencia de manejo",
    align: "left",
    field: "licencia_de_manejo",
    sortable: true,
  },
  {
    name: "nss",
    label: "NSS",
    align: "left",
    field: "nss",
    sortable: true,
  },
  {
    name: "fecha_de_ingreso",
    label: "Fecha de ingreso",
    align: "left",
    field: "fecha_de_ingreso",
    sortable: true,
  },
  {
    name: "hijos",
    label: "Hijos",
    align: "left",
    field: "hijos",
    sortable: true,
  },
  {
    name: "dependientes_economicos",
    label: "Depandientes economicos",
    align: "left",
    field: "dependientes_economicos",
    sortable: true,
  },
  {
    name: "estado_civil",
    label: "Estado civil",
    align: "left",
    field: "estado_civil",
    sortable: true,
  },
  {
    name: "tipo_de_sangre",
    label: "Tipo de sangre",
    align: "left",
    field: "tipo_de_sangre",
    sortable: true,
  },
  {
    name: "escolaridad",
    label: "Escolaridad",
    align: "left",
    field: "escolaridad",
    sortable: true,
  },
  {
    name: "cedula_profesional",
    label: "Cedula profecional",
    align: "left",
    field: "cedula_profesional",
    sortable: true,
  },
  {
    name: "sueldo_base",
    label: "Sueldo base",
    align: "left",
    field: "sueldo_base",
    sortable: true,
  },
  {
    name: "comision",
    label: "Comision",
    align: "left",
    field: "comision",
    sortable: true,
  },
  {
    name: "numero_exterior",
    label: "Numero exterior",
    align: "left",
    field: "numero_exterior",
    sortable: true,
  },
  {
    name: "numero_interior",
    label: "Numero interior",
    align: "left",
    field: "numero_interior",
    sortable: true,
  },
  {
    name: "calle",
    label: "Calle",
    align: "left",
    field: "calle",
    sortable: true,
  },
  {
    name: "colonia",
    label: "Colonia",
    align: "left",
    field: "colonia",
    sortable: true,
  },
  {
    name: "codigo_postal",
    label: "Codigo postal",
    align: "left",
    field: "codigo_postal",
    sortable: true,
  },
  {
    name: "ciudad",
    label: "Ciudad",
    align: "left",
    field: "ciudad",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    align: "left",
    field: "estado",
    sortable: true,
  },
  {
    name: "cuenta_bancaria",
    label: "Cuenta bancaria",
    align: "left",
    field: "cuenta_bancaria",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: "sucursal",
    sortable: true,
  },
  {
    name: "linea",
    label: "Linea",
    align: "left",
    field: "linea",
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    align: "left",
    field: "departamento",
    sortable: true,
  },
  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: "puesto",
    sortable: true,
  },
  {
    name: "jefe_directo",
    label: "Jefe directo",
    align: "left",
    field: "jefe_directo",
    sortable: true,
  },
  {
    name: "descripcion_puesto",
    label: "Descripcion puesto",
    align: "left",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
];

const openCareerDialog = (row) => {
  selectedEmployee.value = row;
  showCareerDialog.value = true;
};

const onRowClick = (row) => {
  selectedEmployee.value = row;
  showDetails.value = true;
};

const onRowClickCV = (row) => {
  selectedEmployee.value = row;
  showCV.value = true;
};

const onRowClickSkill = (row) => {
  selectedEmployee.value = row;
  showSkill.value = true;
};

const onRowClickFile = (row) => {
  selectedEmployee.value = row;
  showFiles.value = true;
};

const crearEmpleado = async () => {
  const form1_valid = await form_1.value.validate();
  const form2_valid = await form_2.value.validate();
  if (!form1_valid || !form2_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...form_1.value.formEmployee,
    ...form_2.value.formEmployeetwo,
  };
  let res = await sendRequest("POST", final, "/api/empleado", "");
  showAdd.value = false;
  getAll();
};

const actualizarEmpleado = async () => {
  edit1_valid.value = await edit_1.value.validate();
  edit2_valid.value = await edit_2.value.validate();
  if (!edit1_valid.value || !edit2_valid.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit_1.value.formEmployee,
    ...edit_2.value.formEmployeetwo,
  };
  let res = await sendRequest("PUT", final, "/api/empleado/" + final.id, "");
  showDetails.value = false;
  getAll();
};

const saveSkillRatings = async () => {
  skill_valid.value = await skill.value.validate();
  if (!skill_valid.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  let res = await sendRequest(
    "PUT",
    skill.value.skillratings,
    "/api/skillratings",
    ""
  );
  bus.emit("new-skill");
};

const getAll = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("POST", final, "/api/empleado/negocios", "");
  employees.value = res.empleados;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
};

const filteredEmployees = computed(() => {
  return employees.value.filter((employee) => {
    return (
      employee.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      employee.apellido_paterno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.apellido_materno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.sucursal.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.linea.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.departamento.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.puesto.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
  });
});

bus.on("cargar_empleados", () => {
  getAll();
  showDetails.value = false;
});

onMounted(() => {
  getAll();
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
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}

.my-sticky-last-column-table thead tr:last-child th:last-child,
.my-sticky-last-column-table td:last-child {
  /* El color de fondo es importante para th; solo especifica uno */
  background-color: #f0f0f0;
}

.my-sticky-last-column-table th:last-child,
.my-sticky-last-column-table td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
