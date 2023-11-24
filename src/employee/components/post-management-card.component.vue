<script>
import {VehicleRetailService} from "@/shared/services/vehicle-retail.service";

export default {
  name: 'PostManagementCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
    // Employee profile
    employee_profile: {
      type: Object,
      required: true,
    },

    // For editing
    currencies : {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      detailsDialogVisible: false,
      editDialogVisible:false,
      deleteDialogVisible:false,
      vehicleRetailService: new VehicleRetailService(),

      errorMessage: '',

      // Fields to edit
      editSelectedCurrency:this.post.currency,
      ediSelectedPrice: this.post.price,
      editDescription: this.post.description
    };
  },
  methods: {
    deletePost(){
      this.vehicleRetailService.deleteVehiclePost(this.post.id).then(response => {
        this.$toast.add({
          severity: "success",
          summary: "Éxito",
          detail: `${response.data.message}. Publicación eliminada correctamente`,
          life: 3000
        });
      }).catch(error => {
        this.$toast.add({
          severity: "success",
          summary: "Error",
          detail: `Se produjo un error ${error.data.message}`,
          life: 3000
        });
      });

      this.deleteDialogVisible=false;
    },
    editPost(){
      const updatedVehiclePost = {
        description: this.editDescription,
        price: this.ediSelectedPrice,
        vehicleId: this.post.vehicle.id,
        currencyId: this.editSelectedCurrency.id
      }
      this.vehicleRetailService.updateVehiclePost(this.post.id, updatedVehiclePost).then(response => {
        this.$emit('refresh-posts');
        this.$toast.add({
          severity: "success",
          summary: "Éxito",
          detail: `${response.data.message}. Publicación editada correctamente`,
          life: 3000
        });
        this.editDialogVisible=false;
      }).catch(error => {
        console.log(this.post.id)
        this.errorMessage = error.response.data.message[0];
      });
    },
    cancelChanges(){
      this.editDialogVisible=false;
      this.editSelectedCurrency = this.post.currency;
      this.ediSelectedPrice =  this.post.price;
      this.editDescription =  this.post.description;
    }
  },
  computed: {
    truncatedModel() {
      const maxWords = 5;
      const model = this.post.vehicle.model || '';
      const words = model.split(' ');
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
      } else {
        return model;
      }
    },
    truncatedDescription() {
      const maxWords = 12;
      const description = this.post.description || '';
      const words = description.split(' ');
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
      } else {
        return description;
      }
    },
  },
}
</script>

<template>
  <div class="border rounded h-[400px] w-[400px] hover:cursor-pointer hover:border-tertiary duration-200 relative">
    <div @click="detailsDialogVisible=true">
      <img class="w-full h-48 object-cover" :src="post.vehicle.photoUrl" :alt="post.vehicle.model">
      <div class="w-full grid px-6 pt-6 pb-2 gap-1">
        <div class="flex justify-between items-end gap-4">
          <div>
            <p class="uppercase font-bold text-primary text-sm">
              {{post.vehicle.brand.name}}
            </p>
            <p class="text-lg whitespace-normal">
              <span>{{truncatedModel}} {{post.vehicle.manufactureYear}}</span>
            </p>
          </div>
          <p class="font-bold text-tertiary text-2xl">
            {{ post.currency.symbol }}{{post.price }}
          </p>
        </div>
        <p>{{ truncatedDescription }}</p>
      </div>
    </div>
    <div class="flex gap-2 justify-center absolute bottom-4 left-0 right-0">
      <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="deleteDialogVisible=true" />
      <Button icon="pi pi-pencil" severity="info" aria-label="Edit" @click="editDialogVisible=true" />
    </div>
  </div>


  <Dialog v-model:visible="editDialogVisible" modal :header=post.vehicle.model
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <form class="grid gap-2" @submit.prevent="editPost">
      <p class="text-lg text-gray-400 font-medium">Editar publicación</p>
      <div class="flex gap-2">
        <div class="grid w-full">
          <label class="text-sm">Moneda</label>
          <Dropdown v-model="editSelectedCurrency" :options="currencies" optionLabel="symbol" placeholder="Selecciona moneda" class="w-full" />
        </div>
        <div class="grid w-full">
          <label class="text-sm">Precio</label>
          <InputText v-model="ediSelectedPrice" aria-describedby="username-help" />
        </div>
      </div>
      <div class="grid w-full">
        <label class="text-sm">Descripción</label>
        <Textarea v-model="editDescription" rows="5" cols="30" />
      </div>
      <p class="text-red-700" v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <div class="flex gap-2">
        <Button severity="danger" label="Cancelar" class="w-full" @click="cancelChanges" />
        <Button type="submit" label="Guardar cambios" class="w-full" />
      </div>
    </form>
  </Dialog>

  <Dialog v-model:visible="deleteDialogVisible" modal
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          header="Eliminar carro">
    <form class="grid gap-2" @submit.prevent="deletePost">
      <p>
        ¿Estás seguro de eliminar
        <span class="font-bold">{{ post.vehicle.brand.name}} {{ post.vehicle.model}}</span>
        ?
      </p>
      <div class="flex justify-between gap-2">
        <Button label="Cancelar"
                class="w-1/2"
                severity="info" outlined
                @click="deleteDialogVisible=false" />
        <Button label="Eliminar"
                class="w-1/2"
                severity="danger"
                type="submit" />
      </div>
    </form>
  </Dialog>


  <Dialog v-model:visible="detailsDialogVisible" modal
          :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          :header=post.vehicle.model >
    <div class="grid gap-1 mb-6">
      <p>
        <span class="font-bold">Marca: </span>
        {{ post.vehicle.brand.name}}
      </p>
      <p>
        <span class="font-bold">Año de producción: </span>
        {{ post.vehicle.manufactureYear }}
      </p>
      <p>
        <span class="font-bold">Precio: </span>
        <span v-if="post.currency_id === 1">US$</span>
        <span v-if="post.currency_id === 2">S/</span>
        {{ post.price }}
      </p>
      <p class="grid">
        <span class="font-bold">Descripción: </span>
        {{ post.description}}
      </p>
    </div>
    <div class="grid gap-1">
      <p>
        <span class="font-bold">Fecha de publicación: </span>
        {{ post.createdAt }}
      </p>
      <p>
        <span class="font-bold">Publicado por: </span>
        {{ employee_profile.firstName }}&nbsp;{{ employee_profile.lastName }}
      </p>
      <p>
        <span class="font-bold">Última vez editado: </span>
        {{ post.updatedAt }}
      </p>
    </div>
  </Dialog>
</template>