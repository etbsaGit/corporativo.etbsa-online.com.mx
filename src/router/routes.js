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
  used,
  cc,
  caja,
  adminCaja,
  requisiciones,
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
      {
        path: "/reset-password",
        component: () => import("src/pages/auth/ResetPassword.vue"),
      },
      {
        path: "/forgot-password",
        component: () => import("src/pages/auth/ForgotPassword.vue"),
        meta: { requiresGuest: true },
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
      {
        path: "/festivos",
        component: () => import("src/pages/Festivos/FestivosPage.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [cc],
    },
    children: [
      {
        path: "/vehicles",
        component: () => import("src/pages/Vehicles/VehiclePage.vue"),
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
        path: "/evaluaciones",
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
        path: "/suggestion",
        component: () => import("src/pages/suggestion/SuggestionPage.vue"),
      },
      {
        path: "/vacation",
        component: () => import("src/pages/vacation/vacationPage.vue"),
      },
      {
        path: "/etica",
        component: () => import("src/pages/CodigoEtica/CodigoEticaPage.vue"),
      },
      {
        path: "/propuesta",
        component: () => import("src/pages/Propuesta/PropuestaIndex.vue"),
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
    path: "/used",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [used],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/Used/UsedPage.vue"),
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
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [gerentes],
    },
    children: [
      {
        path: "/visits",
        component: () => import("src/pages/visits/VisitsPage.vue"),
      },
      {
        path: "/prospect",
        component: () => import("src/pages/prospect/ProspectPage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [requisiciones],
    },
    children: [
      {
        path: "/requisiciones",
        component: () =>
          import("src/pages/RequisicionPersonal/RequisicionPersonalIndex.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [adminCaja],
    },
    children: [
      {
        path: "/caja/catalogos",
        component: () => import("src/pages/Caja/CajaCatalogos.vue"),
      },
      {
        path: "/caja/admin",
        component: () => import("src/pages/Caja/CajaAdmin.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [caja],
    },
    children: [
      {
        path: "/caja/transaccion",
        component: () => import("src/pages/Caja/CajaTransaccionNow.vue"),
      },
      {
        path: "/caja/reportes",
        component: () => import("src/pages/Caja/CajaReport.vue"),
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
