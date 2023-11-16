<script>
import LoadingSpinner from '../../shared/components/loading-spinner.component.vue';
import PostManagementCard from "@/employee/components/post-management-card.component.vue";
import {HttpsService} from "@/shared/services/http.service";
export default {
  name: 'EmployeeDashboardPage',
  components: {
    PostManagementCard,
    LoadingSpinner
  },
  data() {
    return {
      httpService: new HttpsService(),
      currentPage: 1,
      itemsPerPage: 9,
      newCarPostDialog: false,
      posts: [],
      vehicles: [],
      vehicle_brands: [],
      employee_profiles: [],
      currencies : [],

      // New cars post dialog
      selectedBrand: null,
      selectedYear: null,
      modelName: null,
      selectedCurrency:null,
      selectedPrice: null,
      description: null,
    };
  },
  created() {
    this.httpService.getAll('vehicle-retail/vehicle-posts').then(response => {
      this.posts = response.data;
    }).catch(error => {console.log(error);});
    this.httpService.getAll('vehicle-retail/vehicle-brands').then(response => {
      this.vehicle_brands = response.data;
    }).catch(error => {console.log(error);});
    this.httpService.getAll('vehicle-retail/currencies').then(response => {
      this.currencies = response.data;
    }).catch(error => {console.log(error);});
    this.httpService.getAll('vehicle-retail/vehicles').then(response => {
      this.vehicles = response.data;
    }).catch(error => {console.log(error);});
  },
  methods: {
    calculateCurrentPageItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.posts.slice(startIndex, endIndex);
    },
    getVehicle(vehicleId){
      return this.vehicles.find(vehicle => vehicle.id === vehicleId);
    },
    getVehicleBrand(vehicleId){
      const vehicleBrandId = this.vehicles.find(vehicle => vehicle.id === vehicleId).brand.id;
      return this.vehicle_brands.find(vehicle_brand => vehicle_brand.id === vehicleBrandId);
    },
    getEmployeeProfile(employeeProfileId){
      return this.employee_profiles.find(employee_profile => employee_profile.id === employeeProfileId);
    },
    getCurrency(currencyId){
      return this.currencies.find(currency => currency.id === currencyId);
    },
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div v-if="posts">
      <div class="flex flex-col items-center gap-8 py-8">
        <Button @click="newCarPostDialog=true">Nueva publicación</Button>
        <div class="flex flex-wrap justify-center gap-12">
          <PostManagementCard
              v-for="post in calculateCurrentPageItems()"
              :post="post"
              :key="post.id"
              :vehicle=getVehicle(post.vehicle_id)
              :vehicleBrand=getVehicleBrand(post.vehicle_id)
              :employee_profile=getEmployeeProfile(post.created_by)
              :currency="getCurrency(post.currency_id)"
              :currencies = "this.currencies"
          />
        </div>
        <div class="flex gap-4">
          <Button @click="currentPage -= 1" :disabled="currentPage === 1" icon="pi pi-angle-left" outlined severity="info" />
          <Button @click="currentPage += 1" :disabled="currentPage === Math.ceil(posts.length / itemsPerPage)" icon="pi pi-angle-right" outlined severity="info" />
        </div>
      </div>
    </div>
    <div v-else>
      <LoadingSpinner />
    </div>
  </div>

  <Dialog v-model:visible="newCarPostDialog" header="Agregar carro" modal class="w-full md:w-1/3">
    <form class="grid gap-2">
      <p class="text-lg text-gray-400 font-medium">Todos los campos son obligatorios</p>
      <div class="grid w-full">
        <label class="text-sm">Vehículos</label>
        <Dropdown v-model="selectedCar" :options="vehicles" optionLabel="model" placeholder="Selecciona vehículo" class="w-full" />
      </div>
      <div class="flex gap-2">
        <div class="grid w-full">
          <label for="selectedCurrency" class="text-sm">Moneda</label>
          <Dropdown v-model="selectedCurrency" :options="currencies" optionLabel="symbol" placeholder="Selecciona moneda" class="w-full" />
        </div>
        <div class="grid w-full">
          <label for="selectedPrice" class="text-sm">Precio</label>
          <InputText id="selectedPrice" v-model="selectedPrice" aria-describedby="username-help" />
        </div>
      </div>
      <div class="grid w-full">
        <label for="description" class="text-sm">Descripción</label>
        <Textarea v-model="description" rows="5" cols="30" />
      </div>
      <Button type="submit" label="Publicar" class="w-full" />
    </form>
  </Dialog>
</template>