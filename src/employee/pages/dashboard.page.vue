<script>
import LoadingSpinner from '../../shared/components/loading-spinner.component.vue';
import PostManagementCard from "@/employee/components/post-management-card.component.vue";
export default {
  name: 'EmployeeDashboardPage',
  components: {
    PostManagementCard,
    LoadingSpinner
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      newCarPostDialog: false,
      posts: [
        {
          id: 1,
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          created_at: "2021-10-10",
          updated_at: "2021-10-10",
          created_by: 1,
          price: 20000,
          vehicle_id: 1,
          currency_id: 1, // 1 dollar 2 soles
        },
        {
          id: 2,
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          created_at: "2021-10-10",
          updated_at: "2021-10-10",
          created_by: 1,
          price: 20000,
          vehicle_id: 1,
          currency_id: 1, // 1 dollar 2 soles
        },
        {
          id: 3,
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          created_at: "2021-10-10",
          updated_at: "2021-10-10",
          created_by: 1,
          price: 20000,
          vehicle_id: 1,
          currency_id: 1, // 1 dollar 2 soles
        },
      ],
      vehicles: [
        {
          id: 1,
          model: "Modelo 1",
          manufacture_year: 2023,
          photo_url: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Nissan/X-Trail/3372/1666087743726/front-left-side-47.jpg",
          vehicle_brand_id: 1
        },
      ],
      vehicle_brands: [
        {
          id: 1,
          name: "Nissan",
        },
      ],
      employee_profiles: [
        {
          id: 1,
          first_name: "Juan",
          last_name: "Perez",
          business_email: "perez@gmail.com",
          organizational_users_id: 1,
          profile_url: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
        },
      ],
      currencies : [
        {
          id: 1,
          name: "Dolares",
          symbol: "US$"
        },
        {
          id: 2,
          name: "Soles",
          symbol: "S/"
        },
      ],

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
      const vehicleBrandId = this.vehicles.find(vehicle => vehicle.id === vehicleId).vehicle_brand_id;
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
              :vehicle_brands="this.vehicle_brands"
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