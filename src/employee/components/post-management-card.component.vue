<script>
export default {
  name: 'PostManagementCard',
  props: {
    vehicle: {
      type: Object,
      required: true,
    },
    vehicleBrand: {
      type: Object,
      required: true,
    },
    employee_profile: {
      type: Object,
      required: true,
    },

    post: {
      type: Object,
      required: true,
    },
    currency: {
      type: Object,
      required: true,
    },
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

      // Fields to edit
      editSelectedCurrency:this.currency,
      ediSelectedPrice: this.post.price,
      editDescription: this.post.description
    };
  },
  created() {

  },
  methods: {
    deletePost(){
      this.deleteDialogVisible=false;
    },
    editPost(){
      this.editDialogVisible=false;
    },
  },
  computed: {
    truncatedDescription() {
      const maxWords = 12;
      const words = this.post.description.split(' ');
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
      } else {
        return this.post.description;
      }
    },
    truncatedModel() {
      const maxWords = 5;
      const words = this.vehicle.model.split(' ');
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
      } else {
        return this.vehicle.model;
      }
    },
  },
}
</script>

<template>
  <div class="border rounded h-[400px] w-[400px] hover:cursor-pointer hover:border-tertiary duration-200">
    <div @click="detailsDialogVisible=true">
      <img class="w-full h-48 object-cover" :src="vehicle.photo_url" :alt="vehicle.model">
      <div class="w-full grid px-6 pt-6 pb-2 gap-1">
        <div class="flex justify-between items-end gap-4">
          <div>
            <p class="uppercase font-bold text-primary text-sm">
              {{vehicleBrand.name}}
            </p>
            <p class="text-lg whitespace-normal">
              <span>{{truncatedModel}} {{vehicle.manufacture_year}}</span>
            </p>
          </div>
          <p class="font-bold text-tertiary text-2xl">
            <span v-if="post.currency_id === 1">US$</span>
            <span v-if="post.currency_id === 2">S/</span>
            {{post.price.toLocaleString() }}
          </p>
        </div>
        <p>{{ truncatedDescription }}</p>
      </div>
    </div>
    <div class="flex gap-2 justify-center">
      <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="deleteDialogVisible=true" />
      <Button icon="pi pi-pencil" severity="info" aria-label="Edit" @click="editDialogVisible=true" />
    </div>
  </div>

  <Dialog v-model:visible="editDialogVisible" modal :header=vehicle.model class="w-full md:w-1/3">
    <form class="grid gap-2">
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
      <Button type="submit" label="Publicar" class="w-full" />
    </form>
  </Dialog>

  <Dialog v-model:visible="deleteDialogVisible" modal
          class="w-96"
          header="Eliminar carro">
    <div class="grid gap-2">
      <p>
        ¿Estás seguro de eliminar
        <span class="font-bold">{{ vehicleBrand.name}} {{ vehicle.model}}</span>
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
                @click=deletePost() />
      </div>
    </div>
  </Dialog>


  <Dialog v-model:visible="detailsDialogVisible" modal
          class="w-96"
          :header=vehicle.model >
    <div class="grid gap-1 mb-6">
      <p>
        <span class="font-bold">Marca: </span>
        {{ vehicleBrand.name}}
      </p>
      <p>
        <span class="font-bold">Año de producción: </span>
        {{ vehicle.manufacture_year}}
      </p>
      <p>
        <span class="font-bold">Precio: </span>
        <span v-if="post.currency_id === 1">US$</span>
        <span v-if="post.currency_id === 2">S/</span>
        {{ post.price.toLocaleString() }}
      </p>
      <p class="grid">
        <span class="font-bold">Descripción: </span>
        {{ post.description}}
      </p>
    </div>
    <div class="grid gap-1">
      <p>
        <span class="font-bold">Fecha de publicación: </span>
        {{ post.created_at }}
      </p>
      <p>
        <span class="font-bold">Publicado por: </span>
        {{ employee_profile.first_name }} {{ employee_profile.last_name }}
      </p>
      <p>
        <span class="font-bold">Última vez editado: </span>
        {{ post.updated_at }}
      </p>
    </div>
  </Dialog>
</template>

<style scoped>

</style>