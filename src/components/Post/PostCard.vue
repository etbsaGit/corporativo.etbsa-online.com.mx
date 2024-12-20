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
        <q-item-section avatar v-if="checkId(post.user.id)">
          <q-btn
            dense
            color="primary"
            flat
            icon="edit_square"
            @click="openEditPost(post)"
          />
        </q-item-section>
        <q-item-section avatar>
          <q-avatar
            color="primary"
            text-color="white"
            v-if="post.user.empleado && post.user.empleado.picture"
          >
            <img :src="post.user.empleado.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white">
            {{ post.user.name.charAt(0).toUpperCase()
            }}{{ post.user.name.charAt(1).toUpperCase() }}
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
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { formatDateplusone } from "src/boot/formatFunctions";
import { checkId } from "src/boot/functions";
import { inject } from "vue";

const bus = inject("bus");
const { posts } = defineProps(["posts"]);

const openEditPost = (post) => {
  bus.emit("edit_post", post);
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
