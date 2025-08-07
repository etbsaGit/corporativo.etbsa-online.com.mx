<template>
  <q-card class="my-card shadow-2 rounded-borders">
    <!-- Encabezado -->
    <q-card-section class="bg-primary text-white">
      <div class="text-h5 q-mb-xs">Requisición de Vacante</div>
    </q-card-section>

    <!-- Puesto y Ubicación -->
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-list dense bordered class="bg-grey-1 rounded-borders q-pa-sm">
            <q-item-label header class="text-bold">📌 Puesto</q-item-label>
            <q-item>
              <q-item-section>
                <strong>{{ requisicion.puesto.nombre }}</strong>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong>Departamento:</strong>
                  {{ requisicion.departamento.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong>Linea:</strong>
                  {{ requisicion.linea.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Escolaridad:</strong>
                  {{ requisicion.escolaridad.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-6">
          <q-list dense bordered class="bg-grey-1 rounded-borders q-pa-sm">
            <q-item-label header class="text-bold">📍 Sucursal</q-item-label>
            <q-item>
              <q-item-section>{{ requisicion.sucursal.nombre }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-caption">
                {{ requisicion.sucursal.direccion }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Total posiciones: </strong>
                  {{ requisicion.total_posiciones }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>

    <!-- Requisitos -->
    <q-separator spaced />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-list dense bordered class="bg-grey-1 rounded-borders q-pa-sm">
            <q-item-label header class="text-bold">
              🎯 Perfil Requerido
            </q-item-label>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Sexo: </strong>
                  {{ requisicion.sexo }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Edad: </strong>
                  {{ requisicion.rango_edad }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Habilidades: </strong>
                  {{ requisicion.habilidades }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Idiomas: </strong>
                  {{ requisicion.idiomas || "Ninguno" }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Manejo de equipo: </strong>
                  {{ requisicion.manejo_equipo }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-6">
          <q-list dense bordered class="bg-grey-1 rounded-borders q-pa-sm">
            <q-item-label header class="text-bold">
              💼 Rol y Compensación
            </q-item-label>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Sueldo: $ </strong>
                  {{ requisicion.sueldo_mensual_inicial.toLocaleString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Comisiones:</strong>
                  ${{ requisicion.comisiones.toLocaleString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Experiencia: </strong>
                  {{ requisicion.experiencia_conocimientos }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Actividades: </strong>
                  {{ requisicion.actividades_desempenar }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Tipo vacante: </strong>
                  {{ requisicion.tipo_vacante }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong> Motivo: </strong>
                  {{ requisicion.motivo_vacante }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>

    <!-- Competencias y Herramientas -->
    <q-separator spaced />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="text-bold q-mb-sm">🧠 Competencias</div>
          <q-chip
            v-for="(c, i) in requisicion.competencias"
            :key="i"
            color="primary"
            text-color="white"
            class="q-mr-sm q-mb-sm"
          >
            {{ c.nombre }}
          </q-chip>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-bold q-mb-sm">🛠️ Herramientas</div>
          <q-chip
            v-for="(h, i) in requisicion.herramientas"
            :key="i"
            color="secondary"
            text-color="white"
            class="q-mr-sm q-mb-sm"
          >
            {{ h.nombre }}
          </q-chip>
        </div>
      </div>
    </q-card-section>

    <!-- Autorizaciones -->
    <q-separator spaced />

    <q-card-section>
      <div class="text-bold text-h6 q-mb-md">👥 Autorizaciones</div>
      <div class="row q-col-gutter-md">
        <div
          class="col-12 col-md-6"
          v-for="(persona, label, index) in {
            solicita: 'Solicita',
            autoriza: 'Autoriza',
            vo_bo: 'Vo. Bo.',
            recibe: 'Recibe',
          }"
          :key="index"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar size="60px">
                <img :src="requisicion[label].picture" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle1">
                <strong>
                  {{ requisicion[label].nombreCompleto }}
                </strong>
              </div>
              <div class="text-caption">{{ persona }}</div>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const { requisicion } = defineProps(["requisicion"]);
</script>

<style scoped>
.my-card {
  max-width: 1000px;
  margin: auto;
  border-radius: 16px;
}
</style>
