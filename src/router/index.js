import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import DashboardVolunteers from '@/views/Dashboard-Volunteers.vue'
import Safety_Protocol from '@/views/Safety Protocols - Volunteers.vue'
import ActivityLogVolunteers from '@/views/Activity-Log - Volunteers.vue'
import RegistrationVolunteers from '@/views/Registration-Volunteers.vue'
import LoginVolunteers from '@/views/Login-Volunteers.vue'
import Qr from '@/views/qr.vue'
import LoginOrganizers from '@/views/Login-Organizers.vue'
import DashboardOrganizers from '@/views/Dashboard-Organizers.vue'
import CreateEventOrganizers from '@/views/Create-Event.vue'
import EditEventOrganizers from '@/views/Edit-event.vue'
import ActivityLogOrganizers from '@/views/Activity-Log - Organizers.vue'
import Analytics from '@/views/analytics.vue'
import AnalyticsOrganizers from '@/views/Analytics - Organizers.vue'
import OTPVolunteers from '@/views/OTP - Volunteers.vue'
import SafetyProtocolsOrganizers from '@/views/Safety Protocols - Organizers.vue'
import PasswordVolunteers from '@/views/Password - Volunteers.vue'
import CreateGmailVolunteers from '@/views/Create-Gmail-Volunteers.vue'
import FOTPVolunteers from '@/views/OTP - Volunteers-FPassword.vue'
import FPasswordVolunteers from '@/views/Password - Volunteers - FPassword.vue'
import ManageEventsOrganizers from '@/views/Manage-Events - Organizers.vue'
import { authService } from '@/api/services'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },

    {
      path: '/', /* ROUTE GUARDING FOR VOLUNTEERS AND ORGS */
      redirect: 'LoginVolunteers',
    },

    {
      path: '/OTPVolunteers',
      name: 'OTP',
      component: OTPVolunteers,
    },

    {
      path: '/FOTPVolunteers',
      name: 'FOTP',
      component: FOTPVolunteers,
    },

    {
      path: '/FPasswordVolunteers',
      name: 'FPassword',
      component: FPasswordVolunteers,
    },

    {
      path: '/CreateGmailVolunteers',
      name: 'CreateGmail',
      component: CreateGmailVolunteers,
    },

    {
      path: '/PasswordVolunteers',
      name: 'PasswordVolunteers',
      component: PasswordVolunteers,
    },
 
    {
      path: '/DashboardVolunteers',
      name: 'DashboardVolunteers',
      component: DashboardVolunteers,
      meta: { requiresAuth: true, requiresVolunteer: true }
    },

    {
      path: '/safety_protocol',
      name: 'safety',
      component: Safety_Protocol,
      meta: { requiresAuth: true, requiresVolunteer: true }
    },

    {
      path: '/ActivityLogVolunteers',
      name: 'ActivityLogVolunteers',
      component: ActivityLogVolunteers,
      meta: { requiresAuth: true, requiresVolunteer: true }
    },

    {
      path: '/RegistrationVolunteers/:id',
      name: 'RegistrationVolunteers',
      component: () => import('../views/Registration-Volunteers.vue'),
      meta: { requiresAuth: true, requiresVolunteer: true }
    },

    {
      path: '/LoginVolunteers',
      name: 'LoginVolunteers',
      component: LoginVolunteers,
    },

    {
      path: '/qr',
      name: 'qr',
      component: Qr,
      meta: { requiresAuth: true }
    },

    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics,
      meta: { requiresAuth: true }
    },

    /* FOR ORGANIZERS */

    {
      path: '/LoginOrganizers',
      name: 'LoginOrganizers',
      component: LoginOrganizers,
    },

    {
      path: '/DashboardOrganizers',
      name: 'DashboardOrganizers',
      component: DashboardOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/CreateEventOrganizers',
      name: 'CreateEventOrganizers',
      component: CreateEventOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/EditEventOrganizers/:id',
      name: 'EditEventOrganizers',
      component: EditEventOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/ActivityLogOrganizers',
      name: 'ActivityLogOrganizers',
      component: ActivityLogOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/AnalyticsOrganizers',
      name: 'AnalyticsOrganizers',
      component: AnalyticsOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/SafetyProtocolsOrganizers',
      name: 'SafetyProtocolsOrganizers',
      component: SafetyProtocolsOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },

    {
      path: '/ManageEventsOrganizers',
      name: 'ManageEventsOrganizers',
      component: ManageEventsOrganizers,
      meta: { requiresAuth: true, requiresOrganizer: true }
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Public routes that don't require authentication
  const publicRoutes = ['LoginVolunteers', 'LoginOrganizers', 'signup', 'OTP', 'FOTP', 'FPassword', 'CreateGmail', 'PasswordVolunteers'];
  
  if (publicRoutes.includes(to.name)) {
    next();
    return;
  }

  try {
    // Check if user is authenticated
    const isAuthenticated = await authService.checkAuth();
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to appropriate login page
      if (to.meta.requiresOrganizer) {
        next({ name: 'LoginOrganizers' });
      } else {
        next({ name: 'LoginVolunteers' });
      }
      return;
    }

    // Get user role
    const userRole = await authService.getUserRole();

    // Check role requirements
    if (to.meta.requiresOrganizer && userRole !== 'organizer') {
      next({ name: 'LoginOrganizers' });
      return;
    }

    if (to.meta.requiresVolunteer && userRole !== 'volunteer') {
      next({ name: 'LoginVolunteers' });
      return;
    }

    // If all checks pass, proceed
    next();
  } catch (error) {
    console.error('Navigation guard error:', error);
    // On error, redirect to appropriate login page
    if (to.meta.requiresOrganizer) {
      next({ name: 'LoginOrganizers' });
    } else {
      next({ name: 'LoginVolunteers' });
    }
  }
});

export default router 