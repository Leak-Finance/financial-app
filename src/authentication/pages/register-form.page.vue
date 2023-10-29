<script  lang="ts">
export default {
  name: 'RegisterFormPage',
  components: {},
  data() {
    return {
      errorMessage: '',         // TODO: to show if there is an error in the form
      name: '',
      username: '',
      password: '',
      avatarUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
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
      ]
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
    register() {
      this.errorMessage = '';
    },
    resetErrorMessage() {
      this.errorMessage = '';
    },
    changeAvatar(selectedAvatarUrl){
      this.avatarUrl = selectedAvatarUrl;
      this.visible = false;
    }
  },
};
</script>

<template>
  <Dialog v-model:visible="visible" modal :style="{ width: '50vw' }"
          header="Escoge un avatar" >
    <div class="flex flex-wrap gap-8">
      <div v-for="avatar in avatars" :key="avatar"
           class="flex flex-col items-center justify-center gap-2 p-2 hover:cursor-pointer hover:scale-95 duration-200">
        <div @click="changeAvatar(avatar)">
          <img class="h-32 w-32 rounded-full border border-secondary" :src="avatar" alt="Avatar image">
        </div>
      </div>
    </div>
  </Dialog>

  <div class="grid md:flex items-center text-center md:text-justify h-screen overflow-hidden">
    <form @submit.prevent="register" class="grid gap-8 justify-center p-8 md:w-1/2">
      <h1 class="text-6xl font-bold text-primary">
        Registro
      </h1>
      <div class="grid gap-2 md:w-[600px]">
        <div class="flex flex-col gap-1 items-center justify-center" @click="visible = true">
          <label for="username">
            Escoge una avatar
          </label>
          <img class="h-32 w-32 rounded-full border border-secondary hover:cursor-pointer hover:scale-95 duration-200"
               :src="avatarUrl" alt="Avatar image">
        </div>
        <div class="flex flex-col gap-1">
          <label for="username">
            Nombre
          </label>
          <InputText
              class="px-2 py-3 border rounded"
              id="name"
              v-model="name"
              type="text"
              aria-describedby="username-help"
              placeholder="Ingresa tu nombre"
              @input="resetErrorMessage" />
        </div>
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
    <div class="flex sm:block md:w-1/2 w-full">
      <img class="w-auto rounded" src="../../assets/register-image.png" alt="Hero image">
    </div>
  </div>
</template>