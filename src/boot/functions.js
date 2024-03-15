// import Swal from 'sweetalert2';
// import { nextTick } from '@vue/runtime-core';
import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { Loading, QSpinnerGears, Notify } from "quasar";

export function show_notify(msj, icon, color, focus) {
  if (focus !== "") {
    nextTick(() => focus.value.focus());
  }
  Notify.create({
    message: msj,
    icon: icon,
    color: color,
  });
}

const sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

// export function confirmation(name,url,redirect){
//     const alert = Swal.mixin({buttonsStyling:true});
//     alert.fire({
//         title:'Are you sure delete '+name+' ?',
//         icon:'question',showCancelButton:true,
//         confirmButtonText:'<i class="fa-solid fa-check"></i> Yes, delete',
//         cancelButtonText:'<i class="fa-solid fa-ban"></i> Cancel'
//     }).then( (result) =>{
//         if(result.isConfirmed){
//             sendRequest('DELETE',{},url,redirect);
//         }
//     });

export async function sendRequest(method, params, url, redirect = "") {
  const authStore = useAuthStore();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authStore.authToken}`;
  //axios.defaults.headers.common["Content-Type"] = "multipart/form-data"
  try {
    Loading.show({
      spinner: QSpinnerGears,
    });
    const response = await axios({ method: method, url: url, data: params });
    const data = response.data;
    if (method == "POST" || method == "PUT") {
      show_notify("Registro cargado", "publish", "blue", "");
    }
    if (method == "GET") {
      show_notify("Informacion cargada del servidor", "download", "green", "");
    }
    if (method == "DELETE") {
      show_notify("Registro borrado", "delete", "orange", "");
    }
    if (!!redirect) {
      await sleep(2000);
      window.location.href = redirect;
    }
    Loading.hide();
    return data;
  } catch (err) {
    Loading.hide();
    const errorMessage = err.response.data;
    if (typeof errorMessage === "object" && errorMessage !== null) {
      let errorMessages = [];
      for (const key in errorMessage) {
        if (Object.hasOwnProperty.call(errorMessage, key)) {
          const error = errorMessage[key];
          errorMessages.push(`Error en ${key}: ${error}`);
        }
      }
      show_notify(errorMessages.join("\n"), "error", "red", "");
    } else {
      show_notify("Error desconocido: " + errorMessage, "check", "red", "");
    }
    throw err;
  }
}

// export function tieneRolAdmin(usuario) {
//   if (usuario && Array.isArray(usuario.roles)) {
//     for (const rol of usuario.roles) {
//       if (rol.name.includes('Admin')) {
//         return true;
//       }
//     }
//   }
//   return false;
// }

export function getNamesRoles(usuario) {
  const nameRoles = [];
  if (usuario && Array.isArray(usuario.roles)) {
    for (const role of usuario.roles) {
      nameRoles.push(role.name);
    }
  }
  return nameRoles;
}

export function checkRole(role) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.roles.some((usuarioRol) => usuarioRol.name === role);
}

export function getNamesPermissions(usuario) {
  const namePermissions = [];
  if (usuario && Array.isArray(usuario.permissions)) {
    for (const permission of usuario.permissions) {
      namePermissions.push(permission.name);
    }
  }
  return namePermissions;
}
