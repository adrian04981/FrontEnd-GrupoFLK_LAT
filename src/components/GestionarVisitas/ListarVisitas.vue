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
      placeholder="Buscar por estado, tipo de inspección o empresa"
      v-model="searchQuery"
      @input="debouncedSearch"
      class="mb-3 search-input"
    />
    <!-- Tabla de inspecciones -->
    <el-table :data="paginatedInspecciones" style="width: 100%" border>
      <el-table-column prop="id_inspeccion" label="ID Inspección" width="120" />
      <el-table-column prop="nombre_empresa" label="Empresa" />
      <el-table-column prop="ubicacion" label="Ubicación" />
      <el-table-column prop="fecha_inicio" label="Fecha de Inicio" sortable />
      <el-table-column prop="nombre_tipo_producto" label="Tipo de Producto" />
      <el-table-column prop="estado_inspeccion" label="Estado" />
      <!-- Columna de Opciones -->
      <el-table-column label="Opciones" width="150">
        <template #default="scope">
          <el-button
            v-if="scope.row.estado_inspeccion === 'observado' || scope.row.estado_inspeccion === 'cancelado'"
            size="mini"
            type="success"
            @click="openSecondOpportunityModal(scope.row)"
          >
            Programar Visita
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Paginación -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="itemsPerPage"
      :total="filteredInspecciones.length"
      layout="prev, pager, next"
      class="mt-4"
    />
  </div>

  <!-- Modal de Registro -->
  <el-dialog v-model="dialogVisible" title="Registrar Nueva Inspección" width="500px">
    <RegistrarInspeccion @closeModal="dialogVisible = false" @refreshTable="fetchInspecciones" />
  </el-dialog>
  
  <!-- Modal de Segunda Oportunidad -->
  <el-dialog v-model="secondOpportunityDialogVisible" title="Registrar Segunda Oportunidad" width="500px">
    <RegistrarSegundaOportunidad
      :inspeccion="selectedInspeccion"
      @closeModal="secondOpportunityDialogVisible = false"
      @refreshTable="fetchInspecciones"
    />
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
import RegistrarInspeccion from './RegistrarVisita.vue';
import EditarInspeccion from './EditarVisita.vue';
import RegistrarSegundaOportunidad from './RegistrarSegundaOportunidad.vue';  // Importar el nuevo componente

export default {
  components: {
    RegistrarInspeccion,
    EditarInspeccion,
    RegistrarSegundaOportunidad,  // Incluir el nuevo componente
  },
  data() {
    return {
      inspecciones: [], // Datos de inspecciones
      searchQuery: '', // Consulta de búsqueda
      currentPage: 1, // Página actual
      itemsPerPage: 5, // Cantidad de elementos por página
      dialogVisible: false, // Visibilidad del modal de registro
      secondOpportunityDialogVisible: false, // Visibilidad del modal de segunda oportunidad
      editDialogVisible: false, // Visibilidad del modal de edición
      selectedInspeccion: null, // Inspección seleccionada para editar
    };
  },
  computed: {
    paginatedInspecciones() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredInspecciones.slice(start, start + this.itemsPerPage);
    },
    filteredInspecciones() {
      return this.inspecciones.filter((inspeccion) => {
        const estado = inspeccion.estado_inspeccion || ''; // Valor predeterminado si es null
        const tipo = inspeccion.nombre_tipo_producto || ''; // Valor predeterminado si es null
        const empresa = inspeccion.nombre_empresa || ''; // Valor predeterminado si es null
        return (
          estado.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          tipo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          empresa.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(inspeccion) {
      this.selectedInspeccion = { ...inspeccion }; // Copia del objeto para mantener reactividad
      this.editDialogVisible = true;
    },
    openSecondOpportunityModal(inspeccion) {
      this.selectedInspeccion = { ...inspeccion };
      this.secondOpportunityDialogVisible = true;
    },
    async exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.inspecciones);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Historial_de_Inspecciones');
      XLSX.writeFile(wb, 'Historial_de_Inspecciones.xlsx');
    },
    debouncedSearch: debounce(function () {
      this.filterInspecciones();
    }, 300),
    async fetchInspecciones() {
      try {
        const { data, error } = await supabase.rpc('get_inspecciones_historial');
        if (error) {
          console.error('Error al obtener inspecciones:', error.message);
        } else {
          this.inspecciones = data || [];
        }
      } catch (err) {
        console.error('Error al conectar con Supabase:', err.message);
      }
    },
    async scheduleVisit(inspeccion) {
      try {
        // Llamada al procedimiento almacenado para verificar si la maquinaria puede programar una visita
        const { data, error } = await supabase.rpc('puede_programar_visita', {
          inspeccion_id: inspeccion.id_inspeccion
        });

        if (error) {
          console.error('Error al verificar las oportunidades:', error.message);
          this.$message.error('Hubo un problema al verificar las oportunidades de la inspección.');
          return;
        }

        if (!data) {
          // Si el procedimiento retorna 'false', no se puede programar la visita
          this.$message.error('La inspección ya no puede programar una nueva visita.');
          return;
        }

        // Si el procedimiento retorna 'true', se puede programar la visita
        const confirm = await this.$confirm('¿Desea programar una nueva visita para esta inspección?', 'Confirmar', {
          type: 'warning',
        });

        if (confirm) {
          const fechaVisita = new Date(); // La fecha y hora de la nueva visita

          // Actualizamos la fecha de la visita en la base de datos
          const { error: updateError } = await supabase
            .from('registro')
            .update({ fecha_hora_registro_2: fechaVisita.toISOString() })
            .eq('inspeccion_id_1', inspeccion.id_inspeccion);

          if (updateError) {
            console.error('Error al programar visita:', updateError.message);
            this.$message.error('Hubo un error al programar la visita.');
          } else {
            this.$message.success('Visita programada con éxito.');
            this.fetchInspecciones(); // Actualizar lista de inspecciones
          }
        }
      } catch (err) {
        console.error('Error al programar visita:', err.message);
        this.$message.error('Hubo un error inesperado.');
      }
    }
  },
  created() {
    this.fetchInspecciones();
  },
};
</script>
