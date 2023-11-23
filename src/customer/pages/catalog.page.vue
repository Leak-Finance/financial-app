<script>
import {VehicleRetailService} from "@/shared/services/vehicle-retail.service";
import PostCatalogCard from "@/customer/components/post-catalog-card.component.vue";

import {QueryService} from "@/customer/services/query.service";                   // optional


export default {
  name: 'CatalogCustomersPage',
  components: { PostCatalogCard},
  data() {
    return {
      vehicleRetailService: new VehicleRetailService(),
      queryService: new QueryService(),
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
      tiposPeriodosDeGracia: [{id: 1, nombre: "Sin periodo"},{id: 2, nombre: "Total"}, {id: 3, nombre: "Parcial"}],

      // Inputs for result
      moneda: null,
      cuotaInicial: null,
      tipoTasaInteres: null,
      tasaInteres: null,
      plazoCredito: null,
      tipoPeriodoGracia: null,
      periodoGracia: 0,
      valorVehiculo: null,
      cronograma: [],
      tir: null,
      tcea: null,
      van: null,
      calculateComplete: false,
      cronogramaPagosIsVisible: true,
      // Outputs
      detallesCuotasDialog: false,
      pagoInicial: null,
    };
  },
  created() {
    this.vehicleRetailService.getAllVehiclePosts().then((response) => {
      this.posts = response.data;
    });
    this.vehicleRetailService.getAllCurrencies().then((response) => {
      this.currencies = response.data;
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
      this.valorVehiculo = post.price;
      this.active = 1;
    },
    calculateRecommendedPrice(price) {
      return "Recomendado 20% (" + this.selectedPost.currency.symbol + price * 0.2 + ")";
    },
    solicite() {
      const email = localStorage.getItem("userEmail");
      const query = {
        selectedPost: this.selectedPost,
        moneda: this.moneda,
        cuotaInicial: this.cuotaInicial,
        tipoTasaInteres: this.tipoTasaInteres,
        tasaInteres: this.tasaInteres,
        plazoCredito: this.plazoCredito,
        tipoPeriodoGracia: this.tipoPeriodoGracia,
        periodoGracia: this.periodoGracia,
        valorVehiculo: this.valorVehiculo,
      }
      this.queryService.createQuerie(email, query).then((response) => {
        this.$toast.add({
          severity: "success",
          summary: "Solicitud enviada",
          detail: "Su solicitud ha sido enviada con éxito",
          life: 3000,
        });
      });
    },
    calculateCredit(){

      // Algoritmo de Planes de Pago - Ordinarios - Compra Inteligente

      // Clases

      class PagoPeriodo {
        constructor(idx, pg, sicf, icf, acf, segDesCf, sfcf, si, i, cuota, a, segDes, segVe, sf, flujo) {
          this.idx = idx,
              this.pg = pg,
              this.sicf = sicf,
              this.icf = icf,
              this.acf = acf,
              this.segDesCf = segDesCf,
              this.sfcf = sfcf,
              this.si = si,
              this.i = i,
              this.cuota = cuota,
              this.a = a,
              this.segDes = segDes,
              this.segVe = segVe,
              this.sf = sf,
              this.flujo = flujo
        }
        imprimir() {
          console.log(this.pg, this.sicf, this.icf, this.acf, this.segDesCf, this.sfcf, this.si, this.i, this.cuota, this.a, this.segDes, this.segVe, this.sf, this.flujo)
        }
      }


      // Constants

      const DIAS_ANIO = 360
      const DIAS_MES = 30
      const CUOTAS_POR_ANIO = 12
      const SEGURO_DESGRAVAMEN = 0.00049
      const SEGURO_VEHICULAR = 0.00029

      // Input

      let precioVehiculo = this.valorVehiculo
      let valorCuotaInicial = this.cuotaInicial
      let tipoPlanPago = this.plazoCredito.id - 1
      let tipoPeriodoGracia = getTipoPeriodoGracia(this.tipoPeriodoGracia.id)
      let nPeriodoGracia = this.periodoGracia
      let tasa = this.tasaInteres / 100
      let tipoTasa = this.tipoTasaInteres.id - 1
      let capitalizacion = "Diaria"
      let tasaCostoOportunidad = 0.5

      // Process

      const aniosPlazoPago = getAniosPlazoPago(tipoPlanPago)
      const pCuotaInicial = getPorcentajeCuotaInicial(precioVehiculo, valorCuotaInicial)
      const pCuotaFinal = getPorcentajeCuotaFinal(tipoPlanPago)

      const nTotalCuotas = aniosPlazoPago * CUOTAS_POR_ANIO
      const cuotaInicial = precioVehiculo * pCuotaInicial

      const cuotaFinal = precioVehiculo * pCuotaFinal
      const montoPrestamo = precioVehiculo - cuotaInicial

      const TEA = calcularTEA(tasa, tipoTasa, capitalizacion)
      const TEM = calcularTEM(parseFloat(TEA))

      const tasaPeriodoSeguroDesgravamen = SEGURO_DESGRAVAMEN * 12/360 * DIAS_MES
      const seguroVehicularMensual = SEGURO_VEHICULAR * 12/360 * DIAS_MES * precioVehiculo

      const saldoInicialCuotaFinal = (cuotaFinal/(1 + TEM + SEGURO_DESGRAVAMEN)**(nTotalCuotas + 1))
      const saldoInicialCuotaRegular = montoPrestamo - (cuotaFinal/((1 + TEM + SEGURO_DESGRAVAMEN)**(nTotalCuotas + 1)))

      console.log("TEA:",TEA)
      console.log("TEM:", TEM )
      console.log("Cuota final", cuotaFinal)
      console.log("Cuota inicial", cuotaInicial)
      console.log("N°Cuotas por Anio:", CUOTAS_POR_ANIO)
      console.log("N° total de cuotas:", nTotalCuotas)
      console.log("Monto del Prestamo:", montoPrestamo)
      console.log("Saldo Inicial Cuota Final", saldoInicialCuotaFinal)
      console.log("Saldo Inicial Cuota Regular", saldoInicialCuotaRegular)
      // Cronograma - Cuota Final

      let croSaldoInicialCuotaFinal = saldoInicialCuotaFinal
      let croSaldoFinalCuotaFinal = 0
      let croInteresCuotaFinal = 0
      let croAmortizacionCuotaFinal = 0
      let croSeguroDesgravamenCuotaFinal = 0

      // Cronograma - Cuota Regular

      let croSaldoInicialCuotaRegular = saldoInicialCuotaRegular
      let croInteresCuotaRegular = 0
      let croSeguroDesgravamenCuotaRegular = 0
      let croAmortizacionCuotaRegular = 0;
      let croCuotaRegular = 0
      let croSaldoFinalCuotaRegular = 0

      let flujos = []
      let croFlujo = 0
      let check = false;
      flujos.push(montoPrestamo * -1)

      for(let i = 1; i <= nTotalCuotas + 1; i++) {

        // Cuota Final
        croSeguroDesgravamenCuotaFinal = tasaPeriodoSeguroDesgravamen * croSaldoInicialCuotaFinal
        croInteresCuotaFinal = croSaldoInicialCuotaFinal * TEM

        if(i === nTotalCuotas + 1) {
          croAmortizacionCuotaFinal = croSaldoInicialCuotaFinal + croInteresCuotaFinal + croSeguroDesgravamenCuotaFinal

        }

        croSaldoFinalCuotaFinal = croSaldoInicialCuotaFinal + croInteresCuotaFinal + croSeguroDesgravamenCuotaFinal - croAmortizacionCuotaFinal

        // Cuota Regular
        croInteresCuotaRegular = croSaldoInicialCuotaRegular * TEM

        if(!check) {
          if(tipoPeriodoGracia === 'S'){
            croCuotaRegular = croSaldoInicialCuotaRegular * (TEM + tasaPeriodoSeguroDesgravamen)/(1 - (1 + TEM + tasaPeriodoSeguroDesgravamen) ** -((nTotalCuotas - (i - 1)))) + seguroVehicularMensual
            check = true
          } else if(tipoPeriodoGracia === 'P'){
            croCuotaRegular = croInteresCuotaRegular
          }
          else{
            croCuotaRegular = 0
          }
        }

        croSeguroDesgravamenCuotaRegular = croSaldoInicialCuotaRegular * tasaPeriodoSeguroDesgravamen

        if(tipoPeriodoGracia === 'S') {
          croAmortizacionCuotaRegular = croCuotaRegular -  croInteresCuotaRegular - croSeguroDesgravamenCuotaRegular - seguroVehicularMensual
        }

        if(tipoPeriodoGracia === 'T') {
          croSaldoFinalCuotaRegular = croSaldoInicialCuotaRegular + croInteresCuotaRegular
        } else {
          croSaldoFinalCuotaRegular = croSaldoInicialCuotaRegular - croAmortizacionCuotaRegular
        }

        if(i === nTotalCuotas + 1) {
          croCuotaRegular = 0
          croInteresCuotaRegular = 0
          croAmortizacionCuotaRegular = 0
          croSaldoInicialCuotaRegular = 0
          croSeguroDesgravamenCuotaRegular = 0
          croSaldoFinalCuotaRegular = 0
        }

        croFlujo = croCuotaRegular + croAmortizacionCuotaFinal

        if(tipoPeriodoGracia === 'T' || tipoPeriodoGracia === 'P' || i === nTotalCuotas + 1 ) {
          croFlujo += croSeguroDesgravamenCuotaRegular + croSeguroDesgravamenCuotaFinal + seguroVehicularMensual
        }

        flujos.push(croFlujo)
        const pp = new PagoPeriodo(
            i,
            tipoPeriodoGracia,
            croSaldoInicialCuotaFinal.toFixed(2),
            croInteresCuotaFinal.toFixed(2),
            croAmortizacionCuotaFinal.toFixed(2),
            croSeguroDesgravamenCuotaFinal.toFixed(2),
            croSaldoFinalCuotaFinal.toFixed(2),
            croSaldoInicialCuotaRegular.toFixed(2),
            croInteresCuotaRegular.toFixed(2),
            croCuotaRegular.toFixed(2),
            croAmortizacionCuotaRegular.toFixed(2),
            croSeguroDesgravamenCuotaRegular.toFixed(2),
            seguroVehicularMensual.toFixed(2),
            croSaldoFinalCuotaRegular.toFixed(2),
            croFlujo.toFixed(2)
        )
        this.cronograma.push(pp)
        pp.imprimir()


        if(nPeriodoGracia - i === 0)
          tipoPeriodoGracia = 'S'

        // Actualizar Cuotas iniciales
        croSaldoInicialCuotaFinal = croSaldoFinalCuotaFinal
        croSaldoInicialCuotaRegular = croSaldoFinalCuotaRegular
      }

      // Obtener el número de años de plazo de pago
      function getAniosPlazoPago(tipo) {
        // Verifica que tipo de plazo de pago es
        if (tipo === 1)
          return 3

        return 2
      }

      // Obtener porcentaje de Cuota inicial
      function getPorcentajeCuotaInicial(valorVehiculo, cuotaInicial) {

        // Porcentaje de cuota inicial (Recomendado: 20%)
        return cuotaInicial / valorVehiculo
      }

      // Obtener porcentaje para la Cuota Final
      function getPorcentajeCuotaFinal(tipoPlanPago) {

        // 24 meses : 50% , 36 meses = 40%
        if (tipoPlanPago === 1)
          return 0.4

        return 0.5
      }

      // Obtener tipo de Periodo de Gracia
      function getTipoPeriodoGracia(tipoPeriodo) {
        if(tipoPeriodo === 1)
          return 'S'
        else if(tipoPeriodo === 2)
          return 'T'
        else
          return 'P'
      }

      // Obtener TEA a partir de TNA
      function convertirTNAaTEA(tasa, capitalizacion) {

        if(capitalizacion === "Diaria")
          return Math.pow(1 + tasa/(DIAS_ANIO),DIAS_ANIO) - 1
        else if(capitalizacion === "Quincenal")
          return Math.pow(1 + tasa/(DIAS_ANIO/15),DIAS_ANIO/15) - 1
        else
          return Math.pow(1 + tasa/(DIAS_ANIO/30),DIAS_ANIO/30) - 1
      }
      // Calcular la Tasa Efectiva Anual (TEA)
      function calcularTEA(tasa, tipoTasa, capitalizacion) {

        // Verifica si es una Tasa nominal
        if(tipoTasa === 0)
          return convertirTNAaTEA(tasa, capitalizacion)

        // Si no lo es solo retorna la tasa, ya que se entiende que es una tasa efectiva
        return tasa
      }
      // Calcular la Tasa Efectiva Mensual
      function calcularTEM(tea) {
        return Math.pow(1 + tea, DIAS_MES/DIAS_ANIO) - 1
      }

      // Formula para el TIR
      function IRR(values, guess) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Calculates the resulting amount
        var irrResult = function(values, dates, rate) {
          var r = rate + 1;
          var result = values[0];
          for (var i = 1; i < values.length; i++) {
            result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 360);
          }
          return result;
        }

        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
          var r = rate + 1;
          var result = 0;
          for (var i = 1; i < values.length; i++) {
            var frac = (dates[i] - dates[0]) / 360;
            result -= frac * values[i] / Math.pow(r, frac + 1);
          }
          return result;
        }

        // Initialize dates and check that values contains at least one positive value and one negative value
        var dates = [];
        var positive = false;
        var negative = false;
        for (var i = 0; i < values.length; i++) {
          dates[i] = (i === 0) ? 0 : dates[i - 1] + 360;
          if (values[i] > 0) positive = true;
          if (values[i] < 0) negative = true;
        }

        // Return error if values does not contain at least one positive value and one negative value
        if (!positive || !negative) return '#NUM!';

        // Initialize guess and resultRate
        var guess = (typeof guess === 'undefined') ? 0.1 : guess;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Set maximum number of iterations
        var iterMax = 50;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var iteration = 0;
        var contLoop = true;
        do {
          resultValue = irrResult(values, dates, resultRate);
          newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
          epsRate = Math.abs(newRate - resultRate);
          resultRate = newRate;
          contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while(contLoop && (++iteration < iterMax));

        if(contLoop) return '#NUM!';

        // Return internal rate of return
        return resultRate;
      }

      const NPV = (cashflow, discountRate) => cashflow
          .reduce((acc, val, i) => acc + val / Math.pow((1 + discountRate), i), 0);

      const tasaDescuento = (1 + tasaCostoOportunidad) ** (DIAS_MES/DIAS_ANIO) - 1
      const TIR = IRR(flujos, 0.01)

      const TCEA = (1 + TIR) ** (DIAS_ANIO/DIAS_MES) - 1
      const VAN = NPV(flujos, tasaDescuento) * -1

      this.van = VAN.toFixed(2)
      this.tcea = (TCEA * 100).toFixed(2) + "%"
      this.tir = (TIR * 100).toFixed(2) + "%"
      const result = "TODO"
      this.selectedConfigurations = result;
      this.calculateComplete = true;
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
                  <Dropdown v-model="tipoTasaInteres" :options="tasas"
                            optionLabel="name" placeholder="Selecciona tipo de tasa" class="w-full" />
                </div>
                <div class="grid w-full">
                  <label class="text-sm">Tasa de interés</label>
                  <InputText v-model="tasaInteres"
                             aria-describedby="username-help" />
                </div>
              </div>
            </div>
            <div class="grid gap-2">
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
               class="border w-full gap-6 p-6 flex flex-col justify-between ">
            <div>
              <div v-if="calculateComplete" class="grid md:grid-cols-3 gap-4">
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Tasa Interna de Retorno (TIR)</p>
                  <p class="text-2xl font-medium text-primary">{{ tir }}</p>
                </div>
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Tasa de Costo Efectiva Anual (TCEA)</p>
                  <p class="text-2xl font-medium text-primary">{{ tcea }}</p>
                </div>
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Valor Actual Neto (VAN)</p>
                  <p class="text-2xl font-medium text-primary">{{ van }} {{moneda.name}}</p>
                </div>
              </div>
              <div v-if="calculateComplete" class="grid md:grid-cols-3 gap-4 my-5">
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Precio de venta ({{ moneda.symbol}})</p>
                  <p class="text-2xl font-medium text-primary">{{ `${selectedPost.price}`}}</p>
                </div>
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Pago inicial ({{ moneda.symbol}})</p>
                  <p class="text-2xl font-medium text-primary">{{ this.cuotaInicial }}</p>
                </div>
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Financiando ({{ moneda.symbol}})</p>
                  <p class="text-2xl font-medium text-primary">{{ `${valorVehiculo - cuotaInicial}` }}</p>
                </div>
              </div>
              <div v-if="calculateComplete" class="grid md:grid-cols-3 gap-4 my-5">
                <div class="grid gap-2">
                  <p class="font-medium text-secondary">Cuota regular ({{ moneda.symbol}})</p>
                  <p class="text-2xl font-medium text-primary">{{ `${cronograma[this.periodoGracia + 1].cuota}` }}</p>
                </div>
              </div>
            </div>



            <div class="flex gap-4">
              <Button label="Detalles" class="w-full" @click="detallesCuotasDialog = true"/>
              <Button label="Solicitar" class="w-full" severity="success" @click="solicite()"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <Dialog v-model:visible="detallesCuotasDialog" modal
          :style="{ width: '90vw' }" :breakpoints="{ '1199px': '90vw', '575px': '90vw' }"
          header="Detalles de cuota"
  :draggable="false">
    <DataTable :value="cronograma" tableStyle="min-width: 50rem">
      <Column field="idx" header="#" />
      <Column field="pg" header="Periodo Gracia" />
      <Column field="sicf" header="Saldo Inicial Cuota Final" />
      <Column field="icf" header="Interes Cuota Final" />
      <Column field="acf" header="Amortizacion Cuota Final" />
      <Column field="segDesCf" header="Seguro Desgravamen Cuota Final" />
      <Column field="sfcf" header="Saldo Final Cuota Final" />
      <Column field="si" header="Saldo Inicial" />
      <Column field="i" header="Interes" />
      <Column field="cuota" header="Cuota" />
      <Column field="a" header="Amortizacion" />
      <Column field="segDes" header="Seguro Desgravamen" />
      <Column field="segVe" header="Seguro Vehicular" />
      <Column field="sf" header="Saldo Final" />
      <Column field="flujo" header="Flujo" />
    </DataTable>

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