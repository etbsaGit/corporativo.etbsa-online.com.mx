import { useAuthStore } from "src/stores/auth";
import {
  checkPuesto,
  checkPuestoIncludes,
  checkRole,
} from "src/boot/functions";

export function guest(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/perfil");
  }
  return next();
}

export function auth(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }
  return next();
}

export function admin(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Admin")) {
    return next("/perfil");
  }

  return next();
}

export function rrhh({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("RRHH")) {
    if (!checkRole("Jefe")) {
      return next("/perfil");
    }
    return next();
  }

  return next();
}

export function servicio({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (checkRole("Servicio") || checkRole("Taller")) {
    return next();
  }
  auth.returnUrl = to.fullPath;
  return next("/perfil");
}

export function encuestador(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }
  if (checkRole("Encuestador") || checkRole("Evaluador")) {
    return next();
  }
  auth.returnUrl = to.fullPath;
  return next("/perfil");
}

export function tech({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkPuesto("Tecnico")) {
    return next("/perfil");
  }

  return next();
}

export function rental({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Rentas")) {
    return next("/perfil");
  }

  return next();
}

export function used({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Usados")) {
    return next("/perfil");
  }

  return next();
}

export function gerentes({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkPuestoIncludes("Gerente")) {
    return next("/perfil");
  }

  return next();
}

export function cc({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("cc")) {
    return next("/perfil");
  }

  return next();
}

export function caja({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Caja")) {
    return next("/perfil");
  }

  return next();
}

export function adminCaja({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("AdminCaja")) {
    return next("/perfil");
  }

  return next();
}

export function requisiciones({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  // Redirigir al perfil si NO es Jefe, NO es Gerente y NO es RRHH
  if (
    !checkPuestoIncludes("Jefe") &&
    !checkPuestoIncludes("Gerente") &&
    !checkPuestoIncludes("Director") &&
    !checkRole("RRHH")
  ) {
    return next("/perfil");
  }

  // Si es alguno de esos, sigue su camino
  return next();
}

export function credito({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Credito")) {
    return next("/perfil");
  }

  return next();
}
