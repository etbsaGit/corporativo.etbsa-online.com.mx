<template>
  <q-expansion-item flat color="primary" icon="menu" label="Opciones">
    <q-list>
      <q-item>
        <q-item-section>
          <q-btn outline label="agregar publicacion" @click="addPost = true" />
        </q-item-section>
        <q-item-section>
          <q-btn outline label="Mis publicaciones" @click="getPostsAuth" />
        </q-item-section>
        <q-item-section side>
          <q-btn outline icon="refresh" @click="getItems" />
        </q-item-section>
      </q-item>
      <q-separator />
      <div v-if="checkSucursal('Corporativo')">
        <q-item>
          <q-item-section>
            <q-item-label align="center">
              <q-icon name="filter_alt" size="sm" />
              Filtros
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
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
              outlined
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
              outlined
              dense
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formFilter.departamento_id"
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
              outlined
              dense
            />
          </q-item-section>
        </q-item>
        <q-item>
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
              outlined
              dense
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formFilter.estatus_id"
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
              outlined
              dense
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn icon="search" outline label="Buscar" @click="getItems" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-expansion-item>

  <div v-for="(cat, index) in posts" :key="index">
    <q-item>
      <q-item-section>
        <post-card :posts="cat" :key="cat" />
      </q-item-section>
    </q-item>
  </div>

  <q-dialog
    v-model="addPost"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Subir" color="blue" @click="storePost" />
        </q-item-section>
      </q-item>
      <q-separator />
      <post-form ref="add" />
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="editPost"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup @click="getItems" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="PutPost" />
        </q-item-section>
      </q-item>
      <q-separator />
      <post-form ref="edit" :post="selectedPost" :key="selectedPost.post_doc" />
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="deletePost"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6"> Borrar publicacion </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="DestroyPost" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label align="center" class="text-h6">
            <strong>
              ¿Deseas borrar la publicacion "{{ selectedPost.title }}" y todos
              sus archivos adjuntos?
            </strong>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import {
  sendRequest,
  checkSucursal,
  dataIncomplete,
  checkRole,
} from "src/boot/functions";
import PostForm from "src/components/Post/PostForm.vue";
import PostCard from "src/components/Post/PostCard.vue";

const { linea } = defineProps(["linea"]);

const bus = inject("bus");
const addPost = ref(false);
const editPost = ref(false);
const deletePost = ref(false);
const posts = ref([]);
const lineas = ref([]);
const sucursales = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const estatus = ref([]);
const add = ref(null);
const edit = ref(null);
const selectedPost = ref(null);

const formFilter = ref({
  estatus_id: null,
  departamento_id: null,
  linea_id: linea ? linea.id : null,
  sucursal_id: null,
  puesto_id: null,
});

bus.on("edit_post", (post) => {
  selectedPost.value = post;
  editPost.value = true;
});

bus.on("delete_post", (post) => {
  selectedPost.value = post;
  deletePost.value = true;
});

const getPosts = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("POST", final, "/api/posts/all", "");
  posts.value = res.posts;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const getPostsGen = async () => {
  let res = await sendRequest("GET", null, "/api/posts/gen", "");
  posts.value = res.posts;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const getPostsAll = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("POST", final, "/api/posts", "");
  posts.value = res.posts;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const getPostsAuth = async () => {
  let res = await sendRequest("GET", null, "/api/posts/auth", "");
  posts.value = res.posts;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
};

const storePost = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formPost,
  };
  let res = await sendRequest("POST", final, "/api/post", "");
  addPost.value = false;
  getItems();
};

const PutPost = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formPost,
  };
  let res = await sendRequest("PUT", final, "/api/post/" + final.id, "");
  editPost.value = false;
  getItems();
};

const DestroyPost = async () => {
  const id = selectedPost.value.id;
  let res = await sendRequest("DELETE", null, "/api/post/" + id, "");
  deletePost.value = false;
  getItems();
};

const getItems = () => {
  if (linea) {
    getPosts();
  } else {
    if (checkRole("Admin")) {
      getPostsAll();
    } else {
      getPostsGen();
    }
  }
};

onMounted(() => {
  getItems();
});
</script>
