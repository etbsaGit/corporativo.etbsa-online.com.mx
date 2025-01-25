import {
  auth,
  guest,
  admin,
  rrhh,
  encuestador,
  servicio,
  tech,
  rental,
  gerentes,
} from "./middleware";

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
        path: "/incapacities",
        component: () => import("src/pages/incapacity/IncapacityPage.vue"),
      },
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
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [servicio],
    },
    children: [
      {
        path: "/technician",
        component: () => import("src/pages/technician/technicianIndex.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("src/layouts/ConstruccionLayout.vue"),
    meta: {
      middlewares: [servicio],
    },
    children: [
      {
        path: "/presentation/construccion",
        component: () =>
          import("src/pages/technician/technicianConstruccion.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("src/layouts/AgricolaLayout.vue"),
    meta: {
      middlewares: [servicio],
    },
    children: [
      {
        path: "/presentation/agricola",
        component: () => import("src/pages/technician/technicianAgricola.vue"),
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
      {
        path: "/calendar",
        component: () => import("src/pages/calendar/calendarIndex.vue"),
      },
      {
        path: "/post",
        component: () => import("src/pages/post/postIndex.vue"),
      },
      {
        path: "/vacation",
        component: () => import("src/pages/vacation/vacationPage.vue"),
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

  {
    path: "/techlogs",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [tech],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/technician/technicianLogs.vue"),
      },
    ],
  },

  {
    path: "/rentalmachines",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [rental],
    },
    children: [
      {
        path: "",
        component: () =>
          import("src/pages/RentalMachines/RentalMachinesPage.vue"),
      },
    ],
  },

  {
    path: "/rentalperiods",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [rental],
    },
    children: [
      {
        path: "",
        component: () =>
          import("src/pages/RentalPeriods/RentalPeriodsPage.vue"),
      },
    ],
  },

  {
    path: "/bays",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [gerentes],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/Bays/BaysIndex.vue"),
      },
    ],
  },

  {
    path: "/visits",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [gerentes],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/visits/VisitsPage.vue"),
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
