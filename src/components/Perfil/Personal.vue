<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.nombre"
          filled
          dense
          label="Primer Nombre"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.segundo_nombre"
          filled
          dense
          label="Segundo Nombre"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.apellido_paterno"
          filled
          dense
          label="Apellido paterno"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.apellido_materno"
          filled
          dense
          label="Apellido materno"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.telefono"
          filled
          dense
          label="Telefono"
          mask="##########"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.telefono_institucional"
          filled
          dense
          label="Telefono Institucional"
          mask="##########"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.correo_institucional"
          filled
          dense
          label="Correo institucional"
        />
      </q-item-section>
    </q-item>


    <q-item>
      <q-item-section>
        <q-input
          disable filled dense v-model="formEmployee.calle" label="Calle" />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.numero_exterior"
          label="# Exterior"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.numero_interior"
          label="# Interior"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.colonia"
          label="Colonia"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.codigo_postal"
          label="Codigo postal"
          mask="#####"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.ciudad"
          label="Ciudad"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.estado"
          label="Estado"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          filled
          dense
          v-model="formEmployee.fecha_de_nacimiento"
          mask="date"
          label="Fecha de Nacimiento"
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
        <q-input
          disable
          v-model="formEmployee.curp"
          filled
          dense
          label="CURP"
          />
      </q-item-section>
      <q-item-section>

        <q-input
          disable 
          v-model="formEmployee.rfc" 
          filled
          dense
          label="RFC"/>

      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>

        <q-input
          disable
          v-model="formEmployee.ine"
          filled
          dense
          label="INE"
          />

      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.licencia_de_manejo"
          filled
          dense
          label="Licencia de manejo"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.passaporte"
          filled
          dense
          label="Pasaporte"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.visa"
          filled
          dense
          label="Visa"
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
          dense
          disable
        />
      </q-item-section>
    </q-item>
    <q-item v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.cedula_profecional"
          filled
          dense
          label="Cedula Profesional"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.carrera"
          filled
          dense
          label="Carrera"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.nss"
          filled
          dense
          label="Numero de seguridad social"
          mask="###########"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.hijos"
          filled
          dense
          label="Numero de hijos"
          mask="###"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.dependientes_economicos"
          filled
          dense
          label="Numero de dependientes economicos"
          mask="###"
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
          disable
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
          disable
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          disable
          v-model="formEmployee.cuenta_bancaria"
          filled
          dense
          label="Numero de cuenta bancarias"
          mask="##################"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { empleado } = defineProps(["empleado"]);

const estadosCiviles = ref(null);
const tiposDeSangre = ref([]);
const escolaridades = ref([]);
const myForm = ref(null);

const formEmployee = ref({
  fotografia: empleado.fotografia,
  id: empleado.id,
  nombre: empleado.nombre,
  segundo_nombre: empleado.segundo_nombre,
  apellido_paterno: empleado.apellido_paterno,
  apellido_materno: empleado.apellido_materno,
  telefono: empleado.telefono,
  telefono_institucional: empleado.telefono_institucional,
  fecha_de_nacimiento: empleado.fecha_de_nacimiento,
  curp: empleado.curp,
  rfc: empleado.rfc,
  ine: empleado.ine,
  passaporte: empleado.passaporte,
  visa: empleado.visa,
  licencia_de_manejo: empleado.licencia_de_manejo,
  nss: empleado.nss,
  hijos: empleado.hijos,
  dependientes_economicos: empleado.dependientes_economicos,
  escolaridad_id: empleado.escolaridad_id ? empleado.escolaridad.nombre : null,
  cedula_profecional: empleado.cedula_profecional,
  carrera: empleado.carrera,
  numero_exterior: empleado.numero_exterior,
  numero_interior: empleado.numero_interior,
  calle: empleado.calle,
  colonia: empleado.colonia,
  codigo_postal: empleado.codigo_postal,
  ciudad: empleado.ciudad,
  estado: empleado.estado,
  cuenta_bancaria: empleado.cuenta_bancaria,
  estado_civil_id: empleado.estado_civil_id ? empleado.estado_civil.nombre : null,
  tipo_de_sangre_id: empleado.tipo_de_sangre_id
    ? empleado.tipo_de_sangre.nombre
    : null,
  correo_institucional: empleado.correo_institucional
});

</script>
