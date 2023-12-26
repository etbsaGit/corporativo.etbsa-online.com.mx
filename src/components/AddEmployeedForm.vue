<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-y-sm text-uppercase"
  >
    <q-file
      v-model="photo"
      filled
      outlined
      bottom-slots
      label="Foto Empleado"
      counter
      hint="Seleccionar Foto"
      class="col-12"
    >
      <template v-slot:before>
        <q-avatar size="64px">
          <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
        </q-avatar>
      </template>

      <template v-slot:append>
        <q-icon
          v-if="photo !== null"
          name="close"
          @click.stop.prevent="photo = null"
          class="cursor-pointer"
        />
        <q-icon name="create_new_folder" @click.stop.prevent />
      </template>
    </q-file>

    <q-input
      v-model="form.first_name"
      filled
      dense
      label="Primer Nombre"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      v-model="form.second_name"
      filled
      dense
      label="Segundo Nombre"
      hint="(opcional)"
    />
    <q-input
      v-model="form.last_name"
      filled
      dense
      label="Apellido Paterno"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      v-model="form.mothers_last_name"
      filled
      dense
      label="Apellido Materno"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      v-model="form.phone"
      filled
      dense
      label="Telefono"
      mask="(###) ### - ####"
      fill-mask
      hint="Mask: (###) ### - ####"
    />

    <q-input
      v-model="form.address"
      filled
      dense
      label="Domicilio"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      v-model="form.zipcode"
      filled
      dense
      label="Codigo Postal"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      dense
      label="Colonia"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      dense
      label="Ciudad/Municipio"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <!-- <div class="q-gutter-md row items-start">
      <q-input
        dense
        v-model="password"
        filled
        type="password"
        hint="Password"
      />

      <q-input
        dense
        v-model="password"
        filled
        :type="isPwd ? 'password' : 'text'"
        hint="Password with toggle"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-input v-model="email" filled type="email" hint="Email" />

      <q-input v-model="search" filled type="search" hint="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-input v-model="tel" filled type="tel" hint="Telephone number" />

      <q-input v-model="url" filled type="url" hint="URL" />

      <q-input v-model="time" filled type="time" hint="Native time" />

      <q-input v-model="date" filled type="date" hint="Native date" />
    </div> -->
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const form = ref({
      first_name: null,
      second_name: null,
      last_name: null,
      mothers_last_name: null,
      phone: null,
      address: null,
      zipcode: null,
      town: null
    });

    const name = ref(null);
    const age = ref(null);
    const phone = ref(null);
    const accept = ref(false);
    const photo = ref(null);

    function checkFileSize(files) {
      return files.filter((file) => file.size < 2048);
    }

    function checkFileType(files) {
      return files.filter((file) => file.type === "image/png");
    }

    function onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      $q.notify({
        type: "negative",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      });
    }

    return {
      form,
      password: ref(""),
      isPwd: ref(true),
      email: ref(""),
      search: ref(""),
      tel: ref(""),
      url: ref(""),
      time: ref(""),
      date: ref(""),

      photo,
      phone,
      name,
      age,
      accept,
      checkFileSize,
      checkFileType,
      onRejected,

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first"
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted"
          });
        }
      },

      onReset() {
        name.value = null;
        age.value = null;
        accept.value = false;
      }
    };
  }
};
</script>
