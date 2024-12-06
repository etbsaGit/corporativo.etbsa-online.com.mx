<template>
  <!-- - -->
  <q-card class="no-shadow" bordered>
    <q-card-section class="row">
      <div class="text-h6 text-weight-bolder text-grey-8">
        {{ posts[0].estatus.nombre }}
      </div>
    </q-card-section>
    <q-separator></q-separator>

    <q-list separator>
      <q-item
        v-for="(post, index) in posts"
        :key="index"
        :class="getCardClass(post.activo)"
        bordered
        separator
      >
        <q-item-section avatar>
          <q-avatar
            color="primary"
            text-color="white"
            v-if="post.user.empleado && post.user.empleado.picture"
          >
            <img :src="post.user.empleado.picture" alt="Foto del empleado" />
            <!-- <q-badge floating color="teal">
              {{ post.user.empleado.nombre }}
            </q-badge> -->
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white">
            {{ post.user.name.charAt(0).toUpperCase()
            }}{{ post.user.name.charAt(1).toUpperCase() }}
            <!-- <q-badge floating color="teal">{{ post.user.name }}</q-badge> -->
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ post.title }}</q-item-label>
          <q-item-label caption lines="2">
            {{ post.description }}
          </q-item-label>
          <q-item-label caption lines="3">
            <strong>Vence: </strong>
            {{ formatDateplusone(post.fecha_caducidad) }}
          </q-item-label>
        </q-item-section>

        <q-item-section
          side
          top
          v-for="(doc, index) in post.post_doc"
          :key="index"
        >
          <q-btn
            dense
            :href="doc.realpath"
            target="_blank"
            icon="file_open"
            no-caps
          >
            <q-tooltip class="text-h6">
              {{ doc.name }}
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side top>
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
                  @click="openEditPost(post)"
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
                  @click="openDeletePost(post)"
                />
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <!-- <q-card bordered :class="getCardClass(post.activo)">
    <q-item align="center">
      <q-item-section avatar>
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
      <q-item-section>
        <q-item-label class="text-h6">{{ post.title }}</q-item-label>
        <q-item-label class="text-caption">{{ post.description }}</q-item-label>
        <q-item-label>
          <strong>Tipo de publicacion: </strong>
          {{ post.estatus.nombre }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <strong>Estatus: </strong>
          {{ post.activo == 1 ? "Activa" : "No activa" }}
        </q-item-label>

        <q-item-label>
          <strong>Fecha caducidad: </strong>
        </q-item-label>
        <q-item-label>
          {{ formatDateplusone(post.fecha_caducidad) }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <strong>Ultima actualizacion: </strong>
        </q-item-label>
        <q-item-label>
          {{ formatDate(post.updated_at) }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <strong>Dirigido a: </strong>
        </q-item-label>
        <q-item-label>
          <strong>Sucursal: </strong>
          {{ post.sucursal ? post.sucursal.nombre : "Todas" }}
        </q-item-label>
        <q-item-label>
          <strong>Linea: </strong>
          {{ post.linea ? post.linea.nombre : "Todas" }}
        </q-item-label>
        <q-item-label>
          <strong>Departamento: </strong>
          {{ post.departamento ? post.departamento.nombre : "Todos" }}
        </q-item-label>
        <q-item-label>
          <strong>Puesto: </strong>
          {{ post.puesto ? post.puesto.nombre : "Todos" }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
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
    <q-separator v-if="post.post_doc[0]" />
    <q-expansion-item
      v-if="post.post_doc[0]"
      icon="folder_open"
      label="Archivos"
      dense
      dense-toggle
      flat
    >
      <q-item>
        <q-item-section
          thumbnail
          v-for="(doc, index) in post.post_doc"
          :key="index"
          class="q-pa-xs"
        >
          <q-btn
            dense
            :href="doc.realpath"
            target="_blank"
            icon="file_open"
            :label="doc.name"
            no-caps
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-card> -->
</template>
<script setup>
import { formatDateplusone, formatDate } from "src/boot/formatFunctions";
import { checkId } from "src/boot/functions";
import { inject } from "vue";

const bus = inject("bus");
const { posts } = defineProps(["posts"]);

const openEditPost = (post) => {
  bus.emit("edit_post", post);
};

const openDeletePost = (post) => {
  bus.emit("delete_post", post);
};

const getCardClass = (activo, fc) => {
  if (activo === 0) {
    return "custom-card q-activo-0";
  } else if (activo === 1) {
    return "custom-card q-activo-1";
  } else {
    return "custom-card q-activo-null";
  }
};
</script>

<style scoped>
.custom-card {
  transition: transform 0.3s ease-in-out;
}

.custom-card.q-activo-0 {
  background-color: #ffcccc;
  border-color: #ffcccc;
}

.custom-card.q-activo-1 {
  background-color: #ccffcc;
  border-color: #ccffcc;
}

.custom-card.q-activo-null {
  background-color: #ccc;
  border-color: #ccc;
}

.custom-card:hover {
  transform: scale(1.01);
}
</style>
