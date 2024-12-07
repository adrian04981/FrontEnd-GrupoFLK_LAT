<template>
  <div>
    <h3>Maquinaria de {{ representanteNombre }}</h3>

    <!-- Botón para Registrar Maquinaria -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Maquinaria</el-button>
    </div>

    <!-- Tabla de Maquinaria -->
    <el-table :data="maquinaria || []" style="width: 100%" v-loading="loading">
      <el-table-column prop="tipo_maquinaria" label="Tipo de Maquinaria" width="300" />
      <el-table-column prop="placa" label="Placa" width="200" />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">Editar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Mensaje para lista vacía -->
    <div v-if="!loading && maquinaria.length === 0" class="empty-state">
      <p>No hay maquinaria registrada para este representante.</p>
    </div>

    <!-- Modal para Registrar Maquinaria -->
    <el-dialog v-model="registerDialogVisible" title="Registrar Maquinaria" width="600px">
      <RegistrarMaquinaria
        :representanteId="representanteId"
        @closeModal="closeRegisterModal"
        @refreshTable="fetchMaquinaria"
      />
    </el-dialog>

    <!-- Modal para Editar Maquinaria -->
    <el-dialog v-model="editDialogVisible" title="Editar Maquinaria" width="600px">
      <EditarMaquinaria
        :maquinariaInicial="selectedMaquinaria"
        @closeModal="closeEditModal"
        @refreshTable="fetchMaquinaria"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import supabase from '@/supabase';
import RegistrarMaquinaria from './Registrar.vue';
import EditarMaquinaria from './Editar.vue';

export default {
  components: {
    RegistrarMaquinaria,
    EditarMaquinaria,
  },
  props: {
    representanteId: {
      type: Number,
      required: true,
    },
    representanteNombre: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const maquinaria = ref([]);
    const loading = ref(false);
    const registerDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const selectedMaquinaria = ref(null);

    // Cargar Maquinaria
    const fetchMaquinaria = async () => {
      loading.value = true;
      try {
        const { data, error } = await supabase
          .from('maquinariaxrepresentante_de_empresa')
          .select('id, tipo_de_maquinaria_id, placa')
          .eq('representante_de_empresa_id', props.representanteId);

        if (error) throw error;

        maquinaria.value = await Promise.all(
          data.map(async (maq) => ({
            ...maq,
            tipo_maquinaria: await getTipoMaquinaria(maq.tipo_de_maquinaria_id),
          }))
        );
      } catch (err) {
        console.error('Error al cargar maquinaria:', err.message);
      } finally {
        loading.value = false;
      }
    };

    // Obtener descripción de tipo de maquinaria
    const getTipoMaquinaria = async (tipoId) => {
      const { data, error } = await supabase.from('tipo_de_maquinaria').select('descripcion').eq('id', tipoId).single();
      return error ? 'Desconocido' : data.descripcion;
    };

    // Modales
    const openRegisterModal = () => {
      registerDialogVisible.value = true;
    };

    const closeRegisterModal = () => {
      registerDialogVisible.value = false;
    };

    const openEditModal = (maquinaria) => {
      selectedMaquinaria.value = { ...maquinaria };
      editDialogVisible.value = true;
    };

    const closeEditModal = () => {
      editDialogVisible.value = false;
      selectedMaquinaria.value = null;
    };

    onMounted(() => {
      fetchMaquinaria();
    });

    return {
      maquinaria,
      loading,
      registerDialogVisible,
      editDialogVisible,
      selectedMaquinaria,
      openRegisterModal,
      closeRegisterModal,
      openEditModal,
      closeEditModal,
      fetchMaquinaria,
    };
  },
};
</script>

<style scoped>
.button-group {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.empty-state {
  text-align: center;
  margin: 20px 0;
  color: #999;
}

.el-table {
  margin-top: 20px;
}
</style>