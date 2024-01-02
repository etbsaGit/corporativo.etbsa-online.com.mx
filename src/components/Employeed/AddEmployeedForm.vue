<template>
  <q-form class="q-gutter-y-sm text-uppercase">
    <!-- <q-item>
      <q-file
        v-model="formEmployee.foto"
        filled
        outlined
        bottom-slots
        label="Foto Empleado"
        counter
        hint="Seleccionar Foto"
        class="col-12"
      >
        <template v-slot:before>
          <q-avatar size="64px">
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon
            v-if="formEmployee.foto !== null"
            name="close"
            @click.stop.prevent="formEmployee.foto = null"
            class="cursor-pointer"
          />
          <q-icon name="create_new_folder" @click.stop.prevent />
        </template>
      </q-file>
    </q-item> -->

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.nombre"
          filled
          dense
          label="Primer Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.segundoNombre"
          filled
          dense
          label="Segundo Nombre"
          hint="(opcional)"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.apellidoPaterno"
          filled
          dense
          label="Apellido paterno"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.apellidoMaterno"
          filled
          dense
          label="Apellido materno"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.telefono"
          filled
          dense
          label="Telefono"
          mask="##########"
          lazy-rules
          :rules="[
            (val) => (val && val.length === 10) || 'Deben de ser 10 digitos'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.calle"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Calle"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numeroExterior"
          label="# Exterior"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numeroInterior"
          label="# Interior"
          hint="Opcional"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.colonia"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Colonia"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.codigoPostal"
          label="Codigo postal"
          mask="#####"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.ciudad"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Ciudad"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.estado"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Estado"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.fechaDeNacimiento"
          mask="date"
          label="Fecha de Nacimiento"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formEmployee.fechaDeNacimiento">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.curp"
          filled
          dense
          label="CURP"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 18) ||
              'La CURP debe tener exactamente 18 caracteres'
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 13) ||
              'La RFC debe tener exactamente 13 caracteres'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.ine"
          filled
          dense
          label="INE"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 18) ||
              'La INE debe tener exactamente 18 caracteres'
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.licenciaDeManejo"
          filled
          dense
          label="Licencia de manejo"
          hint="(opcional)"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.passaporte"
          filled
          dense
          label="Pasaporte"
          hint="(opcional)"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.visa"
          filled
          dense
          label="Visa"
          hint="(opcional)"
          :rules="[
            (val) => !val || (val && val.length > 16) || 'Campo inválido'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          @update:model-value="obtenerEscolaridad"
          v-model="escolaridad"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="escolaridades"
          label="Escolaridad"
          option-value="id"
          option-label="nombre"
        />
      </q-item-section>
      <q-item-section v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
        <q-input
          v-model="formEmployee.cedulaProfecional"
          filled
          dense
          label="Cedula Profesional"
          hint
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.nss"
          filled
          dense
          label="Numero de seguridad social"
          mask="###########"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 11) ||
              'EL numero de seguro consta de 11 digitos'
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.hijos"
          filled
          dense
          label="Numero de hijos"
          mask="###"
          hint="Opcional"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.dependientesEconomicos"
          filled
          dense
          label="Numero de dependientes economicos"
          mask="###"
          hint="Opcional"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          @update:model-value="obtenerEstadoCivil"
          v-model="estadoCivil"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="estadosCiviles"
          label="Estado civil"
          option-value="id"
          option-label="nombre"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          @update:model-value="obtenerTipoDeSangre"
          v-model="tipoDeSangre"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="tiposDeSangre"
          label="Tipo de sangre"
          option-value="id"
          option-label="nombre"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.cuentaBancaria"
          filled
          dense
          label="Numero de cuenta bancarias"
          mask="##################"
          lazy-rules
          :rules="[
            (val) => (val && val.length === 18) || 'Debes ingresar 18 digitos'
          ]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const $q = useQuasar();
const estadosCiviles = ref(null);
const estadoCivil = ref("");
const tiposDeSangre = ref([]);
const tipoDeSangre = ref("");
const escolaridades = ref([]);
const escolaridad = ref("");

const formEmployee = ref({
  nombre: null,
  segundoNombre: null,
  apellidoPaterno: null,
  apellidoMaterno: null,
  telefono: null,
  fechaDeNacimiento: null,
  curp: null,
  rfc: null,
  ine: null,
  passaporte: null,
  visa: null,
  licenciaDeManejo: null,
  nss: null,
  hijos: null,
  dependientesEconomicos: null,
  escolaridad_id: null,
  cedulaProfecional: null,
  foto: null,
  numeroExterior: null,
  numeroInterior: null,
  calle: null,
  colonia: null,
  codigoPostal: null,
  ciudad: null,
  estado: null,
  cuentaBancaria: null,
  estadoCivil_id: null,
  tipoDeSangre_id: null
});

const getEstadosCiviles = async () => {
  let res = await sendRequest("GET", null, "/api/estadoCivil/all", "");
  estadosCiviles.value = res;
};

const getTiposDeSangre = async () => {
  let res = await sendRequest("GET", null, "/api/tipoDeSangre/all", "");
  tiposDeSangre.value = res;
};

const getEscolaridades = async () => {
  let res = await sendRequest("GET", null, "/api/escolaridad/all", "");
  escolaridades.value = res;
};

const obtenerEstadoCivil = (newValue) => {
  estadoCivil.value = newValue;
  formEmployee.value.estadoCivil_id = newValue.id;
};

const obtenerTipoDeSangre = (newValue) => {
  tipoDeSangre.value = newValue;
  formEmployee.value.tipoDeSangre_id = newValue.id;
};

const obtenerEscolaridad = (newValue) => {
  escolaridad.value = newValue;
  formEmployee.value.escolaridad_id = newValue.id;
};

onMounted(() => {
  getEstadosCiviles();
  getTiposDeSangre();
  getEscolaridades();
});

defineExpose({
  formEmployee
});
</script>
