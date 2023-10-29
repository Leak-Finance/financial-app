<script lang="ts">
import { RouterView } from 'vue-router'
//import {AuthenticationService} from "./authentication/services/authenticationService.service.js";
//import {useUserStore} from "./authentication/services/user-store.store.js";

export default {
  data() {
    return {
      visibleMobileBar: false,
      user: null,
      responsiveNavbarVisible: false,
    }
  },
  /*
  setup() {
    const userStore = useUserStore();

    const setUser = (user) => {
      userStore.setUser(user);
    };

    return { setUser };
  },
  created() {
    const user = localStorage.getItem("user");
    user && this.setUser(JSON.parse(user));
    this.user = JSON.parse(user);
  },
  methods: {
    isAnAuthenticationPath(path) {
      return this.authenticationPaths.has(path);
    },
    logout() {
      location.reload();
      const userStore = useUserStore();
      userStore.logout();
    },
    showResponsiveNavbar(){
      this.responsiveNavbarVisible = !this.responsiveNavbarVisible;
    }
  },
  watch: {
    $route(to, from) {
      if (!this.user && !this.isAnAuthenticationPath(to.path)) {
        const user = localStorage.getItem("user");
        user && this.setUser(JSON.parse(user));
        this.user = JSON.parse(user);
      }
    },
  }
  */
}
</script>

<template>
  <nav class="sticky container mx-auto px-4 py-4">
    <div class="flex place-content-between items-center">
      <router-link to="/">
        <img src="./assets/finance-logo.png" alt="Finance logo"
             class="h-6 md:h-8 hover:scale-95 duration-200" />
      </router-link>

      <div class="flex gap-6 items-center">
        <!-- Client navbar -->
        <div v-if="user">
          <div class="flex gap-8">
            <p>Hola, name</p>
            <p>Cuenta</p> <!-- TODO: dropdown -->
          </div>
        </div>

        <!-- TODO: Employee navbar -->
        <div v-if="user==null">
          <div class="flex gap-8">
            <router-link to="/login">
              <p class="font-medium text-lg hover:text-secondary duration-200">
                Iniciar sesión
              </p>
            </router-link>
            <router-link to="/register">
              <p class="font-medium text-lg hover:text-secondary duration-200">
                Registro
              </p>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </nav>

  <RouterView />
</template>

<style scoped>

</style>
