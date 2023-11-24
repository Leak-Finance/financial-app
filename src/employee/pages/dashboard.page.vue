<script>
import PostManagementCard from "@/employee/components/post-management-card.component.vue";
import {HttpsService} from "@/shared/services/http.service";
import {VehicleRetailService} from "@/shared/services/vehicle-retail.service";
import {useUserStore} from "@/authentication/services/user-store.store";
export default {
  name: 'EmployeeDashboardPage',
  components: {
    PostManagementCard,
  },
  data() {
    return {
      httpService: new HttpsService(),
      vehicleRetailService: new VehicleRetailService(),
      currentPage: 1,
      itemsPerPage: 9,
      newCarPostDialog: false,
      newVehicleDialog: false,
      posts: [],
      vehicles: [],
      vehicle_brands: [],
      employee_profiles: [],
      currencies : [],

      errorMessage: '',

      // New post
      description: '',
      price: 0,
      vehicle: {},
      currency: {},


      // New car
      model: null,
      manufactureYear: null,
      photoUrl: null,
      brand: 0,
    };
  },
  created() {
    this.vehicleRetailService.getAllVehicles().then(response => {
      this.vehicles = response.data;
    }).catch(error => {console.log(error);});
    this.vehicleRetailService.getAllVehiclePosts().then(response => {
      this.posts = response.data.reverse();
    }).catch(error => {console.log(error);});
    this.vehicleRetailService.getAllVehicleBrands().then(response => {
      this.vehicle_brands = response.data;
    }).catch(error => {console.log(error);});
    this.vehicleRetailService.getAllCurrencies().then(response => {
      this.currencies = response.data;
    }).catch(error => {console.log(error);});
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
    resetErrorMessage() {
      this.errorMessage = '';
    },
    calculateCurrentPageItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.posts.slice(startIndex, endIndex);
    },
    getEmployeeProfile(){
      return this.user.profile;
    },
    createVehiclePost(){
      this.vehicleRetailService.createVehiclePost(
          this.description,
          this.price,
          this.user.profile.id,
          this.vehicle.id,
          this.currency.id
      ).then(() => {
        this.newCarPostDialog = false;
        this.refreshPosts();
      }).catch(error => this.errorMessage = error.response.data.message[0]);
    },
    createVehicle(){
      if (!this.model || !this.manufactureYear || !this.photoUrl || !this.brand) {
        this.errorMessage = 'Todos los campos son obligatorios';
      }
      else {
        this.vehicleRetailService.createVehicle(
            this.model,
            this.manufactureYear,
            this.photoUrl,
            this.brand.id
        ).then(() => {
          this.newVehicleDialog = false;
          this.refreshPosts();
        }).catch(error => this.errorMessage = error.response.data.message[0]);
      }
    },
    refreshPosts(){
      this.vehicleRetailService.getAllVehiclePosts().then(response => {
        this.posts = response.data;
      }).catch(error => {console.log(error);});
    },
    deletePost(postId){
      this.posts = this.posts.filter(post => post.id !== postId);
    },
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center gap-8 py-8">
      <div class="flex gap-4">
        <Button @click="newCarPostDialog=true"
                label="Nueva publicación"
                icon="pi pi-plus" severity="success" />
        <Button @click="newVehicleDialog=true"
                label="Nuevo vehículo"
                icon="pi pi-plus" />
      </div>
      <div v-if="posts.length>0" class="flex flex-wrap justify-center gap-12">
        <PostManagementCard
            v-for="post in calculateCurrentPageItems()"
            :post="post"
            :key="post.id"
            :employee_profile=getEmployeeProfile()
            :currencies = "this.currencies"
            @refresh-posts="refreshPosts"
        />
      </div>
      <div v-else>
        <p>No hay publicaciones</p>
      </div>
      <div class="flex gap-4">
        <Button @click="currentPage -= 1" :disabled="currentPage === 1" icon="pi pi-angle-left" outlined severity="info" />
        <Button @click="currentPage += 1" :disabled="currentPage === Math.ceil(posts.length / itemsPerPage)" icon="pi pi-angle-right" outlined severity="info" />
      </div>
    </div>
  </div>


  <Dialog v-model:visible="newVehicleDialog" header="Nuevo vehículo" modal class="w-full md:w-1/3">
    <form class="grid gap-2"
          @submit.prevent="createVehicle">
      <p class="text-lg text-gray-400 font-medium">Todos los campos son obligatorios</p>
      <div class="grid w-full">
        <label class="text-sm">Marca</label>
        <Dropdown v-model="brand" :options="vehicle_brands" optionLabel="name" placeholder="Selecciona marca" class="w-full" />
      </div>
      <div class="grid w-full">
        <label class="text-sm">Nombre modelo</label>
        <InputText v-model="model" @input="resetErrorMessage" />
      </div>
      <div class="grid w-full">
        <label class="text-sm">Fecha de fabricación</label>
        <InputText v-model="manufactureYear" @input="resetErrorMessage" />
      </div>
      <div class="grid w-full">
        <label class="text-sm">URL de foto</label>
        <InputText v-model="photoUrl" @input="resetErrorMessage" />
      </div>
      <p class="text-red-700" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <Button type="submit" label="Publicar" class="w-full"  />
    </form>
  </Dialog>


  <Dialog v-model:visible="newCarPostDialog" header="Nuevo post" modal class="w-full md:w-1/3">
    <form class="grid gap-2"
          @submit.prevent="createVehiclePost">
      <p class="text-lg text-gray-400 font-medium">Todos los campos son obligatorios</p>
      <div class="grid w-full">
        <label class="text-sm">Vehículos</label>
        <Dropdown v-model="vehicle" :options="vehicles" optionLabel="model" placeholder="Selecciona vehículo" class="w-full" />
      </div>
      <div class="flex gap-2">
        <div class="grid w-full">
          <label class="text-sm">Moneda</label>
          <Dropdown v-model="currency" :options="currencies" optionLabel="symbol" placeholder="Selecciona moneda" class="w-full" />
        </div>
        <div class="grid w-full">
          <label class="text-sm">Precio</label>
          <InputText v-model="price" aria-describedby="username-help" @input="resetErrorMessage" />
        </div>
      </div>
      <div class="grid w-full">
        <label class="text-sm">Descripción</label>
        <Textarea v-model="description" rows="5" cols="30" @input="resetErrorMessage" />
      </div>
      <p class="text-red-700" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <Button type="submit" label="Publicar" class="w-full"  />
    </form>
  </Dialog>
</template>