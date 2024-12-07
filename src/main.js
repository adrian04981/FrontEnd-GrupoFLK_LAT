// main.js
import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/custom.css';
import 'animate.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@/assets/styles/loader.css';


// Importar jQuery y DataTables solo si se necesita globalmente
import $ from 'jquery';
import 'datatables.net';

// Inicializamos la aplicación de Vue
const app = createApp(App);

// Configuración global para jQuery y DataTables (si es necesario)
app.config.globalProperties.$ = $;
app.config.globalProperties.$DataTable = $.fn.DataTable;

// Configuración de Element Plus y el router
app.use(router);
app.use(ElementPlus);

// Iniciamos AOS al montar la aplicación
app.mount('#app').$nextTick(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
});
