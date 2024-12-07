<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Historial de Certificadores Registrados</h2>

    <!-- Botones para exportar a Excel y abrir modal de registro -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Certificador</el-button>
      <el-button type="success" @click="exportToExcel" class="ml-3">Exportar a Excel</el-button>
    </div>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por nombre o entidad certificadora"
      v-model="searchQuery"
      @input="debouncedSearch"
      class="mb-3 search-input"
    />

    <!-- Tabla de certificadores -->
    <el-table :data="paginatedCertificadores" style="width: 100%" border>
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
  <el-dialog v-model="dialogVisible" title="Registrar Nuevo Certificador" width="500px">
    <RegistrarCertificador @closeModal="dialogVisible = false" @refreshTable="fetchCertificadores" />
  </el-dialog>

  <!-- Modal de Edición -->
  <el-dialog v-model="editDialogVisible" title="Editar Certificador" width="500px">
    <EditarCertificador
      :certificador="selectedCertificador"
      @closeModal="editDialogVisible = false"
      @refreshTable="fetchCertificadores"
    />
  </el-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import supabase from '@/supabase';
import RegistrarCertificador from './Registrar.vue';
import EditarCertificador from './Editar.vue';

export default {
  components: {
    RegistrarCertificador,
    EditarCertificador,
  },
  data() {
    return {
      certificadores: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      dialogVisible: false,
      editDialogVisible: false,
      selectedCertificador: null,
    };
  },
  computed: {
    paginatedCertificadores() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCertificadores.slice(start, start + this.itemsPerPage);
    },
    filteredCertificadores() {
      return this.certificadores.filter((certificador) =>
        certificador.nombreCompleto.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        certificador.entidad_certificadora.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(certificador) {
      this.selectedCertificador = certificador;
      this.editDialogVisible = true;
    },
    async exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.certificadores);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Certificadores');
      XLSX.writeFile(wb, 'Historial_de_Certificadores_Registrados.xlsx');
    },
    debouncedSearch: debounce(function () {
      this.filterCertificadores();
    }, 300),
    async fetchCertificadores() {
      const { data, error } = await supabase.rpc('obtenercertificadores');
      if (error) {
        console.error('Error al obtener certificadores:', error.message);
      } else {
        this.certificadores = data.map((certificador) => ({
          ...certificador,
          nombreCompleto: `${certificador.nombre_asistente_de_operaciones} ${certificador.apellido_paterno_asistente_de_operaciones} ${certificador.apellido_materno_asistente_de_operaciones}`,
        }));
      }
    },
  },
  created() {
    this.fetchCertificadores();
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
