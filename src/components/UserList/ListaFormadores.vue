<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Lista de Formadores</h2>
      
      <div class="button-group mb-3">
        <button class="btn btn-success" @click="exportToExcel">Exportar a Excel</button>
      </div>
  
      <el-input
        placeholder="Buscar por nombre o DNI"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
  
      <el-table :data="paginatedFormadores" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="nombre" label="Nombre" sortable />
        <el-table-column prop="dni" label="DNI" sortable />
        <el-table-column prop="modocurso" label="Modo de Curso" sortable />
      </el-table>
  
      <div class="pagination-container">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="filteredFormadores"
          layout="total, prev, pager, next"
        />
      </div>
  
      <!-- Dialog para registrar formador -->
      <el-dialog v-model="isRegisterDialogVisible" title="Registrar Formador" width="600px">
        <RegistrarFormador @closeDialog="closeRegisterDialog" @refreshTable="fetchFormadores" />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { supabase } from '@/supabase';
  import * as XLSX from 'xlsx';
  import RegistrarFormador from './RegistrarFormador.vue';
  
  export default {
    name: 'FormadoresTable',
    components: {
      RegistrarFormador,
    },
    setup() {
      const formadores = ref([]);
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
  
      const fetchFormadores = async () => {
        const { data, error } = await supabase.rpc('obtenerformadores');
        if (error) {
          console.error('Error al obtener formadores:', error.message);
        } else {
          formadores.value = data;
        }
      };
  
      const filteredFormadores = computed(() =>
        formadores.value.filter((formador) =>
          formador.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          formador.dni.includes(searchQuery.value)
        )
      );
  
      const paginatedFormadores = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredFormadores.value.slice(start, start + itemsPerPage.value);
      });
  
      const handlePageChange = (page) => {
        currentPage.value = page;
      };
  
      const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(formadores.value);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Formadores');
        XLSX.writeFile(wb, 'Formadores.xlsx');
      };
  
      onMounted(fetchFormadores);
  
      return {
        formadores,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedFormadores,
        handlePageChange,
        exportToExcel,
        isRegisterDialogVisible,
        openRegisterDialog,
        closeRegisterDialog,
        fetchFormadores,
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
  