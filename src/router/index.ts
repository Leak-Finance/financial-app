import { createRouter, createWebHistory } from 'vue-router'
import LoginFormPage from "../authentication/pages/login-form.page.vue";
import PageNotFound from "../shared/pages/page-not-found.page.vue";
import LoginEmployeeForm from "../authentication/pages/login-employee-form.page.vue";
import RegisterFormPage from "../authentication/pages/register-form.page.vue";
import EmployeeDashboardPage from "../employee/pages/dashboard.page.vue";
import CatalogPage from "../customer/pages/catalog.page.vue";

import {useUserStore} from "../authentication/services/user-store.store.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/register', name: 'Register', component: RegisterFormPage, meta: { requiresAuth: false }},
    { path: '/login', name: 'Log In', component: LoginFormPage, meta: { requiresAuth: false }},
    { path: '/login/employee', name: 'Employee Log In', component: LoginEmployeeForm, meta: { requiresAuth: false }},
    { path: '/:notFound(.*)', component: PageNotFound, meta: { requiresAuth: false }},
    { path: '/dashboard', component: EmployeeDashboardPage, meta: { requiresAuth: true }},
    { path: '/catalog', component: CatalogPage, meta: { requiresAuth: true }},
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const authRoutes = ['/login', '/register', '/login/employee'];
  const customerRoutes = ['/catalog'];
  const employeeRoutes = ['/dashboard'];

  // console.log(to.path, userStore.isAuthenticated, userStore.isCustomer, userStore.isEmployee)

  if (to.path === '/') {
    // Handle the default path ("/")
    if (userStore.isAuthenticated) {
      // If authenticated, redirect to appropriate route based on the user type
      next(userStore.isCustomer ? '/catalog' : '/dashboard');
    } else {
      // If not authenticated, redirect to the login page
      next('/login');
    }
  } else if (to.meta.requiresAuth) {
    // Handle other routes that require authentication
    if (!userStore.isAuthenticated) {
      next('/login');
    } else {
      if (userStore.isCustomer && !customerRoutes.includes(to.path)) {
        // Client trying to access a non-customer route
        next('/catalog');
      } else if (userStore.isEmployee && !employeeRoutes.includes(to.path)) {
        // Employee trying to access a non-employee route
        next('/dashboard');
      } else {
        // User is authenticated and trying to access a route that requires authentication
        next();
      }
    }
  } else {
    // Handle routes that don't require authentication
    if (authRoutes.includes(to.path) && userStore.isAuthenticated) {
      // User is authenticated and trying to access a route that doesn't require authentication
      next('/');
    } else {
      next();
    }
  }
});

export default router
