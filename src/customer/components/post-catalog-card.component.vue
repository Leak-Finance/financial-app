<script>

export default {
  emits: ['select'],
  name: 'PostCatalogCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailsDialogVisible: false,
    };
  },
  methods: {
    selectCar() {
      this.$emit('select');
    },
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
    <div v-if="!isSelected" class="flex gap-2 justify-center absolute bottom-4 left-0 right-0">
      <Button label="Seleccionar" aria-label="Delete" @click="selectCar" />
    </div>
  </div>


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
  </Dialog>
</template>