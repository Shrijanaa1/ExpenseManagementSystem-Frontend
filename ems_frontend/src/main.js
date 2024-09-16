import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Toolbar from 'primevue/toolbar';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

import 'primeicons/primeicons.css';

const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Select', Select);
app.component('InputNumber', InputNumber);
app.component('Column', Column);
app.component('DataTable', DataTable);

app.component('Toolbar', Toolbar);
app.component('Toast', Toast);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);


app.mount('#app')
