// import Swal from 'sweetalert2';
// import { nextTick } from '@vue/runtime-core';
import axios from "axios";
import { Notify } from "quasar";
import { useAuthStore } from "src/stores/auth";

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

// }
export async function sendRequest(method, params, url, redirect = "") {
  const authStore = useAuthStore();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authStore.authToken}`;
  let res;
  await axios({ method: method, url: url, data: params })
    .then(({ data }) => {
      res = data;
      // Notify.create(data.message);
      show_notify(data.message, "check", "green", "");
      setTimeout(
        () => (redirect !== "" ? (window.location.href = redirect) : ""),
        2000
      );
    })
    .catch((errors) => {
      let desc = "";
      res = errors.response.data;
      // errors.response.data.errors.map((e) => {
      //   desc = desc + " " + e;
      // });
      // Notify.create({ color: "negative", message: desc });
      // // show_alerta(desc, "error","red", "");
    });
  return res;
}
