<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Historial de Registros de Visitas</h2>

    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Visita</el-button>
    </div>

    <!-- Tabla de registros -->
    <el-table :data="registros" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="inspeccion_id" label="ID de Inspección" sortable />
      <el-table-column prop="maquinariaxrepresentante_de_empresa_id" label="ID de Maquinaria" sortable />
      <el-table-column prop="fecha_hora_registro_1" label="Fecha Registro 1" sortable />
      <el-table-column prop="fecha_hora_registro_2" label="Fecha Registro 2" sortable />
      <el-table-column prop="fecha_hora_registro_3" label="Fecha Registro 3" sortable />
      <el-table-column prop="fecha_maxima_de_evaluacion" label="Fecha Máxima de Evaluación" sortable />
      <el-table-column prop="fecha_de_creacion" label="Fecha de Creación" sortable />
      <el-table-column prop="fecha_de_modificacion" label="Fecha de Modificación" sortable />
      <el-table-column prop="autor" label="Autor" sortable />
      <el-table-column prop="ultimo_autor" label="Último Autor" sortable />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">Editar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modal de Registro -->
    <el-dialog v-model="dialogVisible" title="Registrar Nueva Visita" width="500px">
      <RegistrarRegistroVisita @closeModal="dialogVisible = false" @refreshTable="fetchRegistros" />
    </el-dialog>

    <!-- Modal de Edición -->
    <el-dialog v-model="editDialogVisible" title="Editar Registro de Visita" width="500px">
      <EditarRegistroVisita :registro="selectedRegistro" @closeModal="editDialogVisible = false" @refreshTable="fetchRegistros" />
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import supabase from '@/supabase';
import RegistrarRegistroVisita from './RegistrarRegistroVisita.vue';
import EditarRegistroVisita from './EditarRegistroVisita.vue';

export default {
  components: {
    RegistrarRegistroVisita,
    EditarRegistroVisita,
  },
  data() {
    return {
      registros: [],
      dialogVisible: false,
      editDialogVisible: false,
      selectedRegistro: null,
    };
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(registro) {
      this.selectedRegistro = registro;
      this.editDialogVisible = true;
    },
    async fetchRegistros() {
      const { data, error } = await supabase.from('registro').select('*');
      if (error) {
        console.error('Error al obtener registros:', error.message);
      } else {
        this.registros = data;
      }
    },
  },
  created() {
    this.fetchRegistros();
  },
};
</script>
