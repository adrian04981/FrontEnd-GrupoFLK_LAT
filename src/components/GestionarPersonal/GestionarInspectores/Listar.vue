<template>
  <div class="data-table-container animate__bounceIn">
    <h2 class="text-center mb-4">Historial de Inspectores Registrados</h2>

    <!-- Botones para exportar a Excel y abrir modal de registro -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Inspector</el-button>
      <el-button type="success" @click="exportToExcel" class="ml-3">Exportar a Excel</el-button>
    </div>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por nombre o entidad certificadora"
      v-model="searchQuery"
      @input="debouncedSearch"
      class="mb-3 search-input"
    />

    <!-- Tabla de inspectores -->
    <el-table :data="paginatedInspectores" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nombreCompleto" label="Nombre Completo" sortable />
      <el-table-column prop="nombre_inspeccion" label="Nombre de la Inspección" sortable />
      <el-table-column prop="entidad_certificadora" label="Entidad Certificadora" sortable />
      <el-table-column prop="fecha_de_emision_de_certificado" label="Fecha de Emisión" sortable />
      <el-table-column prop="fecha_de_caducidad_de_certificado" label="Fecha de Caducidad" sortable />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">Editar</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- Modal de Registro -->
    <el-dialog v-model="dialogVisible" title="Registrar Nuevo Inspector" width="500px">
      <RegistrarInspector @closeModal="dialogVisible = false" @refreshTable="fetchInspectores" />
    </el-dialog>

    <!-- Modal de Edición -->
    <el-dialog v-model="editDialogVisible" title="Editar Inspector" width="500px">
      <EditarInspector
        :inspector="selectedInspector"
        @closeModal="editDialogVisible = false"
        @refreshTable="fetchInspectores"
      />
    </el-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import supabase from '@/supabase';
import RegistrarInspector from './Registrar.vue';
import EditarInspector from './Editar.vue';

export default {
  components: {
    RegistrarInspector,
    EditarInspector,
  },
  data() {
    return {
      inspectores: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      filteredInspectores: [],
      dialogVisible: false,
      editDialogVisible: false,
      selectedInspector: null,
    };
  },
  computed: {
    paginatedInspectores() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredInspectores.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(inspector) {
      this.selectedInspector = inspector;
      this.editDialogVisible = true;
    },
    async exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.inspectores);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inspectores');
      XLSX.writeFile(wb, 'Historial_de_Inspectores_Registrados.xlsx');
    },
    debouncedSearch: debounce(function () {
      this.filterInspectores();
    }, 300),
    filterInspectores() {
      this.filteredInspectores = this.inspectores.filter((inspector) =>
        inspector.nombreCompleto.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inspector.entidad_certificadora.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    async fetchInspectores() {
      const { data, error } = await supabase.rpc('obtenerinspectores');
      if (error) {
        console.error('Error al obtener inspectores:', error.message);
      } else {
        this.inspectores = data.map((inspector) => ({
          ...inspector,
          nombreCompleto: `${inspector.nombre_asistente_de_operaciones} ${inspector.apellido_paterno_asistente_de_operaciones} ${inspector.apellido_materno_asistente_de_operaciones}`,
        }));
        this.filterInspectores();
      }
    },
  },
  created() {
    this.fetchInspectores();
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
