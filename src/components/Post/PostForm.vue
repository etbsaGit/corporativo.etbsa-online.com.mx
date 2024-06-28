<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPost.title"
          filled
          dense
          label="Titulo"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPost.description"
          filled
          dense
          label="Descripcion"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPost.sucursal_id"
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
          :disable="!checkSucursal('Corporativo')"
          hint="Si se deja vacío sera visible para todas las sucursales"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formPost.linea_id"
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
          :disable="!checkSucursal('Corporativo')"
          hint="Si se deja vacío sera visible para todas las lineas"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPost.departamento_id"
          :options="departamentos"
          label="Departamento"
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
          :disable="!checkSucursal('Corporativo')"
          hint="Si se deja vacío sera visible para todas los departamentos"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formPost.puesto_id"
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
          :disable="!checkSucursal('Corporativo')"
          hint="Si se deja vacío sera visible para todas los puestos"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPost.estatus_id"
          :options="estatus"
          label="Tipo de publicacion"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-file
          clearable
          filled
          dense
          v-model="model"
          multiple
          max-files="3"
          label="Archivo"
          hint
          @input="convertirFile($event)"
          @clear="formPost.archivos = []"
          @rejected="onRejected"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="local_post">
      <q-item-section>
        <q-list bordered separator class="rounded-borders">
          <q-item v-for="(doc, index) in local_post" :key="index">
            <q-item-section>{{ doc.name }}</q-item-section>
            <q-item-section avatar>
              <q-btn
                flat
                icon="file_open"
                color="blue"
                @click="clickUrl(doc.realpath)"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                flat
                icon="delete"
                color="red"
                @click="clickDelete(doc, index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, checkSucursal } from "src/boot/functions";
import { useQuasar } from "quasar";
import { inject } from "vue";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();
const usuario = authStore.authUser;

const bus = inject("bus");

const $q = useQuasar();

const { post } = defineProps(["post"]);
const myForm = ref(null);
const model = ref(null);

const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const estatus = ref([]);
const local_post = ref(post ? post.post_doc : []);

const formPost = ref({
  id: post ? post.id : null,
  title: post ? post.title : null,
  description: post ? post.description : null,
  sucursal_id: post
    ? post.sucursal_id
    : !checkSucursal("Corporativo") &&
      usuario.empleado &&
      usuario.empleado.sucursal
    ? usuario.empleado.sucursal.id
    : null,
  linea_id: post
    ? post.linea_id
    : !checkSucursal("Corporativo") &&
      usuario.empleado &&
      usuario.empleado.linea
    ? usuario.empleado.linea.id
    : null,
  departamento_id: post
    ? post.departamento_id
    : !checkSucursal("Corporativo") &&
      usuario.empleado &&
      usuario.empleado.departamento
    ? usuario.empleado.departamento.id
    : null,
  puesto_id: post ? post.puesto_id : null,
  estatus_id: post ? post.estatus_id : null,
  archivos: [],
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/posts/forms", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          extension: archivo.name.split(".").pop(),
          base64: base64Data,
        };
        formPost.value.archivos.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  } else {
    formProduct.value.archivos = [];
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

const onRejected = (rejectedEntries) => {
  $q.notify({
    type: "negative",
    message: `No se cargaron ${rejectedEntries.length} archivo(s)`,
  });
};

const clickDelete = async (doc, index) => {
  let res = await sendRequest("DELETE", null, "/api/postDoc/" + doc.id, "");
  local_post.value.splice(index, 1);
};

const clickUrl = (url) => {
  window.open(url, "_blank");
};

onMounted(() => {
  getForms();
});

defineExpose({
  formPost,
  validate,
});
</script>
