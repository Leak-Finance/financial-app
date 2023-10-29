import { createRouter, createWebHistory } from 'vue-router'
import LoginFormPage from "../authentication/pages/login-form.page.vue";
import PageNotFound from "../shared/pages/page-not-found.page.vue";
import LoginEmployeeForm from "../authentication/pages/login-employee-form.page.vue";
import RegisterFormPage from "../authentication/pages/register-form.page.vue";
import EmployeeDashboardPage from "../employee/pages/dashboard.page.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/register', name: 'Register', component: RegisterFormPage, meta: { requiresAuth: false }},
    { path: '/login', name: 'Log In', component: LoginFormPage, meta: { requiresAuth: false }},
    { path: '/login/employee', name: 'Employee Log In', component: LoginEmployeeForm, meta: { requiresAuth: false }},
    { path: '/:notFound(.*)', component: PageNotFound, meta: { requiresAuth: false }},
    { path: '/dashboard', component: EmployeeDashboardPage, meta: { requiresAuth: true }},
    {
      path: '/',
      redirect: (to) => {
        if (to.meta.requiresAuth) {
          // TODO: Implement catalog for clienst and dashboard for employees
          return '/catalog';
        } else {
          return '/login';
        }
      },
    },
  ]
})

/*
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else if (!to.meta.requiresAuth && userStore.isAuthenticated) {
    next('/products');
  } else {
    next();
  }
});
*/

export default router
