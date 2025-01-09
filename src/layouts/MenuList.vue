<template>
  <q-list class="text-primary">
    <q-item
      dense
      v-if="checkRole('Empleado')"
      clickable
      v-ripple
      to="/perfil"
      :active="link === 'perfil'"
      @click="link = 'perfil'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="person" />
      </q-item-section>

      <q-item-section>Perfil</q-item-section>
    </q-item>

    <q-item
      dense
      v-if="checkRole('Empleado')"
      clickable
      v-ripple
      to="/post"
      :active="link === 'post'"
      @click="link = 'post'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="description" />
      </q-item-section>

      <q-item-section>Archivos</q-item-section>
    </q-item>

    <q-item
      v-if="checkRole('Empleado')"
      dense
      clickable
      v-ripple
      to="/calendar"
      :active="link === 'calendar'"
      @click="link = 'calendar'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="calendar_month" />
      </q-item-section>

      <q-item-section>Calendario</q-item-section>
    </q-item>

    <q-item
      v-if="checkRole('Empleado')"
      dense
      clickable
      v-ripple
      to="/vacation"
      :active="link === 'vacation'"
      @click="link = 'vacation'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="beach_access" />
      </q-item-section>

      <q-item-section>Vacaciones</q-item-section>
    </q-item>

    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="RRHH"
      dense
      dense-toggle
      group="somegroup"
      v-if="checkRole('RRHH')"
    >
      <q-item
        v-if="checkRole('RRHH') || checkRole('Jefe')"
        clickable
        v-ripple
        to="/employees"
        :active="link === 'dashboard'"
        @click="link = 'dashboard'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="group" />
        </q-item-section>

        <q-item-section>Empleados</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('RRHH')"
        clickable
        v-ripple
        to="/catalogos"
        :active="link === 'catalogos'"
        @click="link = 'catalogos'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="list" />
        </q-item-section>

        <q-item-section>Catalogos para empleados</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('RRHH')"
        clickable
        v-ripple
        to="/incapacities"
        :active="link === 'incapacities'"
        @click="link = 'incapacities'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="person_off" />
        </q-item-section>

        <q-item-section>Incapacidades para empleados</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="engineering"
      label="Taller"
      group="somegroup"
    >
      <q-item
        v-if="checkRole('Servicio') || checkRole('Taller')"
        clickable
        v-ripple
        to="/technician"
        :active="link === 'technician'"
        @click="link = 'technician'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="engineering" />
        </q-item-section>

        <q-item-section>Tecnicos</q-item-section>
      </q-item>
      <q-item
        v-if="checkPuesto('Tecnico')"
        clickable
        v-ripple
        to="/techlogs"
        :active="link === 'techlogs'"
        @click="link = 'techlogs'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="manage_history" />
        </q-item-section>

        <q-item-section>Diario de horas</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="psychology_alt"
      label="Evaluaciones"
      group="somegroup"
    >
      <q-item
        v-if="checkRole('Encuestador') || checkRole('Evaluador')"
        clickable
        v-ripple
        to="/surveys"
        :active="link === 'surveys'"
        @click="link = 'surveys'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="psychology_alt" />
        </q-item-section>

        <q-item-section>Encuestas para empleados</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('Empleado')"
        clickable
        v-ripple
        to="/encuestas"
        :active="link === 'encuestas'"
        @click="link = 'encuestas'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="quiz" />
        </q-item-section>

        <q-item-section>Mis evaluaciones</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="car_rental"
      label="Rentas"
      v-if="checkRole('Rentas')"
      group="somegroup"
    >
      <q-item
        clickable
        v-ripple
        to="/rentalperiods"
        :active="link === 'rentalperiods'"
        @click="link = 'rentalperiods'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="event_note" />
        </q-item-section>

        <q-item-section>Rentas</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/rentalmachines"
        :active="link === 'rentalmachines'"
        @click="link = 'rentalmachines'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="car_rental" />
        </q-item-section>

        <q-item-section>Maquinas para renta</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="admin_panel_settings"
      label="Administracion"
      v-if="checkRoleEmpleado()"
      group="somegroup"
    >
      <q-item
        clickable
        v-ripple
        to="/users"
        :active="link === 'users'"
        @click="link = 'users'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="manage_accounts" />
        </q-item-section>

        <q-item-section>Usuarios</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { checkRole, checkPuesto, checkRoleEmpleado } from "../boot/functions";

const link = ref("perfil");
</script>

<style scoped>
/* Elementos activos (en cualquier nivel) */
.my-menu-link {
  color: white;
  background-color: #5b686d;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* Hover en elementos que no están activos */
.q-item:not(.my-menu-link):hover {
  transform: scale(1.02);
  background-color: #f1f1f1;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

/* Lista general */
.q-list {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

/* Estilo general de q-item */
.q-item {
  margin-bottom: 8px;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

/* Expansión */
.q-expansion-item {
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hover y estilo activo para q-item dentro de q-expansion-item */
.q-expansion-item .q-item {
  background-color: transparent;
}

.q-expansion-item .q-item.my-menu-link {
  background-color: #5b686d;
  color: white;
}

.q-expansion-item .q-item:not(.my-menu-link):hover {
  background-color: #e0e0e0;
}

/* Transición visual suave */
.q-expansion-item .q-item,
.q-item {
  transition: background-color 0.3s ease, transform 0.2s ease;
}
</style>


