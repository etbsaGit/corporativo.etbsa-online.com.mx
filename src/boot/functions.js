// import Swal from 'sweetalert2';
// import { nextTick } from '@vue/runtime-core';
import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { Loading, QSpinnerGears, Notify } from "quasar";
import { api } from "src/boot/axios";

export function show_notify(msj, icon, color, focus = "") {
  if (focus !== "") {
    nextTick(() => focus.value.focus());
  }
  Notify.create({
    message: msj,
    icon: icon,
    color: color,
    position: "bottom-right",
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

export function dataIncomplete() {
  Notify.create({
    color: "red-5",
    textColor: "white",
    icon: "warning",
    message: "Por favor completa todos los campos obligatorios",
  });
}

export function passwordError() {
  Notify.create({
    color: "red-5",
    textColor: "white",
    icon: "warning",
    message: "La contraseña y la confirmación de la contraseña no coinciden",
  });
}

// export async function sendRequest(method, params, url, redirect = "") {
//   const authStore = useAuthStore();
//   axios.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${authStore.authToken}`;
//   //axios.defaults.headers.common["Content-Type"] = "multipart/form-data"
//   try {
//     Loading.show({
//       spinner: QSpinnerGears,
//     });
//     const response = await axios({ method: method, url: url, data: params });
//     const data = response.data;
//     if (method == "POST" || method == "PUT") {
//       show_notify("Registro cargado", "publish", "blue", "");
//     }
//     if (method == "GET") {
//       show_notify("Informacion cargada del servidor", "download", "green", "");
//     }
//     if (method == "DELETE") {
//       show_notify("Registro borrado", "delete", "orange", "");
//     }
//     if (!!redirect) {
//       await sleep(2000);
//       window.location.href = redirect;
//     }
//     Loading.hide();
//     return data;
//   } catch (err) {
//     Loading.hide();
//     const errorMessage = err.response.data;
//     if (err.response.status === 401 || errorMessage === "Unauthorized") {
//       localStorage.clear();
//       location.reload();
//       await sleep(2000);
//     }
//     if (typeof errorMessage === "object" && errorMessage !== null) {
//       let errorMessages = [];
//       for (const key in errorMessage) {
//         if (Object.hasOwnProperty.call(errorMessage, key)) {
//           const error = errorMessage[key];
//           errorMessages.push(`Error en ${key}: ${error}`);
//         }
//       }
//       show_notify(errorMessages.join("\n"), "error", "red", "");
//     } else {
//       show_notify("Error desconocido: " + errorMessage, "check", "red", "");
//     }
//     throw err;
//   }
// }

export async function sendRequest(method, params, url) {
  try {
    // 🔄 Mostrar spinner
    Loading.show({
      spinner: QSpinnerGears,
    });

    const { data } = await api({
      method,
      url,
      data: params,
    });

    // ✅ Mensaje siempre desde backend
    if (data?.message) {
      show_notify(data.message, "check", "green", "");
    }

    return data?.data;
  } catch (err) {
    const res = err.response?.data;

    // ❌ Mensaje general
    if (res?.message) {
      show_notify(res.message, "error", "red", "");
    }

    // ❌ Errores de validación
    if (res?.errors) {
      const errors = Object.values(res.errors).flat().join("\n");

      show_notify(errors, "error", "red", "");
    }

    // 🔐 Sesión expirada
    if (err.response?.status === 401) {
      localStorage.clear();
      location.reload();
    }

    throw err;
  } finally {
    // 🔄 Ocultar spinner SIEMPRE
    Loading.hide();
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

export function checkRoleEmpleado() {
  const authStore = useAuthStore(); // Obtén el store de autenticación
  const usuario = authStore.authUser; // Usuario autenticado

  // Usa el método checkRole para validar el rol y verifica que empleado sea null
  return checkRole("Admin") && usuario.empleado === null;
}

export function checkLine(linea) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve true
    return true;
  }
  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.linea &&
    usuario.empleado.linea.nombre
  ) {
    return (
      usuario.empleado.linea.nombre === linea ||
      usuario.empleado.linea.nombre === "Combo"
    );
  }
  return false;
}

export function checkPuesto(puesto) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve true
    return false;
  }
  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.puesto &&
    usuario.empleado.puesto.nombre
  ) {
    return usuario.empleado.puesto.nombre === puesto;
  }
  return false;
}

export function checkSucursal(linea) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve true
    return true;
  }

  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.sucursal &&
    usuario.empleado.sucursal.nombre
  ) {
    return (
      usuario.empleado.sucursal.nombre === linea ||
      usuario.empleado.sucursal.nombre === "Corporativo"
    );
  }
  return false;
}

export function checkUserId(userId) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = usuario.roles.some((role) => role.name === "Admin");

  // Verificar si el usuario es administrador o si el id del empleado coincide con userId
  if (!usuario.empleado && isAdmin) {
    return true;
  }

  return usuario.empleado && usuario.empleado.id === userId;
}

export function checkId(userId) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = usuario.roles.some((role) => role.name === "Admin");

  // Verificar si el usuario es administrador o si el id del empleado coincide con userId
  if (!usuario.empleado && isAdmin) {
    return true;
  }

  return usuario.id === userId;
}

export function checkPermissions(permission) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.permissions.some(
    (usuarioPermission) => usuarioPermission.name === permission
  );
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

export function checkPuestoIncludes(puesto) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;

  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve false
    return true;
  }

  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.puesto &&
    usuario.empleado.puesto.nombre
  ) {
    // Devuelve true si el nombre del puesto incluye la palabra buscada
    return usuario.empleado.puesto.nombre
      .toLowerCase()
      .includes(puesto.toLowerCase());
  }

  return false;
}
