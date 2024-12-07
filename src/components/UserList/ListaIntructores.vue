<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Lista de Instructores</h2>
  
      <div class="button-group mb-3">
        <button class="btn btn-success" @click="exportToExcel">Exportar a Excel</button>
      </div>
  
      <el-input
        placeholder="Buscar por nombre o DNI"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
  
      <el-table :data="paginatedInstructores" style="width: 100%" border>
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
          :total="filteredInstructores"
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { supabase } from '@/supabase';
  import * as XLSX from 'xlsx';
  
  
  export default {
    name: 'InstructoresTable',
    setup() {
      const instructores = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(5);
  
      const fetchInstructores = async () => {
        const { data, error } = await supabase.rpc('obtenerinstructor');
        if (error) {
          console.error('Error al obtener instructores:', error.message);
        } else {
          instructores.value = data;
        }
      };
  
      const filteredInstructores = computed(() =>
        instructores.value.filter((instructor) =>
          instructor.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          instructor.dni.includes(searchQuery.value)
        )
      );
  
      const paginatedInstructores = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredInstructores.value.slice(start, start + itemsPerPage.value);
      });
  
      const handlePageChange = (page) => {
        currentPage.value = page;
      };
  
      const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(instructores.value);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Instructores');
        XLSX.writeFile(wb, 'Instructores.xlsx');
      };
  
      onMounted(fetchInstructores);
  
      return {
        instructores,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedInstructores,
        handlePageChange,
        exportToExcel,
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
  