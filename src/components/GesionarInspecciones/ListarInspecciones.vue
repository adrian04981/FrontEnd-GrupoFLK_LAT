<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Historial de Inspecciones</h2>

    <!-- Botones para exportar a Excel y abrir modal de registro -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Inspección</el-button>
      <el-button type="success" @click="exportToExcel" class="ml-3">Exportar a Excel</el-button>
    </div>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por estado o tipo de inspección"
      v-model="searchQuery"
      @input="debouncedSearch"
      class="mb-3 search-input"
    />

    <!-- Tabla de inspecciones -->
    <el-table :data="paginatedInspecciones" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="inspector_id" label="ID del Inspector" sortable />
      <el-table-column prop="certificador_id" label="ID del Certificador" sortable />
      <el-table-column prop="maquinariaxrepresentante_de_empresa_id" label="ID de Maquinaria" sortable />
      <el-table-column prop="fecha_hora_asignada" label="Fecha y Hora Asignada" sortable />
      <el-table-column prop="ubicacionregistrada" label="Ubicación Registrada" sortable />
      <el-table-column prop="Estado" label="Estado" sortable />
      <el-table-column prop="tipo_de_inspeccion" label="Tipo de Inspección" sortable />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">Editar</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Modal de Registro -->
  <el-dialog v-model="dialogVisible" title="Registrar Nueva Inspección" width="500px">
    <RegistrarInspeccion @closeModal="dialogVisible = false" @refreshTable="fetchInspecciones" />
  </el-dialog>

  <!-- Modal de Edición -->
  <el-dialog v-model="editDialogVisible" title="Editar Inspección" width="500px">
    <EditarInspeccion
      :inspeccion="selectedInspeccion"
      @closeModal="editDialogVisible = false"
      @refreshTable="fetchInspecciones"
    />
  </el-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import supabase from '@/supabase';
import RegistrarInspeccion from './RegistrarInspeccion.vue';
import EditarInspeccion from './EditarInspeccion.vue';

export default {
  components: {
    RegistrarInspeccion,
    EditarInspeccion,
  },
  data() {
    return {
      inspecciones: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      dialogVisible: false,
      editDialogVisible: false,
      selectedInspeccion: null,
    };
  },
  computed: {
    paginatedInspecciones() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredInspecciones.slice(start, start + this.itemsPerPage);
    },
    filteredInspecciones() {
      return this.inspecciones.filter((inspeccion) =>
        inspeccion.Estado.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inspeccion.tipo_de_inspeccion.toString().includes(this.searchQuery)
      );
    },
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(inspeccion) {
      this.selectedInspeccion = inspeccion;
      this.editDialogVisible = true;
    },
    async exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.inspecciones);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inspecciones');
      XLSX.writeFile(wb, 'Historial_de_Inspecciones.xlsx');
    },
    debouncedSearch: debounce(function () {
      this.filterInspecciones();
    }, 300),
    async fetchInspecciones() {
      const { data, error } = await supabase.from('inspeccion').select('*');
      if (error) {
        console.error('Error al obtener inspecciones:', error.message);
      } else {
        this.inspecciones = data;
      }
    },
  },
  created() {
    this.fetchInspecciones();
  },
};
</script>

<style scoped>
.data-table-container {
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.search-input {
  width: 100%;
}
.button-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
.ml-3 {
  margin-left: 10px;
}
</style>
