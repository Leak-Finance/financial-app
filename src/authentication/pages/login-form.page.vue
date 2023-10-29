<script lang="ts">
export default {
  name: 'LoginFormPage',
  components: {},
  data() {
    return {
      errorMessage: '',
      username: '',
      password: '',
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
  */
  methods: {
    login() {
      this.errorMessage = '';
    },
    resetErrorMessage() {
      this.errorMessage = '';
    },
  },
};
</script>

<template>
  <div class="grid md:flex items-center text-center md:text-justify h-screen overflow-hidden">
    <div class="flex sm:block md:w-1/2 w-full">
      <img class="w-auto rounded" src="../../assets/login-image.png" alt="Hero image">
    </div>
    <form @submit.prevent="login" class="grid gap-8 justify-center p-8 md:w-1/2">
      <h1 class="text-6xl font-bold text-primary">
        Bienvenido
      </h1>
      <p>
        ¿Eres empleado?
        <router-link to="login/employee">
          <span class="font-medium underline hover:text-secondary duration-200">
            Iniciar sesión como empleado
          </span>
        </router-link>
      </p>
      <div class="grid gap-2 md:w-[600px]">
        <div class="flex flex-col gap-1">
          <label for="username">
            Correo
          </label>
          <InputText
              class="px-2 py-3 border rounded"
              id="username"
              v-model="username"
              type="text"
              aria-describedby="username-help"
              placeholder="Ingresa correo"
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
              placeholder="Ingresa contraseña"
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
  </div>
</template>

<style scoped>

</style>