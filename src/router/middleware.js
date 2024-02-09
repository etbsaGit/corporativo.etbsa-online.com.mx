import { useAuthStore } from "src/stores/auth";
import { tieneRolAdmin } from "src/boot/functions";

export function guest(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/employees");
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
  if (!tieneRolAdmin(auth.user)) {
    auth.returnUrl = to.fullPath;
    return next("/perfil");
  }
  return next();
}
