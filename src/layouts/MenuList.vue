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
        <q-icon name="fa-regular fa-id-card" />
      </q-item-section>

      <q-item-section>Perfil</q-item-section>
    </q-item>

    <q-item
      v-if="checkRole('Empleado')"
      dense
      clickable
      v-ripple
      active-class="my-menu-link"
      href="https://forms.office.com/r/SsXJLUWhdL"
      target="_blank"
      disable
    >
      <q-tooltip class="text-h6">Sin encuestas activas</q-tooltip>
      <q-item-section avatar>
        <q-icon name="fa-solid fa-clipboard-list" />
      </q-item-section>

      <q-item-section>Encuesta de satisfacción laboral</q-item-section>
    </q-item>

    <q-item
      dense
      v-if="checkRole('Empleado')"
      clickable
      v-ripple
      to="/etica"
      :active="link === 'etica'"
      @click="link = 'etica'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="diversity_1" />
      </q-item-section>

      <q-item-section>Código de ética</q-item-section>
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

    <q-item
      v-if="checkRole('Empleado')"
      dense
      clickable
      v-ripple
      to="/salidaPermiso"
      :active="link === 'salidaPermiso'"
      @click="link = 'salidaPermiso'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="fa-solid fa-clock" />
      </q-item-section>

      <q-item-section>Permiso 2 horas</q-item-section>
    </q-item>

    <q-item
      clickable
      dense
      v-ripple
      to="/requisiciones"
      :active="link === 'requisiciones'"
      @click="link = 'requisiciones'"
      active-class="my-menu-link"
      v-if="
        checkPuestoIncludes('Jefe') ||
        checkPuestoIncludes('Gerente') ||
        checkPuestoIncludes('Director') ||
        checkRole('RRHH')
      "
    >
      <q-item-section avatar>
        <q-icon name="fa-solid fa-person-circle-plus" />
      </q-item-section>

      <q-item-section>Requisiciones de Personal</q-item-section>
    </q-item>

    <q-item
      dense
      v-if="checkRole('addProp')"
      clickable
      v-ripple
      to="/propuesta"
      :active="link === 'propuesta'"
      @click="link = 'propuesta'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="fa-solid fa-lightbulb" />
      </q-item-section>

      <q-item-section>Propuestas de campañas</q-item-section>
    </q-item>

    <q-item
      v-if="checkRole('Empleado')"
      dense
      clickable
      v-ripple
      to="/suggestion"
      :active="link === 'suggestion'"
      @click="link = 'suggestion'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="support_agent" />
      </q-item-section>

      <q-item-section>Sugerencias y mejoras</q-item-section>
    </q-item>

    <q-expansion-item
      expand-separator
      icon="folder_shared"
      label="Prospeccion"
      dense
      dense-toggle
      group="somegroup"
      v-if="
        checkPuestoIncludes('territorial') ||
        checkPuestoIncludes('Gerente') ||
        checkRole('Admin')
      "
    >
      <q-item
        dense
        clickable
        v-ripple
        to="/visits"
        :active="link === 'visits'"
        @click="link = 'visits'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="event" />
        </q-item-section>

        <q-item-section>Visitas</q-item-section>
      </q-item>
      <q-item
        dense
        clickable
        v-ripple
        to="/prospect"
        :active="link === 'prospect'"
        @click="link = 'prospect'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="assignment_ind" />
        </q-item-section>

        <q-item-section>Prospectos</q-item-section>
      </q-item>
    </q-expansion-item>

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
        dense
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
        dense
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
        dense
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
      <q-item
        v-if="checkRole('RRHH')"
        clickable
        dense
        v-ripple
        to="/festivos"
        :active="link === 'festivos'"
        @click="link = 'festivos'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="surfing" />
        </q-item-section>

        <q-item-section>Festivos</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('Admin')"
        clickable
        dense
        v-ripple
        to="/softSkills"
        :active="link === 'softSkills'"
        @click="link = 'softSkills'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fas fa-clipboard-check" />
        </q-item-section>

        <q-item-section>Competencias laborales</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="payments"
      label="Coordinación de compras"
      dense
      dense-toggle
      group="somegroup"
      v-if="checkRole('cc') || checkRole('Admin')"
    >
      <q-item
        v-if="checkRole('cc') || checkRole('Admin')"
        clickable
        dense
        v-ripple
        to="/vehicles"
        :active="link === 'vehicles'"
        @click="link = 'vehicles'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="garage" />
        </q-item-section>

        <q-item-section>Vehiculos</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('cc') || checkRole('Admin')"
        clickable
        dense
        v-ripple
        to="/services"
        :active="link === 'services'"
        @click="link = 'services'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-screwdriver-wrench" />
        </q-item-section>

        <q-item-section>Servicios</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="fa-solid fa-credit-card"
      label="Credito"
      dense
      dense-toggle
      group="somegroup"
      v-if="checkRole('Credito')"
    >
      <q-item
        clickable
        dense
        v-ripple
        to="/credito/conceptos"
        :active="link === 'credito/conceptos'"
        @click="link = 'credito/conceptos'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-regular fa-rectangle-list" />
        </q-item-section>

        <q-item-section>Conceptos</q-item-section>
      </q-item>
      <q-item
        clickable
        dense
        v-ripple
        to="/credito/declaracion"
        :active="link === 'credito/declaracion'"
        @click="link = 'credito/declaracion'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-regular fa-rectangle-list" />
        </q-item-section>

        <q-item-section>Declaración de la situación financiera</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="engineering"
      label="Taller"
      group="somegroup"
      v-if="
        checkRole('Servicio') || checkRole('Taller') || checkPuesto('Tecnico')
      "
    >
      <q-item
        v-if="
          checkRole('Servicio') ||
          checkRole('Taller') ||
          checkPuestoIncludes('Gerente')
        "
        clickable
        dense
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
        dense
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
      <q-item
        v-if="checkPuestoIncludes('Gerente')"
        clickable
        dense
        v-ripple
        to="/bays"
        :active="link === 'bays'"
        @click="link = 'bays'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>

        <q-item-section>Bahías</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="psychology_alt"
      label="Evaluaciones"
      group="somegroup"
      v-if="checkRole('Empleado')"
    >
      <q-item
        v-if="checkRole('Encuestador') || checkRole('Evaluador')"
        clickable
        dense
        v-ripple
        to="/surveys"
        :active="link === 'surveys'"
        @click="link = 'surveys'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="psychology_alt" />
        </q-item-section>

        <q-item-section>Evaluaciones para empleados</q-item-section>
      </q-item>
      <q-item
        v-if="checkRole('Empleado')"
        clickable
        dense
        v-ripple
        to="/evaluaciones"
        :active="link === 'evaluaciones'"
        @click="link = 'evaluaciones'"
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
        dense
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
        dense
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
      icon="agriculture"
      label="Semi-nuevos"
      group="somegroup"
      v-if="checkRole('Usados')"
    >
      <q-item
        clickable
        v-ripple
        to="/used"
        :active="link === 'used'"
        @click="link = 'used'"
        active-class="my-menu-link"
        dense
      >
        <q-item-section avatar>
          <q-icon name="agriculture" />
        </q-item-section>

        <q-item-section>Inventario</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="point_of_sale"
      label="Caja"
      group="somegroup"
      v-if="checkRole('Caja')"
    >
      <q-item
        clickable
        dense
        v-ripple
        to="/caja/transaccion"
        :active="link === 'caja/transaccion'"
        @click="link = 'caja/transaccion'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-circle-dollar-to-slot" />
        </q-item-section>

        <q-item-section>Transaccion</q-item-section>
      </q-item>

      <q-item
        clickable
        dense
        v-ripple
        to="/caja/reportes"
        :active="link === 'caja/reportes'"
        @click="link = 'caja/reportes'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-magnifying-glass-dollar" />
        </q-item-section>

        <q-item-section>Reportes</q-item-section>
      </q-item>

      <q-item
        clickable
        dense
        v-ripple
        to="/caja/admin"
        :active="link === 'caja/admin'"
        @click="link = 'caja/admin'"
        active-class="my-menu-link"
        v-if="checkRole('AdminCaja')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-sack-dollar" />
        </q-item-section>

        <q-item-section>Administracion</q-item-section>
      </q-item>

      <q-item
        clickable
        dense
        v-ripple
        to="/caja/catalogos"
        :active="link === 'caja/catalogos'"
        @click="link = 'caja/catalogos'"
        active-class="my-menu-link"
        v-if="checkRole('AdminCaja')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-file-invoice-dollar" />
        </q-item-section>

        <q-item-section>Catalogos</q-item-section>
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
        dense
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
import {
  checkRole,
  checkPuesto,
  checkRoleEmpleado,
  checkPuestoIncludes,
  checkSucursal,
} from "../boot/functions";

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


