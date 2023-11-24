<script>
import {useUserStore} from "@/authentication/services/user-store.store";
import {AuthService} from "@/authentication/services/auth.service";

export default {
  name: 'LoginEmployeeFormPage',
  components: {},
  data() {
    return {
      authApi: new AuthService(),
      errorMessage: '',
      username: '',
      password: '',
    }
  },
  setup() {
    const userStore = useUserStore();
    const setUser = (user) => {
      userStore.setUser(user);
    };
    return { setUser };
  },
  methods: {
    login() {
      event.preventDefault();
      this.authApi.signInEmployees(this.username, this.password)
          .then(res => {
            if (res.data.token) {
              localStorage.setItem('user', JSON.stringify(res.data));
              this.setUser(res.data);
              this.$router.push("/dashboard")
            }
          })
          .catch(error => this.errorMessage = error.response.data.message[0]);
    },
    resetErrorMessage() {
      this.errorMessage = '';
    },
  },
};
</script>

<template>
  <div class="grid md:flex items-center text-center md:text-justify overflow-hidden">
    <form @submit.prevent="login" class="grid gap-8 justify-center p-8 md:w-1/2">
      <img class="w-32 h-auto" src="../../assets/finance-employee-logo.png" alt="Employee Logo">
      <p>
        ¿No eres empleado?
        <router-link to="/">
          <span class="font-medium underline hover:text-secondary duration-200">
            Iniciar sesión como cliente
          </span>
        </router-link>
      </p>
      <div class="grid gap-2 lg:max-w-[600px]">
        <div class="flex flex-col gap-1">
          <label for="username">
            Usuario
          </label>
          <InputText
              class="px-2 py-3 border rounded"
              id="username"
              v-model="username"
              type="text"
              aria-describedby="username-help"
              placeholder="Ingresa tu usuario"
              @input="resetErrorMessage" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="username">
            Contraseña
          </label>
          <InputText
              class="px-2 py-3 border rounded"
              id="password"
              type="password"
              v-model="password"
              aria-describedby="username-help"
              placeholder="Ingresa tu contraseña"
              @input="resetErrorMessage" />
        </div>
        <p class="text-red-700" v-if="errorMessage">
          {{ errorMessage }}
        </p>
      </div>
      <div class="grid gap-4 items-center text-center">
        <button class="btn-fill py-4 bg-secondary" type="submit">
          Iniciar sesión
        </button>
        <p>
          ¿No tienes cuenta?
          <router-link to="/register">
            <span class="font-medium underline hover:text-secondary duration-200">
              Regístrate
            </span>
          </router-link>
        </p>
      </div>
    </form>
    <div class="hidden sm:block md:w-1/2 w-full">
      <img class="w-auto rounded" src="../../assets/login-employee-image.png" alt="Employee login image">
    </div>
  </div>
</template>