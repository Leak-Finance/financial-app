<script>
import {QueryService} from "@/customer/services/query.service";

export default {
  name: "HistoryPage",
  data() {
    return {
      queries: [],
      queryService: new QueryService(),
      quotasDialog: false,
      cronograma: [],
      moneda: null,

      tir: null,
      tcea: null,
      van: null,
    };
  },
  created() {
    this.queryService.getAllQueries().then(response => {
      this.queries = response.data.reverse();
    }).catch(error => {console.log(error);});
  },
  methods: {
    parseDate(date) {
      return date.split("T")[0];
    },
    showQuotas(json) {
      this.quotasDialog = true;
      this.moneda = json.moneda;
      this.cronograma = json.cronograma;
      this.tir = json.tir
      this.tcea = json.tcea
      this.van = json.van
    }
  }
}
</script>

<template>
  <div class="container mx-auto">
    <DataTable :value="queries" tableStyle="min-width: 50rem">
      <Column field="email" header="Email"></Column>
      <Column header="Fecha de consulta" >
        <template #body="slotProps">
          {{ parseDate(slotProps.data.createdAt) }}
        </template>
      </Column>
      <Column header="Vehículo" >
        <template #body="slotProps">
          {{ slotProps.data.json.selectedPost.vehicle.brand.name }} {{ slotProps.data.json.selectedPost.vehicle.model }} {{ slotProps.data.json.selectedPost.vehicle.manufactureYear }}
        </template>
      </Column>
      <Column header="Ver cuotas" >
        <template #body="slotProps">
          <Button icon="pi pi-calculator" severity="info" rounded aria-label="History"
                  @click="showQuotas(slotProps.data.json)"/>
        </template>
      </Column>
    </DataTable>
  </div>


  <Dialog v-model:visible="quotasDialog" modal
          :style="{ width: '90vw' }" :breakpoints="{ '1199px': '90vw', '575px': '90vw' }"
          header="Detalles de cuota"
          :draggable="false">
    <p class="font-bold">TIR: {{this.tir}}</p>
    <p class="font-bold">TCEA: {{this.tcea}}</p>
    <p class="font-bold">VAN: {{this.van}}</p>
    <DataTable :value="cronograma" tableStyle="min-width: 50rem">
      <Column field="idx" header="#" />
      <Column field="pg" header="Periodo Gracia" />
      <Column field="sicf" header="Saldo Inicial Cuota Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="icf" header="Interes Cuota Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="acf" header="Amortizacion Cuota Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="segDesCf" header="Seguro Desgravamen Cuota Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="sfcf" header="Saldo Final Cuota Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="si" header="Saldo Inicial" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="i" header="Interes" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="cuota" header="Cuota" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="a" header="Amortizacion" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="segDes" header="Seguro Desgravamen" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="gps" header="GPS" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="portes" header="Portes" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="gasAdm" header="Gastos de Administracion" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="segVe" header="Seguro Vehicular" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="sf" header="Saldo Final" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
      <Column field="flujo" header="Flujo" >
        <template #body="slotProps">
          {{ this.moneda.symbol }} {{ slotProps.data[slotProps.field] }}
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>
