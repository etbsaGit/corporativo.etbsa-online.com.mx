<template>
  <div class="q-pa-md">
    <div v-for="(qualification, index) in qualifications" :key="index">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>{{ qualification.technician.name }}</q-toolbar-title>
        <q-btn
          color="green"
          dense
          icon="add"
          @click="activateInput(index)"
        ></q-btn>
      </q-toolbar>
      <q-list bordered>
        <q-item v-for="quali in qualification.qualification" :key="quali.id">
          <q-item-section>
            <template v-if="quali.id !== editIndex">
              <q-item-label>{{ quali.name }}</q-item-label>
            </template>
            <template v-else>
              <q-input
                v-model="qualificationForm.name"
                filled
                dense
                label="Titulo"
                lazy-rules
              />
            </template>
          </q-item-section>
          <q-item-section side>
            <template v-if="quali.id !== editIndex">
              <q-btn
                icon="edit"
                color="blue"
                dense
                @click="editQualification(quali)"
              ></q-btn>
            </template>
            <template v-else>
              <q-btn
                icon="save"
                color="amber"
                dense
                @click="putQualification(quali.id)"
              ></q-btn>
            </template>
          </q-item-section>
          <q-item-section side>
            <q-btn
              icon="delete"
              color="red"
              dense
              @click="deleteQualification(quali.id)"
            ></q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="addIndex === index">
          <q-item-section>
            <q-input
              v-model="qualificationForm.name"
              filled
              dense
              label="Titulo"
              lazy-rules
            >
              <template v-slot:after>
                <q-btn
                  label="Agregar"
                  icon="send"
                  dense
                  @click="addQualification(qualification)"
                ></q-btn>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";

const bus = inject("bus");

const { qualifications } = defineProps(["qualifications"]);

const addIndex = ref(null);
const editIndex = ref(null);

const qualificationForm = ref({
  name: null,
  linea_id: null,
  technician_id: null,
  linea_technician_id: null,
});

const deleteQualification = async (id) => {
  const res = await sendRequest("DELETE", null, "/api/qualification/" + id, "");
  bus.emit("edit_qualifications");
};

const activateInput = (index) => {
  editIndex.value = null;
  addIndex.value = index;
  qualificationForm.value.name = null;
};

const editQualification = (item) => {
  addIndex.value = null;
  editIndex.value = item.id;
  qualificationForm.value.name = item.name;
  qualificationForm.value.linea_technician_id = item.linea_technician_id;
};

const addQualification = async (item) => {
  qualificationForm.value.technician_id = item.technician_id;
  qualificationForm.value.linea_id = item.linea_id;
  const res = await sendRequest(
    "POST",
    qualificationForm.value,
    "/api/qualification",
    ""
  );
  bus.emit("edit_qualifications");
};

const putQualification = async (id) => {
  const res = await sendRequest(
    "PUT",
    qualificationForm.value,
    "/api/qualification/" + id,
    ""
  );
  bus.emit("edit_qualifications");
};
</script>
