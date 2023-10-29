import { createRouter, createWebHistory } from 'vue-router'
import LoginFormPage from "/src/authentication/pages/login-form.page.vue";
import PageNotFound from "/src/shared/pages/page-not-found.page.vue";
import LoginEmployeeForm from "/src/authentication/pages/login-employee-form.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Log In', component: LoginFormPage, meta: { requiresAuth: false }},
    { path: '/login/employee', name: 'Employee Log In', component: LoginEmployeeForm, meta: { requiresAuth: false }},
    { path: '/:notFound(.*)', component: PageNotFound, meta: { requiresAuth: false }},
    {
      path: '/',
      redirect: (to) => {
        if (to.meta.requiresAuth) {
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
