<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Historial de Certificadores Registrados</h2>
      <button class="btn btn-primary" @click="exportToExcel">Exportar a Excel</button>
  
      <!-- Barra de búsqueda -->
      <el-input
        placeholder="Buscar por nombre o entidad certificadora"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
      
      <!-- Filtro por intervalo de tiempo -->
      <div class="date-range-filters mb-3">
        <div class="date-pickers">
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="Fecha de inicio"
            class="date-picker"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="Fecha de fin"
            class="date-picker"
          />
        </div>
  
        <!-- Botón "Limpiar Filtros" alineado a la derecha -->
        <el-button 
          v-if="showClearFiltersButton" 
          type="primary" 
          @click="clearFilters"
          class="clear-filters-button"
        >
          Limpiar filtros
        </el-button>
      </div>
  
      <el-table :data="paginatedInspectores" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="60" />
        
        <!-- Columna combinada de nombre completo -->
        <el-table-column
          prop="nombreCompleto"
          label="Nombre Completo"
          sortable
          :sort-method="(a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto)"
        />
        
        <el-table-column
          prop="nombre_inspeccion"
          label="Nombre de la Inspección"
          sortable
          :sort-method="(a, b) => a.nombre_inspeccion.localeCompare(b.nombre_inspeccion)"
        />
        
        <el-table-column
          prop="entidad_certificadora"
          label="Entidad Certificadora"
          sortable
          :sort-method="(a, b) => a.entidad_certificadora.localeCompare(b.entidad_certificadora)"
        />
  
        <el-table-column
          prop="fecha_de_emision_de_certificado"
          label="Fecha de Emisión"
          sortable
        />
        
        <el-table-column
          prop="fecha_de_caducidad_de_certificado"
          label="Fecha de Caducidad"
          sortable
        />
  
        <!-- Columna de acciones -->
        <el-table-column label="Acciones" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editInspector(scope.row)">Editar</el-button>
            <el-button size="mini" type="danger" @click="deleteInspector(scope.row)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- Contenedor para las tres columnas: texto, select, texto -->
      <div class="pagination-container">
        <div class="empty-column"></div>
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="filteredInspectores.length"
          layout="total, prev, pager, next"
          class="pagination"
        />
        <div class="select-with-message mt-1" mt-1>
          <span class="page-size-message">Mostrar</span>
          <el-select v-model="itemsPerPage" class="page-size-select" placeholder="Items por página">
            <el-option label="5" :value="5" />
            <el-option label="10" :value="10" />
            <el-option label="15" :value="15" />
            <el-option label="20" :value="20" />
          </el-select>
          <span class="page-size-message">registros</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import supabase from '@/supabase'
  
  export default {
    data() {
      return {
        inspectores: [], // Lista de inspectores obtenidos desde la función almacenada
        searchQuery: '', // Cadena de búsqueda
        currentPage: 1, // Página actual para la paginación
        itemsPerPage: 5, // Items por página para la paginación
        startDate: null, // Fecha de inicio del filtro
        endDate: null, // Fecha de fin del filtro
      };
    },
    computed: {
      // Filtrar inspectores basado en la búsqueda y el rango de fechas
      filteredInspectores() {
        return this.inspectores.filter((inspector) => {
          const matchesSearchQuery =
            inspector.nombreCompleto.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            inspector.entidad_certificadora.toLowerCase().includes(this.searchQuery.toLowerCase());
  
          const isInDateRange =
            (!this.startDate || new Date(inspector.fecha_de_emision_de_certificado) >= new Date(this.startDate)) &&
            (!this.endDate || new Date(inspector.fecha_de_emision_de_certificado) <= new Date(this.endDate));
  
          return matchesSearchQuery && isInDateRange;
        });
      },
      // Obtener inspectores para la página actual
      paginatedInspectores() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredInspectores.slice(start, start + this.itemsPerPage);
      },
      // Mostrar el botón "Limpiar Filtros" solo si la búsqueda está llena o si hay fechas seleccionadas
      showClearFiltersButton() {
        return this.searchQuery.length > 0 || this.startDate || this.endDate;
      }
    },
    methods: {
      // Manejo del cambio de página
      handlePageChange(page) {
        this.currentPage = page;
      },
      // Limpiar los filtros de búsqueda y de fecha
      clearFilters() {
        this.searchQuery = '';
        this.startDate = null;
        this.endDate = null;
      },
      // Editar inspector
      editInspector(inspector) {
        // Lógica para editar el inspector
        console.log("Editando inspector:", inspector);
      },
      // Eliminar inspector
      deleteInspector(inspector) {
        // Lógica para eliminar el inspector
        console.log("Eliminando inspector:", inspector);
      }
    },
    async created() {
      // Llamada a la función almacenada en Supabase usando RPC
      let { data, error } = await supabase.rpc('obtenercertificadores');
      
      if (error) {
        console.error('Error al obtener inspectores:', error.message);
      } else {
        // Combinar los nombres y apellidos en una nueva propiedad "nombreCompleto"
        this.inspectores = data.map(inspector => {
          return {
            ...inspector,
            nombreCompleto: `${inspector.nombre_asistente_de_operaciones} ${inspector.apellido_paterno_asistente_de_operaciones} ${inspector.apellido_materno_asistente_de_operaciones}`
          };
        });
      }
    }
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
  