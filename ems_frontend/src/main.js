import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Aura from '@primevue/themes/aura';

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog';


import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Ripple from 'primevue/ripple'
import PanelMenu from 'primevue/panelmenu'

//Toast and Confirm dialog
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


import 'primeicons/primeicons.css';
import './assets/base.css';
import 'primeflex/primeflex.css';

   
const app = createApp(App)

app.use(router)
// app.use(PrimeVue);

app.use(PrimeVue,{
    theme: {
        preset:Aura
    }
});

// Register Toast and ConfirmDialog globally
app.use(ConfirmationService);
app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Select', Select);
app.component('InputNumber', InputNumber);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);

app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('Badge',Badge)
app.component('Ripple', Ripple)
app.component('PanelMenu', PanelMenu)
app.component('Toast', Toast);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app')
