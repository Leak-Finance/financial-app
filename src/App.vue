<script>

import {useUserStore} from "@/authentication/services/user-store.store";
import {FwbDropdown, FwbListGroup, FwbListGroupItem} from 'flowbite-vue'
import router from "@/router";
export default {
  components: {FwbListGroupItem, FwbListGroup, FwbDropdown},
  data() {
    return {
      visibleMobileBar: false,
      responsiveNavbarVisible: false,
    }
  },
  setup() {
    const userStore = useUserStore();

    const setUser = (user) => {
      userStore.setUser(user);
    };

    const showResponsiveNavbar = () => {
      this.responsiveNavbarVisible = !this.responsiveNavbarVisible;
    };

    return { setUser, showResponsiveNavbar };
  },
  created() {
    const user = localStorage.getItem("user");
    if (user) {
      this.setUser(JSON.parse(user));
    }
    localStorage.setItem("userEmail", this.user.email)
  },
  computed: {
    user() {
      return useUserStore().user;
    },
    isAuthenticated() {
      return useUserStore().isAuthenticated;
    },
  },
  methods: {
    greeting(){
      return "Hola, " + this.user.profile.firstName;
    },
    logout() {
      const userStore = useUserStore();
      userStore.logout();
      router.push("/");
    },
  },
}
</script>

<template>
  <Toast />
  <div class="h-screen grid grid-rows-[auto_1fr]">
    <nav class="sticky container mx-auto px-4 py-4">
      <div class="flex place-content-between items-center">
        <router-link to="/">
          <img src="./assets/finance-logo.png" alt="Finance logo"
               class="h-6 md:h-8 hover:scale-95 duration-200" />
        </router-link>

        <div class="flex gap-6 items-center">
          <!-- Client navbar -->
          <div v-if="user && isAuthenticated">
            <div class="flex gap-8 font-medium text-lg items-center">
              <router-link to="/history">
                <Button icon="pi pi-history" severity="info" rounded aria-label="History" />
              </router-link>
              <fwb-dropdown :text=greeting()>
                <fwb-list-group>
                  <fwb-list-group-item>
                    <div class="flex flex-col items-center gap-2 w-full">
                      <div v-if="user.profile.photoUrl">
                        <img class="rounded-full object-cover h-16 w-16"
                             :src=user.profile.photoUrl alt="Profile picture">
                      </div>
                      <div v-else>
                        <img class="rounded-full object-cover h-16 w-16"
                             src="https://www.svgrepo.com/show/421195/avatar-business-human.svg" alt="Profile picture">
                      </div>
                      <p class="text-lg">{{ user.profile.firstName }}&nbsp;{{ user.profile.lastName }}</p>
                    </div>
                  </fwb-list-group-item>
                  <fwb-list-group-item class="w-full text-center flex items-center justify-center hover:cursor-pointer"
                                       @click="logout">
                    Cerrar sesión
                  </fwb-list-group-item>
                </fwb-list-group>
              </fwb-dropdown>
            </div>
          </div>

          <!-- TODO: Employee navbar -->
          <div v-if="!user && !isAuthenticated">
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
  </div>
</template>
