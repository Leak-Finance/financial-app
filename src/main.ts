import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from "primevue/config";
import Tailwind from "primevue/passthrough/tailwind";

import 'primevue/resources/themes/viva-light/theme.css'


import InlineMessage from 'primevue/inlinemessage';
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import DataView from 'primevue/dataview';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';

createApp(App)
    .use(createPinia())
    .use(PrimeVue, { ripple: true, Tailwind })
    .use(router)
    .component('InlineMessage', InlineMessage)
    .component('InputText', InputText)
    .component('Button', Button)
    .component('Password', Password)
    .component('DataView', DataView)
    .component('Paginator', Paginator)
    .component('Dropdown', Dropdown)
    .component('ProgressSpinner', ProgressSpinner)
    .component('Tag', Tag)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('Dialog', Dialog)
    .mount('#app')
