import { auth, guest, admin, rrhh, encuestador } from "./middleware";

const routes = [
  {
    path: "",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [{ path: "", component: () => import("pages/HomePage.vue") }],
  },
  {
    path: "/login",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/auth/LoginPage.vue") },
    ],
  },
  {
    path: "/register/",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/auth/RegisterPage.vue") },
    ],
  },
  {
    path: "/employees",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [rrhh],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/employees/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/perfil",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/employees/PerfilPage.vue"),
      },
    ],
  },
  {
    path: "/catalogos",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [rrhh],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/catalogos/index.vue"),
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
    path: "/expedientes",
    component: () => import("/src/layouts/ExpedienteLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/expedientes/expedienteIndex.vue"),
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
        component: () => import("src/pages/survey/indexSurvey.vue"),
      },
    ],
  },
  {
    path: "/encuestas",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/survey/index.vue"),
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
