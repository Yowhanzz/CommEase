import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import DashboardVolunteers from "@/views/Dashboard-Volunteers.vue";
import Safety_Protocol from "@/views/Safety Protocols - Volunteers.vue";
import ActivityLogVolunteers from "@/views/Activity-Log - Volunteers.vue";
import RegistrationVolunteers from "@/views/Registration-Volunteers.vue";
import LoginVolunteers from "@/views/Login-Volunteers.vue";
import Qr from "@/views/qr.vue";
import LoginOrganizers from "@/views/Login-Organizers.vue";
import DashboardOrganizers from "@/views/Dashboard-Organizers.vue";
import CreateEventOrganizers from "@/views/Create-Event.vue";
import EditEventOrganizers from "@/views/Edit-event.vue";
import ActivityLogOrganizers from "@/views/Activity-Log - Organizers.vue";
import Analytics from "@/views/analytics.vue";
import AnalyticsOrganizers from "@/views/Analytics - Organizers.vue";
import OTPVolunteers from "@/views/OTP - Volunteers.vue";
import SafetyProtocolsOrganizers from "@/views/Safety Protocols - Organizers.vue";
import PasswordVolunteers from "@/views/Password - Volunteers.vue";
import CreateGmailVolunteers from "@/views/Create-Gmail-Volunteers.vue";
import FOTPVolunteers from "@/views/OTP - Volunteers-FPassword.vue";
import FPasswordVolunteers from "@/views/Password - Volunteers - FPassword.vue";
import ManageEventsOrganizers from "@/views/Manage-Events - Organizers.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },

    {
      path: "/" /* ROUTE GUARDING FOR VOLUNTEERS AND ORGS */,
      redirect: "LoginVolunteers",
    },

    {
      path: "/OTPVolunteers",
      name: "OTP",
      component: OTPVolunteers,
    },

    {
      path: "/FOTPVolunteers",
      name: "FOTP",
      component: FOTPVolunteers,
    },

    {
      path: "/FPasswordVolunteers",
      name: "FPassword",
      component: FPasswordVolunteers,
    },

    {
      path: "/CreateGmailVolunteers",
      name: "CreateGmail",
      component: CreateGmailVolunteers,
    },

    {
      path: "/PasswordVolunteers",
      name: "PasswordVolunteers",
      component: PasswordVolunteers,
    },

    {
      path: "/DashboardVolunteers",
      name: "DashboardVolunteers",
      component: DashboardVolunteers,
    },

    {
      path: "/safety_protocol",
      name: "safety",
      component: Safety_Protocol,
    },

    {
      path: "/ActivityLogVolunteers",
      name: "ActivityLogVolunteers",
      component: ActivityLogVolunteers,
    },

    {
      path: "/RegistrationVolunteers/:id",
      name: "RegistrationVolunteers",
      component: () => import("../views/Registration-Volunteers.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/LoginVolunteers",
      name: "LoginVolunteers",
      component: LoginVolunteers,
    },

    {
      path: "/qr",
      name: "qr",
      component: Qr,
    },

    {
      path: "/analytics",
      name: "analytics",
      component: Analytics,
    },

    /* FOR ORGANIZERS */

    {
      path: "/LoginOrganizers",
      name: "LoginOrganizers",
      component: LoginOrganizers,
    },

    {
      path: "/DashboardOrganizers",
      name: "DashboardOrganizers",
      component: DashboardOrganizers,
    },

    {
      path: "/CreateEventOrganizers",
      name: "CreateEventOrganizers",
      component: CreateEventOrganizers,
    },

    {
      path: "/EditEventOrganizers/:id",
      name: "EditEventOrganizers",
      component: EditEventOrganizers,
    },

    {
      path: "/ActivityLogOrganizers",
      name: "ActivityLogOrganizers",
      component: ActivityLogOrganizers,
    },

    {
      path: "/AnalyticsOrganizers",
      name: "AnalyticsOrganizers",
      component: AnalyticsOrganizers,
    },

    {
      path: "/SafetyProtocolsOrganizers",
      name: "SafetyProtocolsOrganizers",
      component: SafetyProtocolsOrganizers,
    },

    {
      path: "/ManageEventsOrganizers",
      name: "ManageEventsOrganizers",
      component: ManageEventsOrganizers,
    },
  ],
});

export default router;
