<template>
  <div class="registrar-maquinaria-container">
    <el-form
      :model="maquinaria"
      :rules="rules"
      ref="maquinariaForm"
      label-width="150px"
      class="form-wrapper"
    >
      <h3 class="form-title">Registrar Maquinaria</h3>

      <!-- Campos de Maquinaria -->
      <el-form-item label="Tipo de Maquinaria" prop="tipo_de_maquinaria_id">
        <el-select v-model="maquinaria.tipo_de_maquinaria_id" placeholder="Seleccione un tipo">
          <el-option
            v-for="tipo in tiposMaquinaria"
            :key="tipo.id"
            :label="tipo.descripcion"
            :value="tipo.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Placa" prop="placa">
        <el-input v-model="maquinaria.placa" placeholder="Ingrese la placa (opcional)" />
      </el-form-item>

      <!-- Botones -->
      <div class="form-actions">
        <el-button type="primary" @click="saveMaquinaria" :loading="loading">Registrar</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import supabase from '@/supabase';
import { GetUser } from '@/auth'; // Asegúrate de importar la función para obtener el usuario

export default {
  props: {
    representanteId: {
      type: Number,
      required: true,
    },
  },
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const maquinaria = reactive({
      tipo_de_maquinaria_id: null,
      placa: '',
      representante_de_empresa_id: props.representanteId,
      Estado: 1,
      autor: GetUser(), // Obtener el usuario actual como autor
      ultimo_autor: GetUser(),
      Estado: true,
    });
    const tiposMaquinaria = ref([]);
    const loading = ref(false);
    const maquinariaForm = ref(null);

    const rules = {
      tipo_de_maquinaria_id: [{ required: true, message: 'Seleccione un tipo de maquinaria.', trigger: 'change' }],
    };

    const fetchTiposMaquinaria = async () => {
      try {
        const { data, error } = await supabase.from('tipo_de_maquinaria').select('id, descripcion');
        if (error) throw error;
        tiposMaquinaria.value = data || [];
      } catch (err) {
        console.error('Error al obtener tipos de maquinaria:', err.message);
      }
    };

    const saveMaquinaria = async () => {
      try {
        await maquinariaForm.value.validate();
        loading.value = true;

        const { error } = await supabase.from('maquinariaxrepresentante_de_empresa').insert(maquinaria);
        if (error) throw error;

        ElMessage.success('Maquinaria registrada correctamente.');
        
        // Limpiar el formulario después de un registro exitoso
        limpiarFormulario();

        emit('refreshTable');
        emit('closeModal');
      } catch (err) {
        console.error('Error al registrar maquinaria:', err.message);
        ElMessage.error('No se pudo registrar la maquinaria.');
      } finally {
        loading.value = false;
      }
    };

    const limpiarFormulario = () => {
      maquinaria.tipo_de_maquinaria_id = null;
      maquinaria.placa = '';
    };

    onMounted(() => {
      fetchTiposMaquinaria();
    });

    return {
      maquinaria,
      tiposMaquinaria,
      maquinariaForm,
      rules,
      saveMaquinaria,
      loading,
    };
  },
};
</script>

<style scoped>
.registrar-maquinaria-container {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>