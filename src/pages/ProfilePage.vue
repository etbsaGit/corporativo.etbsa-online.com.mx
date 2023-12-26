<template>
  <div class="row q-pa-md q-gutter-sm">
    <div class="col-3">
      <q-card class="my-card" style="min-height: 400px">
        <!-- <img src="https://cdn.quasar.dev/img/parallax2.jpg" /> -->

        <q-img
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 200px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">Razvan Stoenescu</div>
            <div>@rstoenescu</div>
          </div>
        </q-img>
        <q-list>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="primary" name="event" />
            </q-item-section>

            <q-item-section>
              <q-item-label>01/01/1999</q-item-label>
              <q-item-label caption>Fecha Ingreso</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="red" name="store" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Celaya</q-item-label>
              <q-item-label caption>Sucursal</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="amber" name="work" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Gerente</q-item-label>
              <q-item-label caption>Puesto</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <div class="col">
      <q-card style="min-height: 400px">
        <q-splitter v-model="splitterModel" style="min-height: 400px">
          <template v-slot:before>
            <q-tabs v-model="info" vertical class="text-teal">
              <q-tab name="mails" icon="contact_emergency" label="Contactos" />
              <q-tab
                name="alarms"
                icon="home_repair_service"
                label="Asignaciones"
              />
              <q-tab name="movies" icon="folder" label="Expediente" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="info"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="mails">
                <div class="row text-h4 q-mb-md">
                  Contactos
                  <q-space />
                  <q-btn
                    label="Agregar"
                    color="secondary"
                    icon-right="add"
                  ></q-btn>
                </div>
                <div>
                  <q-list bordered>
                    <q-item
                      v-for="contact in contacts"
                      :key="contact.id"
                      class="q-my-sm"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                          {{ contact.letter }}
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ contact.name }}</q-item-label>
                        <q-item-label caption lines="1">{{
                          contact.email
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="chat_bubble" color="green" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-tab-panel>

              <q-tab-panel name="alarms">
                <div class="text-h4 q-mb-md">Asignaciones</div>
                <div class="q-py-md q-gutter-md">
                  <q-list bordered>
                    <!-- <q-item-label header>Requisito</q-item-label> -->

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="assignment"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">Computadora</q-item-label>
                        <q-item-label caption>March 2nd, 2019</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" />
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="place"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">Herramientas</q-item-label>
                        <q-item-label caption>February 22, 2019</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" color="amber" />
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="library_music"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">Telefono</q-item-label>
                        <q-item-label caption>Singing it all day</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-tab-panel>

              <q-tab-panel name="movies">
                <div class="text-h4 q-mb-md">Expediente (Archivos)</div>
                <div class="q-py-md q-gutter-md">
                  <q-list bordered>
                    <!-- <q-item-label header>Requisito</q-item-label> -->

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="assignment"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">INE</q-item-label>
                        <q-item-label caption>March 2nd, 2019</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" />
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="place"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">
                          Contancia Situacon Fiscal
                        </q-item-label>
                        <q-item-label caption>February 22, 2019</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" color="amber" />
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                      <q-item-section avatar top>
                        <q-avatar
                          icon="library_music"
                          color="grey"
                          text-color="white"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label lines="1">Contrato</q-item-label>
                        <q-item-label caption>Singing it all day</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="info" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

const contacts = [
  {
    id: 1,
    name: "Ruddy Jedrzej",
    email: "rjedrzej0@discuz.net",
    letter: "R"
  },
  {
    id: 2,
    name: "Mallorie Alessandrini",
    email: "malessandrini1@marketwatch.com",
    letter: "M"
  },
  {
    id: 3,
    name: "Elisabetta Wicklen",
    email: "ewicklen2@microsoft.com",
    letter: "E"
  },
  {
    id: 4,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  }
];
export default {
  setup() {
    return {
      contacts,
      tab: ref("one"),
      info: ref("mails"),
      splitterModel: ref(20)
    };
  }
};
</script>
<style></style>
