import { auth, guest, admin, rrhh, encuestador, servicio } from "./middleware";

const routes = [
  {
    path: "",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      { path: "/login", component: () => import("pages/auth/LoginPage.vue") },
      {
        path: "/expedientes",
        component: () => import("src/pages/expedientes/expedienteIndex.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [rrhh],
    },
    children: [
      {
        path: "/employees",
        component: () => import("src/pages/employees/IndexPage.vue"),
      },
      {
        path: "/catalogos",
        component: () => import("src/pages/catalogos/index.vue"),
      },
    ],
  },
  {
    path: "/technician",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [servicio],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/technician/technicianIndex.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      {
        path: "/perfil",
        component: () => import("src/pages/employees/PerfilPage.vue"),
      },
      {
        path: "/encuestas",
        component: () => import("src/pages/survey/index.vue"),
      },
    ],
  },
  {
    path: "/users",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [admin],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/users/index.vue"),
      },
    ],
  },

  {
    path: "/surveys",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [encuestador],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/survey/dashboard.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
