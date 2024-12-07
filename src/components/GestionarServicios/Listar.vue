<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Servicios De Inspección</h2>
    <div class="button-group mb-3">
      <button class="btn btn-primary" @click="openRegisterModal">Registrar Servicio</button>
      <button class="btn btn-success mx-3" @click="exportToExcel">Exportar a Excel</button>
    </div>

    <el-input
      placeholder="Buscar por servicio o maquinaria"
      v-model="searchQuery"
      class="mb-3 search-input"
    />

    <el-table :data="paginatedServicios" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column
        prop="servicio"
        label="Servicio"
        sortable
      />
      <el-table-column
        prop="maquinaria"
        label="Maquinaria"
        sortable
      />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="editService(scope.row.id)">Editar</el-button>
          <el-button size="mini" type="danger" @click="deleteService(scope.row)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Contenedor de paginación -->
    <div class="pagination-container">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="filteredServicios.length"
        layout="total, prev, pager, next"
      />
      <div class="select-with-message mt-1">
        <span class="page-size-message">Mostrar</span>
        <el-select v-model="itemsPerPage" @change="handleItemsPerPageChange" class="page-size-select" placeholder="Items por página">
          <el-option label="5" :value="5" />
          <el-option label="10" :value="10" />
          <el-option label="15" :value="15" />
          <el-option label="20" :value="20" />
        </el-select>
        <span class="page-size-message">registros</span>
      </div>
    </div>

    <!-- Modal para Registrar Servicio -->
    <el-dialog
      v-model="dialogVisible"
      title="Registrar Nuevo Servicio"
      width="500px"
      :before-close="handleClose"
    >
      <Registrar @closeModal="dialogVisible = false" @refreshTable="fetchServicios" />
    </el-dialog>

    <!-- Modal para Editar Servicio -->
    <el-dialog
      v-model="isEditModalVisible"
      title="Editar Servicio"
      width="500px"
      @close="closeEditModal"
    >
      <EditService :service="selectedService" @serviceUpdated="fetchServicios" @closeModal="closeEditModal" />
    </el-dialog>

    <!-- Modal para Confirmar Eliminación -->
    <el-dialog
      v-model="isDeleteModalVisible"
      title="Eliminar Servicio"
      width="400px"
      @close="closeDeleteModal"
    >
      <p>¿Estás seguro de que deseas eliminar este servicio?</p>
      <el-button type="danger" @click="confirmDeleteService">Eliminar</el-button>
      <el-button @click="closeDeleteModal">Cancelar</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import supabase from '@/supabase';
import * as XLSX from 'xlsx';
import { GetUser } from '@/auth';
import Registrar from './Registrar.vue';
import EditService from './EditService.vue';

export default {
  components: {
    Registrar,
    EditService,
  },
  setup() {
    const dialogVisible = ref(false);
    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const servicios = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5); // Default items per page
    const selectedService = ref(null);

    const openRegisterModal = () => {
      dialogVisible.value = true;
    };

    const editService = async (serviceId) => {
      const { data, error } = await supabase
        .from('tipo_de_inspeccion')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error al obtener el servicio:', error.message);
        alert('Error al cargar el servicio para edición');
        return;
      }

      selectedService.value = data;
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
      selectedService.value = null;
    };

    const deleteService = (service) => {
      selectedService.value = service;
      isDeleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalVisible.value = false;
      selectedService.value = null;
    };

    const handleClose = (done) => {
      done();
    };

    const fetchServicios = async () => {
      const { data, error } = await supabase.rpc('obtenerserviciosregistrados');
      if (error) {
        console.error('Error al obtener servicios:', error.message);
      } else {
        servicios.value = data;
      }
    };

    const filteredServicios = computed(() =>
      servicios.value.filter((servicio) =>
        servicio.servicio.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        servicio.maquinaria.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const paginatedServicios = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredServicios.value.slice(start, start + itemsPerPage.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handleItemsPerPageChange = (value) => {
      itemsPerPage.value = value;
      currentPage.value = 1; // Reset to first page whenever items per page changes
    };

    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(servicios.value);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Servicios');
      XLSX.writeFile(wb, 'Servicios_de_Inspeccion.xlsx');
    };

    const confirmDeleteService = async () => {
      const { error } = await supabase
        .from('tipo_de_inspeccion')
        .delete()
        .eq('id', selectedService.value.id);
      if (error) {
        console.error('Error al eliminar servicio:', error.message);
      } else {
        alert('Servicio eliminado con éxito');
        fetchServicios();
        closeDeleteModal();
      }
    };

    onMounted(fetchServicios);

    return {
      dialogVisible,
      isEditModalVisible,
      isDeleteModalVisible,
      servicios,
      searchQuery,
      currentPage,
      itemsPerPage,
      selectedService,
      openRegisterModal,
      editService,
      closeEditModal,
      deleteService,
      closeDeleteModal,
      handleClose,
      fetchServicios,
      filteredServicios,
      paginatedServicios,
      handlePageChange,
      handleItemsPerPageChange,
      exportToExcel,
      confirmDeleteService,
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .page-size-select {
    width: 70px;
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .date-range-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .date-pickers {
    display: flex;
    gap: 10px;
  }
  
  .date-picker {
    width: 45%;
  }
  
  .clear-filters-button {
    margin-left: auto;
  }
  
  .pagination-container {
    display: auto;
    align-items: center;
    margin-top: 20px;
  }
  
  .empty-column {
    flex: 1;
  }
  
  .select-with-message {
    display: flex;
    align-items: center;
  }
  
  .page-size-message {
    margin-right: 10px;
  }
  
  .el-table th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: bold;
  }
  
  .el-table td {
    color: #666;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
  }
  
  .pagination .el-pagination {
    margin-top: 20px;
  }
  /* Tablets */
@media (max-width: 768px) {
  .data-table-container {
    padding: 10px;
  }

  .date-range-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-pickers {
    width: 100%;
    justify-content: space-between;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
  }

  .select-with-message {
    margin-top: 10px;
  }
}

/* Móviles */
@media (max-width: 480px) {
  .data-table-container {
    padding: 5px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .page-size-select {
    width: 60px;
  }

  .date-pickers {
    flex-direction: column;
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
  }

  .select-with-message {
    margin-top: 10px;
    flex-direction: column;
  }

  .page-size-message {
    margin: 0;
    margin-bottom: 5px;
  }
}
  </style>
  