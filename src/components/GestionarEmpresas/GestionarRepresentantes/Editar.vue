<template>
  <div class="editar-representante-container">
    <el-form
      :model="representante"
      :rules="rules"
      ref="representanteForm"
      label-width="150px"
      class="form-wrapper"
    >
      <h3 class="form-title">Editar Representante</h3>

      <!-- Campos de Representante -->
      <el-form-item label="DNI" prop="dni">
        <el-input v-model="representante.dni" placeholder="Ingrese el DNI" />
      </el-form-item>
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="representante.nombre" placeholder="Ingrese el nombre" />
      </el-form-item>
      <el-form-item label="Apellido Paterno" prop="apellido_paterno">
        <el-input v-model="representante.apellido_paterno" placeholder="Ingrese el apellido paterno" />
      </el-form-item>
      <el-form-item label="Apellido Materno" prop="apellido_materno">
        <el-input v-model="representante.apellido_materno" placeholder="Ingrese el apellido materno" />
      </el-form-item>
      <el-form-item label="Correo Electrónico" prop="correo_electronico">
        <el-input v-model="representante.correo_electronico" placeholder="Ingrese el correo electrónico" />
      </el-form-item>
      <el-form-item label="Número de Contacto" prop="numero_de_contacto">
        <el-input v-model="representante.numero_de_contacto" placeholder="Ingrese el número de contacto" />
      </el-form-item>
      <el-form-item label="Dirección Sede" prop="direccion_sede">
        <el-input v-model="representante.direccion_sede" placeholder="Ingrese la dirección de la sede" />
      </el-form-item>
      <el-form-item label="Región" prop="region_id">
        <el-select v-model="representante.region_id" placeholder="Seleccione una región" @change="fetchProvincias">
          <el-option v-for="region in regiones" :key="region.id" :label="region.nombre" :value="region.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Provincia" prop="provincia_id">
        <el-select v-model="representante.provincia_id" placeholder="Seleccione una provincia">
          <el-option v-for="provincia in provincias" :key="provincia.id" :label="provincia.nombre" :value="provincia.id" />
        </el-select>
      </el-form-item>

      <!-- Botones -->
      <div class="form-actions">
        <el-button type="primary" @click="updateRepresentante" :loading="loading">Guardar Cambios</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  props: {
    representanteId: {
      type: Number,
      required: true,
    },
  },
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const representante = reactive({
      id: props.representanteId,
      dni: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo_electronico: '',
      numero_de_contacto: '',
      direccion_sede: '',
      region_id: null,
      provincia_id: null,
      empresa_id: null,
      ultimo_autor: GetUser(),
    });

    const regiones = ref([]);
    const provincias = ref([]);
    const loading = ref(false);
    const representanteForm = ref(null);

    const rules = {
      dni: [
        { required: true, message: 'El DNI es obligatorio.', trigger: 'blur' },
        { pattern: /^\d{8}$/, message: 'El DNI debe tener exactamente 8 dígitos.', trigger: 'blur' },
      ],
      nombre: [{ required: true, message: 'El nombre es obligatorio.', trigger: 'blur' }],
      apellido_paterno: [{ required: true, message: 'El apellido paterno es obligatorio.', trigger: 'blur' }],
      apellido_materno: [{ required: true, message: 'El apellido materno es obligatorio.', trigger: 'blur' }],
      correo_electronico: [
        { required: true, message: 'El correo electrónico es obligatorio.', trigger: 'blur' },
        { type: 'email', message: 'El formato del correo no es válido.', trigger: 'blur' },
      ],
      numero_de_contacto: [{ required: true, message: 'El número de contacto es obligatorio.', trigger: 'blur' }],
      direccion_sede: [{ required: true, message: 'La dirección de la sede es obligatoria.', trigger: 'blur' }],
      region_id: [{ required: true, message: 'Seleccione una región.', trigger: 'change' }],
      provincia_id: [{ required: true, message: 'Seleccione una provincia.', trigger: 'change' }],
    };

    const fetchRepresentante = async () => {
      try {
        const { data, error } = await supabase.from('representante_de_empresa').select('*').eq('id', props.representanteId).single();
        if (error) throw error;

        Object.assign(representante, data); // Asignar los valores obtenidos al objeto representante
        fetchProvincias(); // Actualizar las provincias según la región seleccionada
      } catch (err) {
        ElMessage.error('No se pudo cargar el representante.');
        console.error('Error al cargar representante:', err.message);
      }
    };

    const fetchRegiones = async () => {
      try {
        const { data, error } = await supabase.from('region').select('id, nombre');
        if (error) throw error;
        regiones.value = data || [];
      } catch (err) {
        console.error('Error al obtener regiones:', err.message);
      }
    };

    const fetchProvincias = async () => {
      try {
        const { data, error } = await supabase.from('provincia').select('id, nombre').eq('region_id', representante.region_id);
        if (error) throw error;
        provincias.value = data || [];
      } catch (err) {
        console.error('Error al obtener provincias:', err.message);
      }
    };

    const updateRepresentante = async () => {
      try {
        await representanteForm.value.validate();
        loading.value = true;

        const { error } = await supabase.from('representante_de_empresa').update(representante).eq('id', representante.id);
        if (error) throw error;

        ElMessage.success('Representante actualizado correctamente.');
        emit('refreshTable');
        emit('closeModal');
      } catch (err) {
        ElMessage.error('No se pudo actualizar el representante.');
        console.error('Error al actualizar representante:', err.message);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchRegiones();
      fetchRepresentante();
    });

    return {
      representante,
      regiones,
      provincias,
      representanteForm,
      rules,
      fetchProvincias,
      updateRepresentante,
      loading,
    };
  },
};
</script>

<style scoped>
.editar-representante-container {
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