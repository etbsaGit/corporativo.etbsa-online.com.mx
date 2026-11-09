<template>
  <!-- Banner informativo cuando se visualiza desde "Gasolina Unidad" / Mi Unidad -->
  <q-card
    v-if="onlyMyUnit"
    flat
    bordered
    class="q-ma-sm bg-blue-1 border-primary"
  >
    <q-card-section class="q-py-sm q-px-md">
      <div v-if="assignedVehicles.length > 0">
        <div
          class="text-subtitle2 text-weight-bold text-primary flex items-center q-mb-xs"
        >
          <q-icon name="directions_car" size="22px" class="q-mr-xs" />
          {{
            assignedVehicles.length === 1
              ? "Mi Unidad Asignada:"
              : `Mis Unidades Asignadas (${assignedVehicles.length}):`
          }}
        </div>

        <div class="row q-col-gutter-sm">
          <div
            v-for="veh in assignedVehicles"
            :key="veh.id"
            class="col-12 col-md-6"
          >
            <div
              class="q-pa-xs q-px-sm bg-white rounded-borders row items-center justify-between shadow-1 cursor-pointer"
              :class="
                Number(filterForm.vehicle_id) === Number(veh.id)
                  ? 'border-primary'
                  : ''
              "
              @click="toggleUnitFilter(veh.id)"
            >
              <div>
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="primary" class="text-weight-bold q-px-sm">
                    {{ veh.placas || "S/P" }}
                  </q-badge>
                  <span class="text-caption text-weight-medium text-grey-9">
                    {{ veh.estatus?.nombre || "Unidad" }}
                  </span>
                  <q-badge
                    v-if="
                      Number(authStore.authUser?.empleado?.vehicle_id) ===
                      Number(veh.id)
                    "
                    color="amber-9"
                    text-color="white"
                    label="Responsable"
                  />
                </div>
                <div class="text-caption text-grey-7">
                  Serie: <strong>{{ veh.serie || "N/A" }}</strong> &bull;
                  Sucursal:
                  <strong>{{ veh.sucursal?.nombre || "N/A" }}</strong> &bull;
                  Depto:
                  <strong>{{ veh.departamento?.nombre || "N/A" }}</strong>
                </div>
              </div>

              <q-badge color="orange-9" class="q-pa-xs text-caption">
                <q-icon name="speed" class="q-mr-xs" />
                Último KM: {{ formatKm(veh.ultimo_km || 0) }}
              </q-badge>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!loading"
        class="row items-center text-negative q-gutter-x-sm"
      >
        <q-icon name="warning" size="24px" />
        <span class="text-subtitle2 text-weight-medium">
          Actualmente no tienes ninguna unidad vehicular asignada en el sistema.
        </span>
      </div>
    </q-card-section>
  </q-card>

  <!-- Barra Superior de Filtros -->
  <q-card flat bordered class="q-ma-sm bg-white">
    <q-card-section class="q-pa-sm">
      <div class="row q-col-gutter-sm items-center">
        <!-- Búsqueda General -->
        <div
          :class="
            !onlyMyUnit || assignedVehicles.length > 1
              ? 'col-12 col-md-3'
              : 'col-12 col-md-4'
          "
        >
          <q-input
            outlined
            dense
            clearable
            label="Buscar placa, serie, folio, notas, solicitante..."
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Selector de Unidad (Placa) -->
        <div
          v-if="!onlyMyUnit || assignedVehicles.length > 1"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-select
            v-model="filterForm.vehicle_id"
            :options="filteredVehicles"
            label="Unidad (Placa)"
            option-value="id"
            :option-label="
              (v) =>
                v ? `${v.placas || 'S/P'} (${v.estatus?.nombre || ''})` : ''
            "
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterVehiclesFn"
            clearable
            outlined
            dense
            options-dense
            @update:model-value="getRows(1)"
          />
        </div>

        <!-- Selector Sucursal Cargo -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filterForm.suc_cargo_id"
            :options="catalogs.sucursales_cargo"
            label="Sucursal Cargo"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            clearable
            outlined
            dense
            options-dense
            @update:model-value="getRows(1)"
          />
        </div>

        <!-- Selector Depto Cargo y Acciones -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="row no-wrap items-center q-gutter-x-xs">
            <q-select
              class="col"
              v-model="filterForm.depto_cargo_id"
              :options="catalogs.deptos_cargo"
              label="Depto Cargo"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
              @update:model-value="getRows(1)"
            />
            <q-btn
              v-if="hasActiveFilters"
              flat
              round
              dense
              color="negative"
              icon="filter_alt_off"
              @click="clearFilters"
            >
              <q-tooltip>Limpiar filtros</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!onlyMyUnit || assignedVehicles.length > 0"
              unelevated
              dense
              color="primary"
              icon="local_gas_station"
              :label="onlyMyUnit ? 'Nueva Solicitud' : 'Nueva Dispersión'"
              class="q-px-sm"
              @click="openCreate"
            >
              <q-tooltip>Registrar nueva solicitud de gasolina</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- Tabla Principal de Dispersión de Gasolina -->
  <q-item class="q-pt-none">
    <q-item-section>
      <q-table
        flat
        bordered
        :title="
          onlyMyUnit
            ? 'Dispersión de Gasolina'
            : 'Solicitudes de Dispersión de Gasolina'
        "
        :rows="rows"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        :rows-per-page-options="[0]"
      >
        <!-- Top bar slot -->
        <template v-slot:top>
          <div
            class="row full-width items-center justify-between q-py-xs q-col-gutter-y-xs"
          >
            <div class="row items-center q-gutter-x-sm wrap">
              <q-icon name="local_gas_station" color="primary" size="26px" />
              <span class="text-h6 text-weight-bold text-dark">
                {{
                  onlyMyUnit
                    ? assignedVehicles.length === 1
                      ? `Dispersión de Gasolina (${
                          assignedVehicles[0]?.placas || "S/P"
                        })`
                      : "Dispersión de Gasolina"
                    : "Dispersión de Gasolina"
                }}
              </span>
              <q-badge
                color="primary"
                outline
                :label="`${totalRegistros} solicitud(es)`"
              />

              <q-separator vertical inset class="q-mx-xs gt-xs" />

              <!-- Botón 1: Por Revisar (Azul) con contador -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusSolicitadoId)"
                :outline="!isEstatusActive(estatusSolicitadoId)"
                color="primary"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusSolicitadoId)"
              >
                <span>Por Revisar</span>
                <q-badge
                  :color="
                    isEstatusActive(estatusSolicitadoId) ? 'white' : 'primary'
                  "
                  :text-color="
                    isEstatusActive(estatusSolicitadoId) ? 'primary' : 'white'
                  "
                  class="q-ml-xs text-weight-bolder"
                >
                  {{ countPorRevisar }}
                </q-badge>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusSolicitadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes Por Revisar (Solicitado)"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón 2: Por dispersar (Azul) con contador -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusPorDispersarId)"
                :outline="!isEstatusActive(estatusPorDispersarId)"
                color="primary"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusPorDispersarId)"
              >
                <span>Por dispersar</span>
                <q-badge
                  :color="
                    isEstatusActive(estatusPorDispersarId) ? 'white' : 'primary'
                  "
                  :text-color="
                    isEstatusActive(estatusPorDispersarId) ? 'primary' : 'white'
                  "
                  class="q-ml-xs text-weight-bolder"
                >
                  {{ countPorDispersar }}
                </q-badge>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusPorDispersarId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes Por dispersar"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón 3: Dispersadas (Verde) -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusDispersadoId)"
                :outline="!isEstatusActive(estatusDispersadoId)"
                color="positive"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusDispersadoId)"
              >
                <span>Dispersadas</span>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusDispersadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes Dispersadas"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón 4: No Autorizadas (Rojo) -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusNoAutorizadoId)"
                :outline="!isEstatusActive(estatusNoAutorizadoId)"
                color="negative"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusNoAutorizadoId)"
              >
                <span>No Autorizadas</span>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusNoAutorizadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes No Autorizadas"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón Quitar Filtro de Estatus -->
              <q-btn
                v-if="filterForm.estatus_id"
                flat
                dense
                round
                size="sm"
                color="grey-7"
                icon="close"
                @click="clearStatusFilter"
              >
                <q-tooltip>Quitar filtro de estatus (mostrar todas)</q-tooltip>
              </q-btn>
            </div>

            <div class="row items-center q-gutter-x-sm">
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                :icon="allExpanded ? 'unfold_less' : 'unfold_more'"
                :label="
                  allExpanded
                    ? 'Contraer detalles'
                    : 'Desplegar todos los detalles'
                "
                @click="toggleExpandAll"
              />
            </div>
          </div>
        </template>

        <!-- Cabecera de la tabla -->
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-2">
            <q-th auto-width class="text-center">Detalles</q-th>
            <q-th auto-width class="text-left">Acciones</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-weight-bold"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Filas de datos -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="isExpanded(props.row.id) ? 'bg-amber-1' : ''"
          >
            <!-- Botón Desplegar Detalles -->
            <q-td auto-width class="text-center">
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                :flat="!isExpanded(props.row.id)"
                :unelevated="isExpanded(props.row.id)"
                :icon="
                  isExpanded(props.row.id)
                    ? 'keyboard_arrow_up'
                    : 'keyboard_arrow_down'
                "
                @click="toggleRowExpand(props.row.id)"
              >
                <q-tooltip>
                  {{
                    isExpanded(props.row.id)
                      ? "Ocultar detalles y bitácora"
                      : "Ver detalles y bitácora"
                  }}
                </q-tooltip>
              </q-btn>
            </q-td>

            <!-- Acciones -->
            <q-td auto-width>
              <q-btn
                dense
                flat
                color="teal"
                icon="visibility"
                @click="openShow(props.row)"
              >
                <q-tooltip>Ver detalle y autorización</q-tooltip>
              </q-btn>
              <q-btn
                dense
                flat
                color="blue"
                icon="edit_square"
                @click="openEdit(props.row)"
                :disable="!canEdit(props.row)"
              >
                <q-tooltip>Editar solicitud</q-tooltip>
              </q-btn>
              <!-- marcar como dispersada -->
              <q-btn
                v-if="canMarcarDispersada(props.row)"
                dense
                flat
                color="deep-orange"
                icon="local_gas_station"
                @click="marcarDispersada(props.row)"
              >
                <q-tooltip>Marcar como dispersada</q-tooltip>
              </q-btn>
            </q-td>

            <!-- Folio / Prioridad -->
            <q-td key="folio" :props="props">
              <div class="row items-center no-wrap q-gutter-x-xs">
                <span class="text-weight-bold text-dark">
                  #{{ props.row.id }}
                </span>
                <q-badge
                  v-if="props.row.is_urgente"
                  color="negative"
                  class="text-weight-bold q-px-xs"
                >
                  <q-icon name="priority_high" size="12px" />
                  Urgente
                </q-badge>
              </div>
            </q-td>

            <!-- Fecha -->
            <q-td key="fecha" :props="props" class="text-weight-bold">
              {{ formatFecha(props.row.created_at) }}
            </q-td>

            <!-- Estatus de la Solicitud -->
            <q-td key="estatus" :props="props" class="text-center">
              <q-badge
                v-if="getOrdenEstatus(props.row)"
                :style="
                  getOrdenEstatus(props.row)?.color
                    ? { backgroundColor: getOrdenEstatus(props.row).color }
                    : null
                "
                :color="!getOrdenEstatus(props.row)?.color ? 'primary' : null"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                {{ getOrdenEstatus(props.row)?.nombre }}
              </q-badge>
              <span v-else class="text-caption text-grey-5">-</span>
            </q-td>

            <!-- Unidad / Placas -->
            <q-td key="unidad" :props="props">
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-badge color="primary" class="text-weight-bold q-px-sm py-xs">
                  {{ props.row.vehicle?.placas || "S/P" }}
                </q-badge>
                <span class="text-caption text-grey-8">
                  {{ props.row.vehicle?.estatus?.nombre || "" }}
                </span>
              </div>
              <div
                v-if="props.row.vehicle?.serie"
                class="text-caption text-grey-6 font-mono"
              >
                {{ props.row.vehicle.serie }}
              </div>
            </q-td>

            <!-- Litros Solicitados -->
            <q-td key="lts_solicitados" :props="props" class="text-center">
              <q-badge
                color="amber-10"
                text-color="white"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                <q-icon name="local_gas_station" size="14px" class="q-mr-xs" />
                {{ props.row.lts_solicitados ?? 0 }} L
              </q-badge>
            </q-td>

            <!-- Litros Dispersados / Autorizados -->
            <q-td key="lts_dispersados" :props="props" class="text-center">
              <q-badge
                v-if="
                  props.row.lts_dispersados !== null &&
                  props.row.lts_dispersados !== undefined
                "
                color="positive"
                text-color="white"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                <q-icon name="check_circle" size="14px" class="q-mr-xs" />
                {{ props.row.lts_dispersados }} L
              </q-badge>
              <span v-else class="text-caption text-grey-5">Pendiente</span>
            </q-td>

            <!-- KM Carga / Evento -->
            <q-td key="km" :props="props" class="text-right">
              <span
                v-if="props.row.km_evento"
                class="text-weight-bold text-orange-10"
              >
                {{ formatKm(props.row.km_evento) }}
              </span>
              <span v-else class="text-caption text-grey-5">No reg.</span>
            </q-td>

            <!-- Cargo (Sucursal / Depto) -->
            <q-td key="cargo" :props="props">
              <div class="text-caption text-weight-medium">
                {{
                  props.row.sucursal_cargo?.nombre ||
                  props.row.sucursalCargo?.nombre ||
                  "-"
                }}
              </div>
              <div class="text-caption text-grey-6">
                {{
                  props.row.departamento_cargo?.nombre ||
                  props.row.departamentoCargo?.nombre ||
                  ""
                }}
              </div>
            </q-td>

            <!-- Solicitante -->
            <q-td key="solicitante" :props="props">
              <div class="text-caption text-weight-medium">
                {{ props.row.solicitante?.nombreCompleto || "-" }}
              </div>
            </q-td>
          </q-tr>

          <!-- Fila Desplegable: Detalles de Dispersión y Bitácora -->
          <q-tr
            v-show="isExpanded(props.row.id)"
            :props="props"
            class="bg-grey-1"
          >
            <q-td colspan="100%" class="q-pa-sm">
              <div class="q-mx-md q-gutter-y-sm">
                <!-- Desplegable 1: Información de la Dispersión -->
                <q-card flat bordered class="bg-white">
                  <q-expansion-item
                    default-opened
                    header-class="bg-amber-1 text-grey-9"
                    expand-icon-class="text-primary"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon
                          name="local_gas_station"
                          color="amber-9"
                          size="22px"
                        />
                      </q-item-section>
                      <q-item-section>
                        <div
                          class="text-caption text-weight-bold text-grey-9 flex items-center"
                        >
                          Dispersión de Combustible - Solicitud #{{
                            props.row.id
                          }}
                          (Placa: {{ props.row.vehicle?.placas || "S/P" }})
                          <q-badge
                            v-if="props.row.is_urgente"
                            color="negative"
                            class="q-ml-sm"
                          >
                            URGENTE
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-caption text-grey-8">
                          Solicitados:
                          <strong class="text-amber-10"
                            >{{ props.row.lts_solicitados ?? 0 }} L</strong
                          >
                          &bull; Autorizados/Dispersados:
                          <strong class="text-positive">
                            {{
                              props.row.lts_dispersados !== null &&
                              props.row.lts_dispersados !== undefined
                                ? `${props.row.lts_dispersados} L`
                                : "Pendiente"
                            }}
                          </strong>
                        </div>
                      </q-item-section>
                    </template>

                    <q-separator />
                    <q-markup-table flat dense separator="horizontal">
                      <thead>
                        <tr class="bg-grey-2 text-grey-8">
                          <th class="text-left">Concepto</th>
                          <th class="text-left">Notas / Observaciones</th>
                          <th class="text-right">Kilometraje (KM)</th>
                          <th class="text-center">Litros Solicitados</th>
                          <th class="text-center">Litros Dispersados</th>
                          <th class="text-center">Prioridad</th>
                          <th class="text-left">Registrado Por</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-weight-bold text-primary">
                            Dispersión de gasolina
                          </td>
                          <td style="max-width: 360px; white-space: normal">
                            {{ props.row.notas || "-" }}
                          </td>
                          <td class="text-right text-weight-medium">
                            {{
                              props.row.km_evento
                                ? formatKm(props.row.km_evento)
                                : "No reg."
                            }}
                          </td>
                          <td class="text-center font-mono text-weight-bold">
                            {{ props.row.lts_solicitados ?? 0 }} L
                          </td>
                          <td
                            class="text-center font-mono text-weight-bold text-positive"
                          >
                            {{
                              props.row.lts_dispersados !== null &&
                              props.row.lts_dispersados !== undefined
                                ? `${props.row.lts_dispersados} L`
                                : "Pendiente"
                            }}
                          </td>
                          <td class="text-center">
                            <q-badge
                              :color="
                                props.row.is_urgente ? 'negative' : 'blue-grey'
                              "
                            >
                              {{ props.row.is_urgente ? "Urgente" : "Normal" }}
                            </q-badge>
                          </td>
                          <td>
                            {{
                              props.row.registrador?.empleado?.nombreCompleto ||
                              props.row.registrador?.name ||
                              "-"
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </q-expansion-item>
                </q-card>

                <!-- Desplegable 2: Bitácora de Acciones y Movimientos -->
                <q-card flat bordered class="bg-white">
                  <q-expansion-item
                    default-opened
                    header-class="bg-blue-grey-1 text-blue-grey-9"
                    expand-icon-class="text-blue-grey-9"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon name="history" color="blue-8" size="20px" />
                      </q-item-section>
                      <q-item-section>
                        <div
                          class="text-caption text-weight-bold text-blue-grey-9 flex items-center"
                        >
                          Bitácora de Movimientos
                          <q-badge color="blue-8" class="q-ml-sm">
                            {{ getBitacora(props.row).length }}
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div
                          v-if="getBitacora(props.row).length > 0"
                          class="text-caption text-grey-7"
                        >
                          Último estatus:
                          <span class="text-weight-bold">{{
                            getBitacora(props.row)[0]?.estatus?.nombre ||
                            "Registrado"
                          }}</span>
                        </div>
                      </q-item-section>
                    </template>

                    <q-separator />

                    <div
                      v-if="getBitacora(props.row).length === 0"
                      class="q-pa-sm text-center text-caption text-grey-6"
                    >
                      No hay registros de bitácora para esta solicitud de
                      gasolina.
                    </div>
                    <q-markup-table v-else flat dense separator="horizontal">
                      <thead>
                        <tr class="bg-grey-2 text-grey-8">
                          <th class="text-left" style="width: 175px">
                            Fecha y Hora
                          </th>
                          <th class="text-left" style="width: 140px">
                            Estatus
                          </th>
                          <th class="text-left" style="width: 250px">
                            Usuario / Empleado
                          </th>
                          <th class="text-left">Comentarios</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="b in getBitacora(props.row)" :key="b.id">
                          <td class="text-caption font-mono">
                            <q-icon
                              name="schedule"
                              size="14px"
                              class="q-mr-xs text-grey-7"
                            />
                            {{ formatFechaHora(b.created_at) }}
                          </td>
                          <td>
                            <q-badge
                              :style="
                                b.estatus?.color
                                  ? { backgroundColor: b.estatus.color }
                                  : null
                              "
                              :color="!b.estatus?.color ? 'primary' : null"
                              class="q-px-sm"
                            >
                              {{ b.estatus?.nombre || "Sin estatus" }}
                            </q-badge>
                          </td>
                          <td>
                            <div
                              class="text-weight-medium text-dark flex items-center"
                            >
                              <q-icon
                                :name="b.user?.empleado ? 'badge' : 'person'"
                                size="16px"
                                class="q-mr-xs text-grey-7"
                              />
                              <span>{{ getUsuarioNombre(b) }}</span>
                            </div>
                            <div
                              v-if="b.user?.empleado && b.user?.name"
                              class="text-caption text-grey-6 q-ml-md"
                            >
                              Usuario: {{ b.user.name }}
                            </div>
                          </td>
                          <td style="white-space: normal">
                            {{ b.comentarios || b.notas || "-" }}
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </q-expansion-item>
                </q-card>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Bottom Pagination slot -->
        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <!-- Modal: Registrar Nueva Solicitud de Gasolina -->
  <q-dialog v-model="showAdd" persistent>
    <q-card style="width: 960px; max-width: 96vw">
      <q-item class="bg-primary text-white">
        <q-item-section avatar>
          <q-icon name="local_gas_station" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            Registrar Solicitud de Dispersión de Gasolina
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-sm">
            <q-btn flat label="Cancelar" color="white" v-close-popup />
            <q-btn
              unelevated
              :label="onlyMyUnit ? 'Enviar Solicitud' : 'Guardar Solicitud'"
              color="positive"
              icon="save"
              :loading="saving"
              @click="postRow"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="scroll" style="max-height: 80vh">
        <gasolina-form
          v-if="showAdd"
          ref="add"
          :catalogs="catalogs"
          :fixed-vehicle-id="
            onlyMyUnit && assignedVehicles.length === 1
              ? assignedVehicles[0]?.id
              : null
          "
          :allowed-vehicles="onlyMyUnit ? assignedVehicles : null"
          :default-solicitante-id="
            onlyMyUnit ? authStore.authUser?.empleado?.id : null
          "
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal: Editar Solicitud de Gasolina -->
  <q-dialog v-model="showEdit" persistent>
    <q-card style="width: 960px; max-width: 96vw">
      <q-item class="bg-primary text-white">
        <q-item-section avatar>
          <q-icon name="edit_square" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            Editar Solicitud de Gasolina #{{ selectedRow?.id }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-sm">
            <q-btn flat label="Cancelar" color="white" v-close-popup />
            <q-btn
              unelevated
              label="Actualizar"
              color="positive"
              icon="save"
              :loading="saving"
              @click="putRow"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="scroll" style="max-height: 80vh">
        <gasolina-form
          v-if="showEdit"
          ref="edit"
          :orden="selectedRow"
          :catalogs="catalogs"
          :fixed-vehicle-id="
            onlyMyUnit && assignedVehicles.length === 1
              ? assignedVehicles[0]?.id
              : null
          "
          :allowed-vehicles="onlyMyUnit ? assignedVehicles : null"
          :default-solicitante-id="
            onlyMyUnit ? authStore.authUser?.empleado?.id : null
          "
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal: Ver Detalle y Autorización de Solicitud de Gasolina -->
  <q-dialog v-model="showShow">
    <q-card
      style="width: 1200px; max-width: 96vw; max-height: 92vh"
      class="scroll"
    >
      <service-card
        :service="selectedRow"
        :auth-endpoint="'/api/gasolina/autorizar'"
        only-gasolina
        @authorized="handleOrderAuthorized"
      />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modal: Confirmar Eliminación -->
  <BaseDialog v-model="showDelete" mode="delete" @submit="deleteRow">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar esta solicitud de gasolina (#{{
        selectedRow?.id
      }})?
    </template>
  </BaseDialog>

  <!-- Modal: Confirmar Dispersión -->
  <q-dialog v-model="showDispersar" persistent>
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none bg-primary text-white">
        <q-avatar icon="local_gas_station" color="white" text-color="primary" />
        <span class="q-ml-sm text-h6">Confirmar Dispersión</span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md text-body1">
        ¿Estás seguro que deseas marcar la solicitud de gasolina
        <strong>#{{ selectedRow?.id }}</strong>
        ({{
          selectedRow?.lts_dispersados ?? selectedRow?.lts_solicitados ?? 0
        }}
        Lts) como <strong>DISPERSADA</strong>?
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
        <q-btn
          unelevated
          label="Marcar Dispersada"
          color="positive"
          icon="check"
          :loading="savingDispersar"
          @click="submitDispersar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { date } from "quasar";
import { useAuthStore } from "src/stores/auth";
import {
  sendRequest,
  dataIncomplete,
  checkRole,
  checkPuestoIncludes,
} from "src/boot/functions";

import BaseDialog from "src/bases/BaseDialog.vue";
import ServiceCard from "src/components/CoordinacionCompras/ServiceCard.vue";
import GasolinaForm from "src/components/CoordinacionCompras/GasolinaForm.vue";

const props = defineProps({
  onlyMyUnit: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const authStore = useAuthStore();

const onlyMyUnit = computed(() => {
  return (
    props.onlyMyUnit ||
    route.path === "/gasolinaUnidad" ||
    route.path === "/dispersionGasolina"
  );
});

const assignedVehicle = ref(null);
const assignedVehicles = ref([]);

const rows = ref([]);
const loading = ref(false);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const saving = ref(false);
const showDelete = ref(false);
const showShow = ref(false);
const showDispersar = ref(false);
const savingDispersar = ref(false);

const expandedIds = ref([]);
const allExpanded = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);
const totalRegistros = ref(0);

const catalogs = ref({
  next_id: null,
  vehicles: [],
  empleados: [],
  sucursales_cargo: [],
  deptos_cargo: [],
  estatus: [],
});

const filteredVehicles = ref([]);

const filterForm = ref({
  search: null,
  vehicle_id: null,
  suc_cargo_id: null,
  depto_cargo_id: null,
  estatus_id: null,
});

const statusCounts = ref({
  solicitado: 0,
  por_dispersar: 0,
  dispersado: 0,
  no_autorizado: 0,
  solicitado_id: null,
  por_dispersar_id: null,
  dispersado_id: null,
  no_autorizado_id: null,
});

const estatusSolicitadoId = computed(() => {
  return (
    statusCounts.value?.solicitado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "solicitado"
    )?.id ||
    null
  );
});

const estatusPorDispersarId = computed(() => {
  return (
    statusCounts.value?.por_dispersar_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "por dispersar"
    )?.id ||
    null
  );
});

const estatusDispersadoId = computed(() => {
  return (
    statusCounts.value?.dispersado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "dispersada"
    )?.id ||
    null
  );
});

const estatusNoAutorizadoId = computed(() => {
  return (
    statusCounts.value?.no_autorizado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "no autorizado"
    )?.id ||
    null
  );
});

const countPorRevisar = computed(() => {
  if (
    statusCounts.value &&
    statusCounts.value.solicitado !== undefined &&
    statusCounts.value.solicitado !== null
  ) {
    return Number(statusCounts.value.solicitado);
  }
  return rows.value.filter(
    (r) =>
      Number(r.estatus_id) === Number(estatusSolicitadoId.value) ||
      (r.estatus?.nombre || "").trim().toLowerCase() === "solicitado"
  ).length;
});

const countPorDispersar = computed(() => {
  if (
    statusCounts.value &&
    statusCounts.value.por_dispersar !== undefined &&
    statusCounts.value.por_dispersar !== null
  ) {
    return Number(statusCounts.value.por_dispersar);
  }
  return rows.value.filter(
    (r) =>
      Number(r.estatus_id) === Number(estatusPorDispersarId.value) ||
      (r.estatus?.nombre || "").trim().toLowerCase() === "por dispersar"
  ).length;
});

const isEstatusActive = (estatusId) => {
  return (
    estatusId !== null &&
    estatusId !== undefined &&
    filterForm.value.estatus_id !== null &&
    filterForm.value.estatus_id !== undefined &&
    Number(filterForm.value.estatus_id) === Number(estatusId)
  );
};

const filterByStatus = (estatusId) => {
  if (!estatusId) return;
  if (isEstatusActive(estatusId)) {
    filterForm.value.estatus_id = null;
  } else {
    filterForm.value.estatus_id = estatusId;
  }
  getRows(1);
};

const clearStatusFilter = () => {
  filterForm.value.estatus_id = null;
  getRows(1);
};

const hasActiveFilters = computed(() => {
  return Boolean(
    filterForm.value.search ||
      filterForm.value.vehicle_id ||
      filterForm.value.suc_cargo_id ||
      filterForm.value.depto_cargo_id ||
      filterForm.value.estatus_id
  );
});

const toggleUnitFilter = (vehicleId) => {
  if (assignedVehicles.value.length <= 1) return;
  if (Number(filterForm.value.vehicle_id) === Number(vehicleId)) {
    filterForm.value.vehicle_id = null;
  } else {
    filterForm.value.vehicle_id = vehicleId;
  }
  getRows(1);
};

const clearFilters = () => {
  filterForm.value = {
    search: null,
    vehicle_id: null,
    suc_cargo_id: null,
    depto_cargo_id: null,
    estatus_id: null,
  };
  getRows(1);
};

const columns = [
  {
    name: "folio",
    align: "left",
    field: "id",
    label: "Folio",
    sortable: true,
  },
  {
    name: "fecha",
    align: "left",
    field: "created_at",
    label: "Fecha",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    field: "estatus",
    label: "Estatus",
  },
  {
    name: "unidad",
    align: "left",
    field: "unidad",
    label: "Unidad / Placas",
  },
  {
    name: "lts_solicitados",
    align: "center",
    field: "lts_solicitados",
    label: "Lts. Solicitados",
  },
  {
    name: "lts_dispersados",
    align: "center",
    field: "lts_dispersados",
    label: "Lts. Dispersados",
  },
  {
    name: "km",
    align: "right",
    field: "km_evento",
    label: "KM Carga",
  },
  {
    name: "cargo",
    align: "left",
    field: "cargo",
    label: "Sucursal / Depto Cargo",
  },
  {
    name: "solicitante",
    align: "left",
    field: "solicitante",
    label: "Solicitante",
  },
];

const canEdit = (row) => {
  const isAdmin = checkRole("Admin");
  const isCoordinadorCompras = checkPuestoIncludes("Coordinador de compras");
  const isDirectorAdmin = checkRole("Director administrativo");
  const estatus = getOrdenEstatus(row)?.nombre;
  return (
    isAdmin ||
    (isCoordinadorCompras && estatus !== "Solicitado") ||
    isDirectorAdmin ||
    estatus === "Solicitado"
  );
};

const canMarcarDispersada = (row) => {
  const estatus = (getOrdenEstatus(row)?.nombre || "").trim().toLowerCase();
  const isCoordinadorCompras = checkPuestoIncludes("Coordinador de compras");
  return estatus === "por dispersar" && isCoordinadorCompras;
};

const getOrdenEstatus = (row) => {
  if (row?.estatus) return row.estatus;
  const bitacora = getBitacora(row);
  if (bitacora.length > 0 && bitacora[0]?.estatus) {
    return bitacora[0].estatus;
  }
  return null;
};

const getBitacora = (row) => {
  const list = row?.bitacora || [];
  return [...list].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
};

const getUsuarioNombre = (item) => {
  const empleado = item?.user?.empleado;
  if (empleado) {
    if (empleado.nombreCompleto) return empleado.nombreCompleto;
    const partes = [
      empleado.nombre,
      empleado.segundo_nombre,
      empleado.apellido_paterno,
      empleado.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
    if (partes.trim()) return partes;
  }
  return item?.user?.name || "Sin usuario";
};

const formatFechaHora = (fechaStr) => {
  if (!fechaStr) return "-";
  return date.formatDate(fechaStr, "DD/MM/YYYY hh:mm A");
};

const isExpanded = (id) => {
  return expandedIds.value.includes(id);
};

const toggleRowExpand = (id) => {
  const idx = expandedIds.value.indexOf(id);
  if (idx > -1) {
    expandedIds.value.splice(idx, 1);
  } else {
    expandedIds.value.push(id);
  }
};

const toggleExpandAll = () => {
  if (allExpanded.value) {
    expandedIds.value = [];
    allExpanded.value = false;
  } else {
    expandedIds.value = rows.value.map((r) => r.id);
    allExpanded.value = true;
  }
};

const filterVehiclesFn = (val, update) => {
  const baseList = onlyMyUnit.value
    ? assignedVehicles.value
    : catalogs.value.vehicles || [];
  if (val === "") {
    update(() => {
      filteredVehicles.value = baseList;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredVehicles.value = baseList.filter(
      (v) =>
        (v.placas && v.placas.toLowerCase().includes(q)) ||
        (v.serie && v.serie.toLowerCase().includes(q)) ||
        (v.estatus?.nombre && v.estatus.nombre.toLowerCase().includes(q))
    );
  });
};

const openCreate = () => {
  selectedRow.value = null;
  getForms();
  showAdd.value = true;
};

const openEdit = (item) => {
  selectedRow.value = item;
  getForms();
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedRow.value = item;
  showDelete.value = true;
};

const openShow = (item) => {
  selectedRow.value = item;
  showShow.value = true;
};

const marcarDispersada = (item) => {
  selectedRow.value = item;
  showDispersar.value = true;
};

const submitDispersar = async () => {
  if (!selectedRow.value?.id) return;
  savingDispersar.value = true;
  try {
    const res = await sendRequest(
      "POST",
      null,
      `/api/gasolina/${selectedRow.value.id}/dispersada`
    );
    if (res) {
      showDispersar.value = false;
      getRows(current_page.value);
      getForms();
    }
  } catch (err) {
    console.error("Error al marcar como dispersada:", err);
  } finally {
    savingDispersar.value = false;
  }
};

const handleOrderAuthorized = (updatedOrden) => {
  if (updatedOrden && typeof updatedOrden === "object") {
    selectedRow.value = updatedOrden;
  }
  showShow.value = false;
  getRows(current_page.value);
  getForms();
};

const getForms = async () => {
  const res = await sendRequest("GET", null, "/api/gasolina/forms", "");
  if (res) {
    catalogs.value = {
      next_id: res.next_id || null,
      vehicles: res.vehicles || [],
      empleados: res.empleados || [],
      sucursales_cargo: res.sucursales_cargo || [],
      deptos_cargo: res.deptos_cargo || [],
      estatus: res.estatus || [],
    };
    if (res.status_counts) {
      statusCounts.value = {
        ...statusCounts.value,
        ...res.status_counts,
      };
    }
    filteredVehicles.value = onlyMyUnit.value
      ? assignedVehicles.value
      : catalogs.value.vehicles;
  }
};

const getRows = async (page = 1) => {
  loading.value = true;
  try {
    const final = {
      ...filterForm.value,
      page,
    };
    const endpoint = onlyMyUnit.value
      ? "/api/gasolinas/auth"
      : "/api/gasolinas";
    const res = await sendRequest("POST", final, endpoint, "");
    if (res) {
      rows.value = res.data || [];
      current_page.value = res.current_page || 1;
      next_page_url.value = res.next_page_url;
      prev_page_url.value = res.prev_page_url;
      last_page.value = res.last_page || 1;
      totalRegistros.value = res.total || rows.value.length;
      if (res.status_counts) {
        statusCounts.value = {
          ...statusCounts.value,
          ...res.status_counts,
        };
      }
      if (onlyMyUnit.value) {
        if (Array.isArray(res.assigned_vehicles)) {
          assignedVehicles.value = res.assigned_vehicles;
        } else if (res.assigned_vehicle) {
          assignedVehicles.value = [res.assigned_vehicle];
        } else {
          assignedVehicles.value = [];
        }
        assignedVehicle.value = assignedVehicles.value[0] || null;
      }
    }
  } finally {
    loading.value = false;
  }
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  saving.value = true;
  try {
    const final = add.value.formGasolina;
    const res = await sendRequest("POST", final, "/api/gasolina", "");
    if (res) {
      showAdd.value = false;
      getRows(current_page.value);
      getForms();
    }
  } finally {
    saving.value = false;
  }
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  saving.value = true;
  try {
    const final = edit.value.formGasolina;
    const res = await sendRequest(
      "PUT",
      final,
      "/api/gasolina/" + selectedRow.value.id,
      ""
    );
    if (res) {
      showEdit.value = false;
      getRows(current_page.value);
      getForms();
    }
  } finally {
    saving.value = false;
  }
};

const deleteRow = async () => {
  await sendRequest(
    "DELETE",
    null,
    "/api/gasolina/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows(current_page.value);
  getForms();
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "N/A";
  const num = Number(val);
  if (isNaN(num)) return val;
  return `${num.toLocaleString("es-MX")} km`;
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

watch(
  () => route.path,
  () => {
    clearFilters();
  }
);

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    getRows(1);
  }, 600);
};

onMounted(() => {
  getRows();
  getForms();
});
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.border-primary {
  border: 1px solid var(--q-primary);
}
</style>
