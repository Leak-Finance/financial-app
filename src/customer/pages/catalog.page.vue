<script>
import {VehicleRetailService} from "@/shared/services/vehicle-retail.service";
import PostCatalogCard from "@/customer/components/post-catalog-card.component.vue";

export default {
  name: 'CatalogCustomersPage',
  components: { PostCatalogCard},
  data() {
    return {
      vehicleRetailService: new VehicleRetailService(),
      itemsPerPage: 9,
      currentPage: 1,
      posts: [],
      active : 0,
      selectedPost: null,
      selectedConfigurations: null,
      items: [
        {label: 'Seleciona un vehículo'},
        {label: 'Compra Inteligente'},
        {label: 'Solicita tu crédito'},
      ],
      compraInteligenteInfoDialog: false,

      // Forms
      currencies: [],
      tasas: [{id: 1, name: "Nominal"}, {id: 2, name: "Efectiva"}],
      plazosDeCredito: [{id: 1, cantidad: 24}, {id: 2, cantidad: 36}],
      tiposPeriodosDeGracia: [{id: 1, nombre: "Total"}, {id: 2, nombre: "Parcial"}],

      // Inputs for result
      moneda: null,
      cuotaInicial: null,
      tipoTasaInteres: null,
      tasaInteres: null,
      plazoCredito: null,
      tipoPeriodoGracia: null,
      periodoGracia: null,

      // Outputs
      detallesCuotasDialog: false,
    };
  },
  created() {
    this.vehicleRetailService.getAllVehiclePosts().then((response) => {
      this.posts = response.data;
    });
    this.vehicleRetailService.getAllCurrencies().then((response) => {
      this.currencies = response.data;
      console.log(this.currencies)
    });
  },
  methods:{
    calculateCurrentPageItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.posts.slice(startIndex, endIndex);
    },
    restart(){
      this.selectedPost = null;
      this.selectedConfigurations = null;
      this.active = 0;
    },
    selectCar(post) {
      this.selectedPost = post;
      this.active = 1;
    },
    calculateRecommendedPrice(price) {
      return "Recomendado 20% (" + this.selectedPost.currency.symbol + price * 0.2 + ")";
    },
    calculateCredit(){
      // TODO: Calculate credit
      const result = "TODO";
      this.selectedConfigurations = result;
    }
  }
}
</script>

<template>
  <div class="container mx-auto">
    <Steps v-model:activeStep="active" :model="items" />

    <!-- Step 1: Select a car -->
    <div v-if="!selectedPost" class="flex flex-col items-center gap-8 py-8">
      <div v-if="posts.length > 0" class="flex flex-wrap justify-center gap-12">
        <PostCatalogCard
            v-for="post in calculateCurrentPageItems()"
            :post="post"
            :key="post.id"
            :isSelected = false
            @select="selectCar(post)"
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

    <!-- Step 2: -->
    <div v-if="selectedPost">
      <div class="w-full p-6 my-6 grid gap-4">
        <div class="flex gap-4 items-center">
          <Button icon="pi pi-arrow-left" text rounded aria-label="Filter" @click="restart" />
          <p class=" font-medium text-primary">Crédito vehicular con Compra Inteligente</p>
          <Button icon="pi pi-question-circle" text rounded aria-label="Filter" @click="compraInteligenteInfoDialog = true" />
        </div>
        <div class="grid md:grid-cols-2 gap-6 w-full">
          <div class="gap-2">
            <img :src="selectedPost.vehicle.photoUrl" alt="car" class="w-full">
            <div class="flex gap-4 justify-between p-4 items-end border">
              <div>
                <p class="text-sm uppercase font-bold text-secondary">{{selectedPost.vehicle.brand.name}}</p>
                <p class="text-xl font-medium">
                  {{selectedPost.vehicle.brand.name}}&nbsp;{{ selectedPost.vehicle.model }}&nbsp;{{ selectedPost.vehicle.manufactureYear }}
                </p>
              </div>
              <div>
                <p class="font-bold text-xl text-primary">{{ selectedPost.currency.symbol }} {{ selectedPost.price }}</p>
              </div>
            </div>
          </div>
          <!-- FORM -->
          <form v-if="selectedConfigurations === null"
              class="border p-6 w-full grid gap-6" @submit.prevent="calculateCredit">
            <p class="text-2xl font-medium text-primary">Precio de venta: {{ selectedPost.currency.symbol }} {{ selectedPost.price }}</p>
            <div class="grid gap-2">
              <p class="font-medium text-secondary">1. Selecciona moneda y cuota inicial</p>
              <div class="grid md:flex md:gap-6 gap-2">
                <div class="grid w-full">
                  <label class="text-sm">Moneda</label>
                  <Dropdown v-model="moneda"
                            :options="currencies" optionLabel="symbol" placeholder="Selecciona moneda" class="w-full" />
                </div>
                <div class="grid w-full">
                  <label class="text-sm">Cuota Inicial</label>
                  <InputText v-model="cuotaInicial"
                             aria-describedby="username-help" :placeholder="calculateRecommendedPrice(selectedPost.price)" />
                </div>
              </div>
            </div>
            <div class="grid gap-2">
              <p class="font-medium text-secondary">2. Tasas de interés</p>
              <div class="grid md:flex md:gap-6 gap-2">
                <div class="grid w-full">
                  <label class="text-sm">Tipo de tasa</label>
                  <Dropdown v-model="moneda" :options="tasas"
                            optionLabel="name" placeholder="Selecciona tipo de tasa" class="w-full" />
                </div>
                <div class="grid w-full">
                  <label class="text-sm">Tasa de interés</label>
                  <InputText v-model="tasaInteres"
                             aria-describedby="username-help" />
                </div>
              </div>
            </div>
            lilitest@gmail.com<div class="grid gap-2">
              <p class="font-medium text-secondary">3. Plazo de crédito</p>
              <div class="grid md:flex md:gap-6 gap-2">
                <div class="grid">
                  <label class="text-sm">Plazo de crédito</label>
                  <Dropdown v-model="plazoCredito"
                            :options="plazosDeCredito"
                            optionLabel="cantidad" placeholder="Selecciona plazo de créditos" class="w-full" />
                </div>
              </div>
            </div>
            <div class="grid gap-2">
              <p class="font-medium text-secondary">4. Periodos de gracia</p>
              <div class="grid md:flex md:gap-6 gap-2">
                <div class="grid w-full">
                  <label class="text-sm">Tipo de periodo de gracia</label>
                  <Dropdown v-model="tipoPeriodoGracia"
                            :options="tiposPeriodosDeGracia"
                            optionLabel="nombre" placeholder="Selecciona tipo de periodo de gracia" class="w-full" />
                </div>
                <div class="grid w-full">
                  <label class="text-sm">Periodos de gracia (meses)</label>
                  <InputText v-model="periodoGracia"
                             aria-describedby="username-help" />
                </div>
              </div>
            </div>
            <Button type="submit" label="Continuar" class="w-full md:w-1/2"  />
          </form>


          <!-- Step 3 -->
          <div v-if="selectedConfigurations"
               class="border w-full gap-6 p-6">
            TODO: RESULTS

            <div class="flex gap-4">
              <Button label="Detalles" class="w-full" @click="detallesCuotas = true"/>
              <Button label="Solicitar" class="w-full" severity="success" @click="detallesCuotas = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <Dialog v-model:visible="detallesCuotasDialog" modal
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          header="Detalles de cuota" >
    TODO: Cuadro de cuotas

  </Dialog>



  <Dialog v-model:visible="compraInteligenteInfoDialog" modal
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          header="¿Qué es Compra Inteligente?" >
    <div class="grid gap-4 text-lg">
      <p>
        Compra Inteligente es un tipo de crédito vehicular que, en este caso, estamos trabajando con los parámetros del Banco de Crédito del Perú (BCP).
        Luego de cancelar una cuota inicial (recomendado: 20%), durante los siguientes 24 o 36 meses (de acuerdo al plazo pactado) se pagará una cuota mensual
        por el capital de 40-30%* sobre el valor del auto más los intereses del monto total financiado. El valor de la última cuota será de 35-50% del precio del auto.
      </p>
      <p>
        Entre las condiciones básicas de su banco para la emisión de un crédito vehicular de tipo Compra Inteligente son:
      </p>
      <ul>
        <li>•Se debe tener un ingreso mensual bruto mínimo de S/ 1,500.</li>
        <li>•Se debe afiliarse a un seguro vehicular durante el plazo total del crédito.</li>
        <li>•Se debe tener un buen historial de comportamiento de pago en el BCP y sistemas financieros.</li>
        <li>•No se debe contar con multas de últimos procesos electorales.</li>
      </ul>
      <p>
        Para mayor detalle de Compra Inteligente vista la página oficial de BCP sobre:<br>
        <span class="font-bold text-secondary underline">
          <a href="https://www.viabcp.com/creditos/credito-vehicular/compra-inteligente" target="_blank">
            Crédito Vehicular Inteligente BCP
          </a>
        </span>
      </p>
    </div>
  </Dialog>
</template>