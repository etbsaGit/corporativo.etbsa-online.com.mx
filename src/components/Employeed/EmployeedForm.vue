<template>
  <q-form ref="myForm" greedy>
    <q-item v-if="empleado">
      <q-item-section>
        <q-file
          filled
          dense
          bottom-slots
          v-model="fotografia"
          label="Fotografia"
          clearable
          accept=".jpg,.jpeg,.png,.jpg"
          max-files="1"
          @input="convertirBase64($event, index)"
        >
          <template v-slot:before>
            <q-avatar
              color="primary"
              text-color="white"
              caption
              icon="photo_camera"
            >
            </q-avatar>
          </template>

          <template v-slot:hint>(Opcional)</template>

          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="uploadPicture" />
          </template>
        </q-file>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.nombre"
          filled
          dense
          label="Primer Nombre"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.segundo_nombre"
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
          v-model="formEmployee.apellido_paterno"
          filled
          dense
          label="Apellido paterno"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.apellido_materno"
          filled
          dense
          label="Apellido materno"
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
          hint
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.telefono_institucional"
          filled
          dense
          label="Telefono Institucional"
          mask="##########"
          hint="Opcional"
          :rules="[
            (val) =>
              !val || (val && /^\d{10}$/.test(val)) || 'Debe tener 10 dígitos',
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.correo_institucional"
          filled
          dense
          label="Correo institucional"
          hint="Opcional"
          :rules="[
            (v) => !v || /.+@.+\..+/.test(v) || 'Formato de correo inválido',
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input filled dense hint v-model="formEmployee.calle" label="Calle" />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numero_exterior"
          label="# Exterior"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numero_interior"
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
          hint
          v-model="formEmployee.colonia"
          label="Colonia"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.codigo_postal"
          label="Codigo postal"
          mask="#####"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          hint
          v-model="formEmployee.ciudad"
          label="Ciudad"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          hint
          v-model="formEmployee.estado"
          label="Estado"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.fecha_de_nacimiento"
          mask="date"
          label="Fecha de Nacimiento"
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formEmployee.fecha_de_nacimiento">
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
        <q-input v-model="formEmployee.curp" hint filled dense label="CURP" />
      </q-item-section>
      <q-item-section>
        <q-input v-model="formEmployee.rfc" filled dense label="RFC" hint />
        <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) => (val && val.length === 13) || 'El RFC debe tener exactamente 13 dígitos'
          ]" -->
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input v-model="formEmployee.ine" filled dense label="INE" hint />
        <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) => (val && val.length === 10) || 'El INE debe tener exactamente 10 dígitos'
          ]" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.licencia_de_manejo"
          filled
          dense
          label="Licencia de manejo"
          hint="(opcional)"
        />
        <!-- :rules="[
            (val) =>
              !val ||
              (val && val.length === 16) ||
              'La licencia debe tener exactamente 16 caracteres',
          ]" -->
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
          mask="################"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployee.escolaridad_id"
          :options="escolaridades"
          label="Escolaridad"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          hint
          dense
        />
      </q-item-section>
    </q-item>
    <q-item v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
      <q-item-section>
        <q-input
          v-model="formEmployee.cedula_profecional"
          filled
          dense
          label="Cedula Profesional"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.carrera"
          filled
          dense
          label="Carrera"
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
          hint
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
          v-model="formEmployee.dependientes_economicos"
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
          v-model="formEmployee.estado_civil_id"
          :options="estadosCiviles"
          label="Estado civil"
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
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.tipo_de_sangre_id"
          :options="tiposDeSangre"
          label="Tipo de sangre"
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
          hint
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.cuenta_bancaria"
          filled
          dense
          label="Numero de cuenta bancarias"
          mask="##################"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { api } from "src/boot/axios";
import { inject } from "vue";

const bus = inject("bus"); // inside setup()
const { empleado } = defineProps(["empleado"]);

const estadosCiviles = ref(null);
const tiposDeSangre = ref([]);
const escolaridades = ref([]);
const myForm = ref(null);

const fotografia = ref(null);
const base64 = ref(null);

const formEmployee = ref({
  id: empleado ? empleado.id : null,
  nombre: empleado ? empleado.nombre : null,
  segundo_nombre: empleado ? empleado.segundo_nombre : null,
  apellido_paterno: empleado ? empleado.apellido_paterno : null,
  apellido_materno: empleado ? empleado.apellido_materno : null,
  telefono: empleado ? empleado.telefono : null,
  telefono_institucional: empleado ? empleado.telefono_institucional : null,
  fecha_de_nacimiento: empleado ? empleado.fecha_de_nacimiento : null,
  curp: empleado ? empleado.curp : null,
  rfc: empleado ? empleado.rfc : null,
  ine: empleado ? empleado.ine : null,
  passaporte: empleado ? empleado.passaporte : null,
  visa: empleado ? empleado.visa : null,
  licencia_de_manejo: empleado ? empleado.licencia_de_manejo : null,
  nss: empleado ? empleado.nss : null,
  hijos: empleado ? empleado.hijos : null,
  dependientes_economicos: empleado ? empleado.dependientes_economicos : null,
  escolaridad_id:
    empleado && empleado.escolaridad_id ? empleado.escolaridad.id : null,
  cedula_profecional: empleado ? empleado.cedula_profecional : null,
  carrera: empleado ? empleado.carrera : null,
  numero_exterior: empleado ? empleado.numero_exterior : null,
  numero_interior: empleado ? empleado.numero_interior : null,
  calle: empleado ? empleado.calle : null,
  colonia: empleado ? empleado.colonia : null,
  codigo_postal: empleado ? empleado.codigo_postal : null,
  ciudad: empleado ? empleado.ciudad : null,
  estado: empleado ? empleado.estado : null,
  cuenta_bancaria: empleado ? empleado.cuenta_bancaria : null,
  estado_civil_id:
    empleado && empleado.estado_civil_id ? empleado.estado_civil.id : null,
  tipo_de_sangre_id:
    empleado && empleado.tipo_de_sangre_id ? empleado.tipo_de_sangre.id : null,
  correo_institucional: empleado ? empleado.correo_institucional : null,
});

const uploadPicture = async () => {
  const final = { base64: base64.value };
  let res = await sendRequest(
    "POST",
    final,
    "/api/empleado/uploadPicture/" + empleado.id,
    ""
  );
  fotografia.value = null;
  bus.emit("cargar_empleados");
};

const getAll = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/personal", "");
  estadosCiviles.value = res.estados_civiles;
  tiposDeSangre.value = res.tipos_de_sangre;
  escolaridades.value = res.escolaridades;
};

const convertirBase64 = (event, index) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      // Asignar el valor base64 al campo 'image' de la pregunta específica
      base64.value = base64Data;
    };
    reader.readAsDataURL(archivo);
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getAll();
});

defineExpose({
  formEmployee,
  validate,
});
</script>
