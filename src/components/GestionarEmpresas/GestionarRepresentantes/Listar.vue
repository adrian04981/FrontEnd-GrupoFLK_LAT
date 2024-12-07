<template>
  <div class="listar-representantes-container">
    <h2 class="text-center mb-4">Listado de Representantes</h2>

    <!-- Botones para registrar -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Representante</el-button>
    </div>

    <!-- Tabla de representantes -->
    <el-table :data="representantes" style="width: 100%" border v-loading="loading">
      <el-table-column prop="dni" label="DNI" width="100" />
      <el-table-column
        label="Nombre Completo"
        :formatter="formatNombreCompleto"
      />
      <el-table-column prop="direccion_sede" label="Dirección Sede" />
      <el-table-column label="Acciones" width="250">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row.id)">Editar</el-button>
          <el-button size="mini" type="success" @click="openMaquinariaModal(scope.row.id)">Maquinaria</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
      <!-- Modal de Registro -->
      <el-dialog v-model="dialogVisible" title="Registrar Representante" width="600px">
      <Registrar
        :empresaId="empresaId"
        @closeModal="dialogVisible = false"
        @refreshTable="fetchRepresentantes"
      />
    </el-dialog>

    <!-- Modal de Edición -->
    <el-dialog v-model="editDialogVisible" title="Editar Representante" width="600px">
      <Editar
        :representanteId="selectedRepresentanteId"
        @closeModal="editDialogVisible = false"
        @refreshTable="fetchRepresentantes"
      />
    </el-dialog>

    <!-- Modal de Maquinaria -->
    <el-dialog v-model="maquinariaDialogVisible" title="Gestionar Maquinaria" width="800px">
      <GestionarMaquinaria
        :representanteId="selectedRepresentanteId"
        @closeModal="maquinariaDialogVisible = false"
        @refreshTable="fetchRepresentantes"
      />
    </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import supabase from '@/supabase';
import Registrar from './Registrar.vue';
import Editar from './Editar.vue';
import GestionarMaquinaria from './GestionarMaquinaria/Listar.vue';

export default {
  components: { Registrar, Editar, GestionarMaquinaria },
  props: {
    empresaId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const representantes = ref([]);
    const loading = ref(false);
    const dialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const maquinariaDialogVisible = ref(false);
    const selectedRepresentanteId = ref(null);

    const fetchRepresentantes = async () => {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from('representante_de_empresa')
          .select('*')
          .eq('empresa_id', props.empresaId);

        if (error) throw error;
        representantes.value = data || [];
      } catch (err) {
        ElMessage.error('Error al cargar representantes.');
        console.error('Error al cargar representantes:', err.message);
      } finally {
        loading.value = false;
      }
    };

    const openRegisterModal = () => {
      dialogVisible.value = true;
    };

    const openEditModal = (representanteId) => {
      selectedRepresentanteId.value = representanteId;
      editDialogVisible.value = true;
    };

    const openMaquinariaModal = (representanteId) => {
      selectedRepresentanteId.value = representanteId;
      maquinariaDialogVisible.value = true;
    };

    const formatNombreCompleto = (row) => {
      return `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`;
    };

    onMounted(fetchRepresentantes);

    return {
      representantes,
      loading,
      dialogVisible,
      editDialogVisible,
      maquinariaDialogVisible,
      selectedRepresentanteId,
      fetchRepresentantes,
      openRegisterModal,
      openEditModal,
      openMaquinariaModal,
      formatNombreCompleto,
    };
  },
};
</script>

<style scoped>
.listar-representantes-container {
  max-width: 900px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.button-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
</style>