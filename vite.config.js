import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';  // Importa path para resolver rutas

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Configura el alias '@' para la carpeta 'src'
    },
  },
  optimizeDeps: {
    include: ['jquery', 'datatables.net', 'datatables.net-dt'],  // Optimización para incluir DataTables y jQuery
  },
});
