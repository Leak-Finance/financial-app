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
      posts: [],
      vehicles: [],
      vehicle_brands: [],
      employee_profiles: [],
      currencies : [],

      errorMessage: '',

      // New cars post dialog
      description: '',
      price: 0,
      vehicle: {},
      currency: {},
    };
  },
  created() {
    this.vehicleRetailService.getAllVehicles().then(response => {
      this.vehicles = response.data;
    }).catch(error => {console.log(error);});
    this.vehicleRetailService.getAllVehiclePosts().then(response => {
      this.posts = response.data;
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
    getVehicle(vehicleId){
      return this.vehicleRetailService.getVehicleById(vehicleId).then(response => {
        return response.data;
      }).catch(error => {console.log(error);});
    },
    getVehicleBrand(vehicleId){
      return this.vehicleRetailService.getVehicleById(vehicleId).then(response => {
        const vehicle = response.data;
        console.log(vehicle.id);
        return this.vehicleRetailService.getVehicleBrandById(vehicle.id).then(response => {
          return response.data;
        }).catch(error => {console.log(error);});
      }).catch(error => {console.log(error);});
    },
    getEmployeeProfile(){
      return this.user.profile;
    },
    getCurrency(currencyId){
      return this.vehicleRetailService.getCurrencyById(currencyId).then(response => {
        return response.data;
      }).catch(error => {console.log(error);});
    },
    createVehiclePost(){
      this.vehicleRetailService.createVehiclePost(
          this.description,
          this.price,
          this.user.profile.id,
          this.vehicle.id,
          this.currency.id
      ).then(response => {
        this.posts.push(response.data);
        this.newCarPostDialog = false;
      }).catch(error => this.errorMessage = error.response.data.message[0]);
    }
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center gap-8 py-8">
      <Button @click="newCarPostDialog=true"
              label="Nueva publicación"
              icon="pi pi-plus" severity="success"
              class="w-full md:w-1/4" />
      <div v-if="posts.length>0" class="flex flex-wrap justify-center gap-12">
        <PostManagementCard
            v-for="post in calculateCurrentPageItems()"
            :post="post"
            :key="post.id"
            :vehicle=getVehicle(post.vehicleId)
            :vehicleBrand=getVehicleBrand(post.vehicleId)
            :employee_profile=getEmployeeProfile()
            :currency="getCurrency(post.currencyId)"
            :currencies = "this.currencies" />
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

  <Dialog v-model:visible="newCarPostDialog" header="Agregar carro" modal class="w-full md:w-1/3">
    <form class="grid gap-2"
          @submit.prevent="createVehiclePost">
      <p class="text-lg text-gray-400 font-medium">Todos los campos son obligatorios</p>
      <div class="grid w-full">
        <label class="text-sm">Vehículos</label>
        <Dropdown v-model="vehicle" :options="vehicles" optionLabel="model" placeholder="Selecciona vehículo" class="w-full" />
      </div>
      <div class="flex gap-2">
        <div class="grid w-full">
          <label for="selectedCurrency" class="text-sm">Moneda</label>
          <Dropdown v-model="currency" :options="currencies" optionLabel="symbol" placeholder="Selecciona moneda" class="w-full" />
        </div>
        <div class="grid w-full">
          <label for="selectedPrice" class="text-sm">Precio</label>
          <InputText id="selectedPrice" v-model="price" aria-describedby="username-help" @input="resetErrorMessage" />
        </div>
      </div>
      <div class="grid w-full">
        <label for="description" class="text-sm">Descripción</label>
        <Textarea v-model="description" rows="5" cols="30" @input="resetErrorMessage" />
      </div>
      <p class="text-red-700" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <Button type="submit" label="Publicar" class="w-full"  />
    </form>
  </Dialog>
</template>