<script>
import {AuthService} from "@/authentication/services/auth.service";
import { useToast } from 'primevue/usetoast';
import {useUserStore} from "@/authentication/services/user-store.store";
export default {
  name: 'RegisterFormPage',
  components: {},
  data() {
    return {
      toast: useToast(),
      authService: new AuthService(),
      errorMessage: '',
      visible:false,
      avatars: [
        'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
        'https://www.svgrepo.com/show/420364/avatar-male-man.svg',
        'https://www.svgrepo.com/show/420328/avatar-female-girl.svg',
        'https://www.svgrepo.com/show/420346/afro-avatar-male-2.svg',
        'https://www.svgrepo.com/show/420347/avatar-einstein-professor.svg',
        'https://www.svgrepo.com/show/420333/afro-avatar-male.svg',
        'https://www.svgrepo.com/show/420360/avatar-batman-comics.svg',
        'https://www.svgrepo.com/show/420336/indian-male-man.svg',
        'https://www.svgrepo.com/show/420329/anime-away-face.svg',
        'https://www.svgrepo.com/show/420326/afro-female-person.svg',
        'https://www.svgrepo.com/show/420341/avatar-geisha-japanese.svg',
        'https://www.svgrepo.com/show/420339/boy-indian-kid.svg',
        'https://www.svgrepo.com/show/420331/avatar-lazybones-sloth.svg',
        'https://www.svgrepo.com/show/420324/beard-hipster-male.svg',
        'https://www.svgrepo.com/show/420355/animal-avatar-mutton.svg',
      ],
      email: '',
      password: '',
      dni: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      photoUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    }
  },
  setup() {
    const userStore = useUserStore();
    const setUser = (user) => {
      userStore.setCustomerUser(user);
    };
    return { setUser };
  },
  methods: {
    register(email, password, dni, firstName, lastName, phoneNumber, photoUrl) {
      this.authService.signUpCustomers(email, password, dni, firstName, lastName, phoneNumber, photoUrl).then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
        this.setUser(response.data);

        this.$toast.add({
          severity: "success",
          summary: "Éxito",
          detail: `${response.data.message}. Redirigiendo a la cuenta...`,
          life: 3000
        });
        setTimeout(() => {
          this.$router.push("/catalog");
        }, 3000);
      }).catch((error) => {
        this.errorMessage = error.response.data.message[0];
      });
    },
    resetErrorMessage() {
      this.errorMessage = '';
    },
    changeAvatar(selectedAvatarUrl){
      this.photoUrl = selectedAvatarUrl;
      this.visible = false;
    }
  },
};
</script>

<template>
  <Toast />

  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :style="{ width: 'fit' }"
    class="w-5/6 md:w-1/2"
    header="Selecciona un avatar"
  >
    <div class="flex flex-wrap justify-center gap-8">
      <div v-for="avatar in avatars" :key="avatar"
           class="flex flex-col items-center justify-center gap-2 p-2 hover:cursor-pointer hover:scale-95 duration-200">
        <div @click="changeAvatar(avatar)">
          <img class="h-16 w-16 md:h-32 md:w-32 rounded-full border border-secondary" :src="avatar" alt="Avatar image">
        </div>
      </div>
    </div>
  </Dialog>

  <div class="grid md:flex items-center md:text-justify overflow-hidden">
    <form @submit.prevent="register(this.email, this.password, this.dni, this.firstName, this.lastName, this.phoneNumber, this.photoUrl)"
          class="grid gap-8 justify-center p-8 md:w-1/2">
      <h1 class="text-6xl font-bold text-primary">
        Registro
      </h1>
      <div class="grid gap-2 md:w-[600px]">
        <div class="flex flex-col gap-1 items-center justify-center" @click="visible = true">
          <label for="photoUrl">
            Escoge una avatar
          </label>
          <img class="h-32 w-32 rounded-full border border-secondary hover:cursor-pointer hover:scale-95 duration-200"
               :src="photoUrl" alt="Avatar image">
        </div>
        <div class="flex gap-2">
          <div class="flex flex-col gap-1 w-full">
            <label for="name">
              Nombre
            </label>
            <InputText
                class="px-2 py-3 border rounded"
                id="name"
                v-model="firstName"
                type="text"
                aria-describedby="username-help"
                placeholder="Ingresa tu nombre"
                @input="resetErrorMessage" />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <label for="lastName">
              Apellidos
            </label>
            <InputText
                class="px-2 py-3 border rounded"
                id="lastName"
                v-model="lastName"
                type="text"
                aria-describedby="username-help"
                placeholder="Ingresa tus apellidos"
                @input="resetErrorMessage" />
          </div>
        </div>
        <div class="flex gap-2">
          <div class="flex flex-col gap-1 w-full">
            <label for="dni">
              DNI
            </label>
            <InputText
                class="px-2 py-3 border rounded"
                id="name"
                v-model="dni"
                type="text"
                aria-describedby="username-help"
                placeholder="Ingresa DNI"
                @input="resetErrorMessage" />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <label for="phoneNumber">
              Número de teléfono
            </label>
            <InputText
                class="px-2 py-3 border rounded"
                id="phoneNumber"
                v-model="phoneNumber"
                type="text"
                aria-describedby="username-help"
                placeholder="Ingresa número de teléfono"
                @input="resetErrorMessage" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label for="email">
            Correo
          </label>
          <InputText
              class="px-2 py-3 border rounded"
              id="email"
              v-model="email"
              type="text"
              aria-describedby="username-help"
              placeholder="Ingresa correo"
              @input="resetErrorMessage" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="password">
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
          Registro
        </button>
        <p>
          ¿Ya tienes cuenta?
          <router-link to="/login">
            <span class="font-medium underline hover:text-secondary duration-200">
              Iniciar sesión
            </span>
          </router-link>
        </p>
      </div>
    </form>
    <div class="hidden sm:block md:w-1/2 w-full">
      <img class="w-auto rounded" src="../../assets/register-image.png" alt="Hero image">
    </div>
  </div>
</template>

