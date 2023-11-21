<script>
import {VehicleRetailService} from "@/shared/services/vehicle-retail.service";
import PostCatalogCard from "@/customer/components/post-catalog-card.component.vue";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional


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
      tiposPeriodosDeGracia: [{id: 1, nombre: "Sin periodo"},{id: 2, nombre: "Total"}, {id: 3, nombre: "Parcial"}],

      // Inputs for result
      moneda: null,
      cuotaInicial: null,
      tipoTasaInteres: null,
      tasaInteres: null,
      plazoCredito: null,
      tipoPeriodoGracia: null,
      periodoGracia: null,
      valorVehiculo: null,
      cronograma: [],
      tir: null,
      tcea: null,
      van: null,
      calculateComplete: false,
      cronogramaPagosIsVisible: false,
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
    calculateCredit(){

      // CONSTANTES

      const DIAS_ANIO = 360
      const DIAS_MES = 30
      const CUOTAS_POR_ANIO = 12

      // INPUT

      const valorVehiculo = this.valorVehiculo
      const tipoPlanPago = this.plazoCredito.id - 1
      let tipoPeriodoGracia = 'S';
      switch (this.tipoPeriodoGracia.id) {
        case 2:
          tipoPeriodoGracia = 'T'
          break
        case 3:
          tipoPeriodoGracia = 'P'
          break
      }
      const anios = (tipoPlanPago == 0) ? 2 : 3

      const nPeriodoGracia = this.periodoGracia;

      const pCuotaInicial = 0.20 // Porcentaje de cuota inicial (Recomendado: 20%)
      const pCuotaFinal = (tipoPlanPago == 1) ? 0.40 : 0.50 // 24 meses : 50% , 36 meses = 40%
      const cuotaInicial = this.cuotaInicial

      const pTasa = this.tasaInteres / 100 // Porcentaje de Tasa de Interes
      const tipoTasa = this.tipoTasaInteres.id - 1 // 0: TNA, 1 : TEA

      const tipoPeriodo = 0 // 0: diaria, 1: mensual

      const pSeguroDesgravamen = 0.00049
      const pSeguroVehicularAnual = 0.00029
      //const pSeguroVehicularAnual = 0.0472

      const tasaCostoOportunidad = 0.50

      // Convertidores de Tasa

      function convertirTNAaTEA(tasa, tipoPeriodo) {

        if(tipoPeriodo == 0)
          return Math.pow(1 + tasa/(DIAS_ANIO/1),DIAS_ANIO/1) - 1

        return Math.pow(1 + tasa/(DIAS_ANIO/30),DIAS_ANIO/30) - 1
      }

      function calcularTEM(tea) {
        return ((1 + tea) ** (DIAS_MES/DIAS_ANIO)) - 1
      }

// CALCULOS

      const nTotalCuotas = anios * CUOTAS_POR_ANIO
      const cuotaFinal = valorVehiculo * pCuotaFinal
      const montoPrestamo = valorVehiculo - cuotaInicial
      const TEA = (tipoPeriodo == 0) ? convertirTNAaTEA(pTasa,tipoPeriodo) : pTasa
      const TEM = calcularTEM(TEA)

// Cronograma

      const saldoInicialCuotaRegular = montoPrestamo - cuotaFinal/(1 + TEM) ** (nTotalCuotas + 1)
      const saldoInicialCuotaFinal = (cuotaFinal/(1 + TEM)**(nTotalCuotas + 1))

// Tasas de seguros

      const tasaPeriodoSeguroDesgravamen = pSeguroDesgravamen * 12/365 * DIAS_MES
      const seguroVehicularMensual = pSeguroVehicularAnual * 12/365 * DIAS_MES * valorVehiculo

// Periodo Gracia

      let nCroPeriodoGracia = nPeriodoGracia

// Cuota Final

      let croSaldoInicialCuotaFinal = saldoInicialCuotaFinal
      let crosaldoFinalCuotaFinal = 0
      let croInteresCuotaFinal = 0
      let croAmortizacionCuotaFinal = 0
      let croSeguroDesgravamenCuotaFinal = 0

// Cuota Regular

      let croSaldoInicialCuotaRegular = saldoInicialCuotaRegular
      let croInteresCuotaRegular = 0
      let croSeguroDesgravamenCuotaRegular = 0
      let croAmortizacionCuotaRegular = 0;
      let croCuotaRegular = 0
      let croSaldoFinalCuotaRegular = 0

// Flujo

      let croFlujo = 0


// Calculo de cuota


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

      function calcularCuotaRegular(saldo) {
        if(tipoPeriodoGracia == 'S')
          return saldo * (TEM + tasaPeriodoSeguroDesgravamen)/(1 - (1 + TEM + tasaPeriodoSeguroDesgravamen) ** -nTotalCuotas) + seguroVehicularMensual

        return saldo * (TEM + tasaPeriodoSeguroDesgravamen)/(1 - (1 + TEM + tasaPeriodoSeguroDesgravamen) ** ((nTotalCuotas - nPeriodoGracia) * -1)) + seguroVehicularMensual
      }

      let cronogramaPagos = []
      let flujos = []

      flujos.push(montoPrestamo * -1)

// Calculo de Cuota

      let check = false

      for(let i = 1; i <= nTotalCuotas + 1; i++) {

        // Cuota
        if(!check) {
          if(tipoPeriodoGracia == 'S') {
            croCuotaRegular = calcularCuotaRegular(croSaldoInicialCuotaRegular)
            check = true
          }
        }

        // Cuota Final

        croSeguroDesgravamenCuotaFinal = pSeguroDesgravamen * croSaldoInicialCuotaFinal
        croInteresCuotaFinal = croSaldoInicialCuotaFinal * TEM

        if(i == nTotalCuotas + 1)
          croAmortizacionCuotaFinal = cuotaFinal

        crosaldoFinalCuotaFinal = croSaldoInicialCuotaFinal + croInteresCuotaFinal - croAmortizacionCuotaFinal

        // Cuota Regular

        croInteresCuotaRegular = croSaldoInicialCuotaRegular * TEM
        croSeguroDesgravamenCuotaRegular = croSaldoInicialCuotaRegular * tasaPeriodoSeguroDesgravamen
        croAmortizacionCuotaRegular = croCuotaRegular -  croInteresCuotaRegular - (croSeguroDesgravamenCuotaRegular + seguroVehicularMensual)
        croSaldoFinalCuotaRegular = croSaldoInicialCuotaRegular - croAmortizacionCuotaRegular

        croFlujo = croCuotaRegular



        if(i == nTotalCuotas + 1) {

          croCuotaRegular = 0
          croInteresCuotaRegular = 0
          croAmortizacionCuotaRegular = 0
          croSaldoInicialCuotaRegular = 0
          croSeguroDesgravamenCuotaRegular = 0
          croSaldoFinalCuotaRegular = 0
          croFlujo = croAmortizacionCuotaFinal + seguroVehicularMensual + croSeguroDesgravamenCuotaFinal
        }

        flujos.push(croFlujo)
        const pp = new PagoPeriodo(
            i,
            tipoPeriodoGracia,
            croSaldoInicialCuotaFinal.toFixed(2),
            croInteresCuotaFinal.toFixed(2),
            croAmortizacionCuotaFinal.toFixed(2),
            croSeguroDesgravamenCuotaFinal.toFixed(2),
            crosaldoFinalCuotaFinal.toFixed(2),
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

        // Actualizar Cuotas iniciales
        croSaldoInicialCuotaFinal = crosaldoFinalCuotaFinal
        croSaldoInicialCuotaRegular = croSaldoFinalCuotaRegular
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

      let seguroDesg = 0
      let saldo = valorVehiculo - cuotaInicial;

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
                <p class="text-2xl font-medium text-primary">{{ van }}</p>
              </div>
            </div>

            <DataTable v-if="cronogramaPagosIsVisible" :value="cronograma" tableStyle="min-width: 50rem">
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

            <div class="flex gap-4">
              <Button label="Detalles" class="w-full" @click="cronogramaPagosIsVisible = !cronogramaPagosIsVisible"/>
              <Button label="Solicitar" class="w-full" severity="success" @click="detallesCuotasDialog = true"/>
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