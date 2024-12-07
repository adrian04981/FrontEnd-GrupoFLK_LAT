<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Lista de Operadores</h2>
    
    

    <div class="button-group mb-3">
      <button class="btn btn-success" @click="exportToExcel">Exportar a Excel</button>
    </div>

    <el-input
      placeholder="Buscar por nombre o apellido"
      v-model="searchQuery"
      class="mb-3 search-input"
    />

    <el-table :data="paginatedOperadores" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nombre" label="Nombre" sortable />
      <el-table-column prop="apellidos" label="Apellidos" sortable />
      <el-table-column prop="dni" label="Número de Documento" sortable />
    </el-table>

    <div class="pagination-container">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="filteredOperadores"
        layout="total, prev, pager, next"
      />
    </div>

    <!-- Dialog para registrar operador -->
    <el-dialog v-model="isRegisterDialogVisible" title="Registrar Operador" width="600px">
      <RegistrarOperador @closeDialog="closeRegisterDialog" @refreshTable="fetchOperadores" />
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/supabase';
import * as XLSX from 'xlsx';
import RegistrarOperador from './RegistrarOperador.vue';

export default {
  name: 'OperadoresTable',
  components: {
    RegistrarOperador,
  },
  setup() {
    const operadores = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const isRegisterDialogVisible = ref(false);

    const openRegisterDialog = () => {
      isRegisterDialogVisible.value = true;
    };

    const closeRegisterDialog = () => {
      isRegisterDialogVisible.value = false;
    };

    const fetchOperadores = async () => {
      const { data, error } = await supabase.rpc('obteneroperadores');
      if (error) {
        console.error('Error al obtener operadores:', error.message);
      } else {
        operadores.value = data;
        console.log(operadores.value)
      }
    };

    const filteredOperadores = computed(() =>
      operadores.value.filter((operador) =>
        operador.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        operador.apellidos.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const paginatedOperadores = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredOperadores.value.slice(start, start + itemsPerPage.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(operadores.value);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Operadores');
      XLSX.writeFile(wb, 'Operadores.xlsx');
    };

    onMounted(fetchOperadores);

    return {
      operadores,
      searchQuery,
      currentPage,
      itemsPerPage,
      paginatedOperadores,
      handlePageChange,
      exportToExcel,
      isRegisterDialogVisible,
      openRegisterDialog,
      closeRegisterDialog,
      fetchOperadores,
    };
  },
};
</script>

<style scoped>
.data-table-container {
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.search-input {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
