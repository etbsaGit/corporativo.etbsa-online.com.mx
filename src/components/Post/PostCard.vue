<template>
  <q-card bordered>
    <q-item align="center">
      <q-item-section class="col-1">
        <q-avatar
          color="primary"
          text-color="white"
          size="80px"
          v-if="post.user.empleado && post.user.empleado.picture"
        >
          <img :src="post.user.empleado.picture" alt="Foto del empleado" />
          <q-badge floating color="teal">
            {{ post.user.empleado.nombre }}
          </q-badge>
        </q-avatar>
        <q-avatar size="80px" v-else color="primary" text-color="white">
          {{ post.user.name.charAt(0).toUpperCase()
          }}{{ post.user.name.charAt(1).toUpperCase() }}
          <q-badge floating color="teal">{{ post.user.name }}</q-badge>
        </q-avatar>
      </q-item-section>

      <q-item-section class="col-5">
        <q-item-label class="text-h6">{{ post.title }}</q-item-label>
        <q-item-label class="text-caption">{{ post.description }}</q-item-label>
        <q-item-label>
          <strong>Tipo de publicacion: </strong>
          {{ post.estatus.nombre }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-1">
        <q-item-label>
          <strong>Ultima actualizacion: </strong>
        </q-item-label>
        <q-item-label>
          {{ formatDate(post.updated_at) }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-4">
        <q-item-label>
          <strong>Dirigido a: </strong>
        </q-item-label>
        <q-item-label>
          <strong>Sucursal: </strong>
          {{ post.sucursal ? post.sucursal.nombre : "Todas las sucursales" }}
        </q-item-label>
        <q-item-label>
          <strong>Linea: </strong>
          {{ post.linea ? post.linea.nombre : "Todas las lineas" }}
        </q-item-label>
        <q-item-label>
          <strong>Departamento: </strong>
          {{
            post.departamento
              ? post.departamento.nombre
              : "Todas los departamantos"
          }}
        </q-item-label>
        <q-item-label>
          <strong>Puesto: </strong>
          {{ post.puesto ? post.puesto.nombre : "Todas los puestos" }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-btn-dropdown
          dense
          flat
          color="primary"
          icon="menu"
          v-if="checkId(post.user.id)"
        >
          <q-list v-close-popup>
            <q-item>
              <q-btn
                color="blue"
                @click="openEditPost"
                flat
                size="sm"
                label="Editar"
                icon="edit"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                size="sm"
                color="red"
                icon="delete"
                label="Borrar"
                @click="openDeletePost"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
    <q-card-section>
      <q-item>
        <q-item-section
          thumbnail
          v-for="(doc, index) in post.post_doc"
          :key="index"
        >
          <a :href="doc.realpath" target="_blank" class="q-btn q-btn-item">
            <q-icon name="file_open" />
            {{ doc.name }}
          </a>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { formatDate } from "src/boot/formatFunctions";
import { checkId } from "src/boot/functions";
import { inject } from "vue";

const bus = inject("bus");
const { post } = defineProps(["post"]);

const openEditPost = () => {
  bus.emit("edit_post", post);
};

const openDeletePost = () => {
  bus.emit("delete_post", post);
};
</script>
