<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Inspecciones Asignadas</h2>

    <el-input
      placeholder="Buscar inspección o ubicación"
      v-model="searchQuery"
      class="mb-3 search-input"
    />

    <el-table :data="paginatedInspecciones" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="fecha_hora_inicio" label="Fecha Inicio" sortable />
      <el-table-column prop="ubicacionregistrada" label="Ubicación" sortable />
      <el-table-column prop="tipo_de_inspeccion" label="Tipo de Inspección" sortable />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="editInspection(scope.row.id)">Editar</el-button>
          <el-button size="mini" type="danger" @click="deleteInspection(scope.row)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Paginación -->
    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="itemsPerPage"
      :total="filteredInspecciones.length"
      layout="total, prev, pager, next"
    />
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  setup() {
    const inspecciones = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    
    const fetchInspecciones = async () => {
      const userId = GetUser(); // Obtener el UUID del usuario inspector
      const { data, error } = await supabase
        .from('inspeccion')
        .select('*')
        .eq('inspector_id', userId) // Filtrar por el ID del inspector
        .eq('Estado', 'registrado'); // Filtrar solo las inspecciones con estado "registrado"

      if (error) {
        console.error('Error al obtener inspecciones:', error.message);
      } else {
        inspecciones.value = data;
      }
    };

    onMounted(fetchInspecciones);

    return {
      inspecciones,
      searchQuery,
      currentPage,
      itemsPerPage,
    };
  }
};

</script>