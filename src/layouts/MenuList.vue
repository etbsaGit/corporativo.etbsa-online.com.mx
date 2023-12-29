<template>
  <q-list bordered padding class="rounded-borders text-primary">
    <q-item
      clickable
      v-ripple
      to="/employees"
      :active="link === 'dashboard'"
      @click="link = 'dashboard'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>

      <q-item-section>Empleados</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/departamentos"
      :active="link === 'departamentos'"
      @click="link = 'departamentos'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>

      <q-item-section>Departamentos</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/puestos"
      :active="link === 'puestos'"
      @click="link = 'puestos'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>

      <q-item-section>Puestos</q-item-section>
    </q-item>
    <!--
    <q-item
      clickable
      v-ripple
      to="/calendar"
      :active="link === 'calendar'"
      @click="link = 'calendar'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="send" />
      </q-item-section>

      <q-item-section>Solc. Vacaciones</q-item-section>
    </q-item> -->

    <!-- <q-item
      clickable
      v-ripple
      to="/Count"
      :active="link === 'trash'"
      @click="link = 'trash'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="delete" />
      </q-item-section>

      <q-item-section>Req. Personal</q-item-section>
    </q-item> -->
    <!-- <q-item
      clickable
      v-ripple
      to="/profile"
      :active="link === 'profile'"
      @click="link = 'profile'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="edit" />
      </q-item-section>

      <q-item-section>Perfil</q-item-section>
    </q-item> -->

    <!-- <q-separator spaced /> -->

    <!-- <q-item
      clickable
      v-ripple
      :active="link === 'settings'"
      @click="link = 'settings'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="settings" />
      </q-item-section>

      <q-item-section>Settings</q-item-section>
    </q-item> -->

    <!-- <q-item
      clickable
      v-ripple
      :active="link === 'help'"
      @click="link = 'help'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="phone" />
      </q-item-section>

      <q-item-section>Help</q-item-section>
    </q-item> -->
  </q-list>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      link: ref("inbox")
    };
  }
};
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: green
</style>
