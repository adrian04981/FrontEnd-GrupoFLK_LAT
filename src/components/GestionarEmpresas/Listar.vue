<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Listado de Empresas</h2>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por RUC o Nombre Comercial"
      v-model="searchQuery"
      @input="debouncedFetch"
      class="mb-3 search-input"
    />

    <!-- Botón para abrir modal de registro de empresa -->
    <el-button type="primary" @click="openRegisterModal" class="mb-3">
      Registrar Nueva Empresa
    </el-button>

    <!-- Tabla de empresas -->
    <el-table :data="empresas" style="width: 100%" border v-loading="loading">
      <el-table-column prop="ruc" label="RUC" width="120" />
      <el-table-column prop="nombre_comercial" label="Nombre Comercial" sortable />
      <el-table-column prop="pais_nombre" label="País" sortable />
      <el-table-column prop="estado" label="Estado" width="120">
        <template #default="scope">
          <span>{{ scope.row.estado ? 'Activo' : 'Inactivo' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Acciones" width="250">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">
            Editar
          </el-button>
          <el-button size="mini" type="success" @click="openRepresentantesModal(scope.row)">
            Representantes
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Paginación -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="itemsPerPage"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
  </div>

  <!-- Modal de Edición -->
  <el-dialog v-model="editDialogVisible" title="Editar Empresa" width="600px">
    <EditarEmpresa
      v-if="selectedEmpresa"
      :empresaInicial="selectedEmpresa"
      @closeModal="closeEditModal"
      @refreshTable="fetchEmpresas"
    />
  </el-dialog>

  <!-- Modal de Representantes -->
  <el-dialog v-model="representantesDialogVisible" width="800px">
    <ListarRepresentantes
      v-if="selectedEmpresa"
      :empresaId="selectedEmpresa.id"
      :empresaNombre="selectedEmpresa.nombre_comercial"
    />
  </el-dialog>

  <!-- Modal de Registro -->
  <el-dialog v-model="registerDialogVisible" title="Registrar Nueva Empresa" width="600px">
    <Registrar
      @closeModal="closeRegisterModal"
      @refreshTable="fetchEmpresas"
    />
  </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue';
import debounce from 'lodash/debounce';
import supabase from '@/supabase';
import EditarEmpresa from './Editar.vue';
import ListarRepresentantes from './GestionarRepresentantes/Listar.vue';
import Registrar from './Registrar.vue';

export default {
  components: {
    EditarEmpresa,
    ListarRepresentantes,
    Registrar
  },
  setup() {
    const empresas = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(500);
    const totalItems = ref(0);
    const loading = ref(false);

    const editDialogVisible = ref(false);
    const representantesDialogVisible = ref(false);
    const registerDialogVisible = ref(false);
    const selectedEmpresa = ref(null);

    const debouncedFetch = debounce(() => fetchEmpresas(), 300);

    // Fetch empresas from Supabase
    const fetchEmpresas = async () => {
      loading.value = true;
      try {
        const { data, error, count } = await supabase
          .rpc('obtener_lista_empresas') // Llamada a la función SQL
          .ilike('ruc', `%${searchQuery.value}%`) // Búsqueda filtrada por RUC
          .ilike('nombre_comercial', `%${searchQuery.value}%`) // También filtrar por nombre comercial
          .range((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value - 1); // Rango de elementos a mostrar

        if (error) throw error;

        totalItems.value = count; // Total de registros para la paginación
        empresas.value = data; // Datos de empresas
      } catch (err) {
        console.error('Error al obtener empresas:', err.message);
      } finally {
        loading.value = false;
      }
    };

    // Cambiar de página en la paginación
    const handlePageChange = (page) => {
      currentPage.value = page;  // Actualizar la página actual
      fetchEmpresas(); // Refrescar los datos con la nueva página
    };

    // Abrir modal para editar empresa
    const openEditModal = (empresa) => {
      selectedEmpresa.value = empresa;
      editDialogVisible.value = true;
    };

    // Cerrar modal de edición
    const closeEditModal = () => {
      editDialogVisible.value = false;
      selectedEmpresa.value = null;
    };

    // Abrir modal de representantes
    const openRepresentantesModal = (empresa) => {
      selectedEmpresa.value = empresa;
      representantesDialogVisible.value = true;
    };

    // Abrir modal de registro (dentro de el-dialog)
    const openRegisterModal = () => {
      registerDialogVisible.value = true;
    };

    // Cerrar modal de registro
    const closeRegisterModal = () => {
      registerDialogVisible.value = false;
    };

    // Inicializar la carga de empresas
    onMounted(() => {
      fetchEmpresas();
    });

    return {
      empresas,
      searchQuery,
      currentPage,
      itemsPerPage,
      totalItems,
      loading,
      editDialogVisible,
      representantesDialogVisible,
      registerDialogVisible, 
      selectedEmpresa,
      debouncedFetch,
      fetchEmpresas,
      handlePageChange,
      openEditModal,
      closeEditModal,
      openRepresentantesModal,
      openRegisterModal,
      closeRegisterModal
    };
  },
};
</script>

<style scoped>
.data-table-container {
  max-width: 1200px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.search-input {
  width: 100%;
}

.el-table {
  margin-top: 20px;
}

.ml-3 {
  margin-left: 10px;
}
</style>
