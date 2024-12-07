<template>
  <div class="register-empresa-container">
    <el-form
      :model="empresa"
      :rules="rules"
      ref="empresaForm"
      label-width="150px"
      class="form-wrapper"
    >
      <!-- Título -->
      <h3 class="form-title">Registrar Nueva Empresa</h3>

      <!-- RUC -->
      <el-form-item label="RUC" prop="nro_identificacion">
        <el-input
          v-model="empresa.nro_identificacion"
          placeholder="Ingrese el RUC"
          maxlength="11"
        />
      </el-form-item>

      <!-- Razón Social -->
      <el-form-item label="Razón Social" prop="razon_social">
        <el-input
          v-model="empresa.razon_social"
          placeholder="Ingrese la razón social"
        />
      </el-form-item>

      <!-- Nombre Comercial -->
      <el-form-item label="Nombre Comercial" prop="nombre_comercial">
        <el-input
          v-model="empresa.nombre_comercial"
          placeholder="Ingrese el nombre comercial"
        />
      </el-form-item>

      <!-- Dirección Central -->
      <el-form-item label="Dirección Central" prop="direccion_central">
        <el-input
          v-model="empresa.direccion_central"
          placeholder="Ingrese la dirección central"
        />
      </el-form-item>

      <!-- País -->
      <el-form-item label="País" prop="pais_id">
        <el-select v-model="empresa.pais_id" placeholder="Seleccione un país">
          <el-option
            v-for="pais in paises"
            :key="pais.id"
            :label="pais.nombre"
            :value="pais.id"
          />
        </el-select>
      </el-form-item>

      <!-- Botones de acción -->
      <div class="form-actions">
        <el-button
          type="primary"
          :loading="loading"
          @click="saveEmpresa"
          icon="el-icon-check"
        >
          Registrar
        </el-button>
        <el-button @click="$emit('closeModal')" icon="el-icon-close">
          Cancelar
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'; // IMPORTAR ElMessage
import supabase from '@/supabase';
import { GetUser } from '@/auth'; // Obtener el ID del usuario actual

export default {
  emits: ['closeModal', 'refreshTable'],
  setup(_, { emit }) {
    const empresaForm = ref(null);
    const loading = ref(false);
    const paises = ref([]);

    // Modelo de datos
    const empresa = reactive({
      nro_identificacion: '',
      razon_social: '',
      nombre_comercial: '',
      direccion_central: '',
      pais_id: null,
    });

    // Reglas de validación
    const rules = {
      nro_identificacion: [
        { required: true, message: 'El RUC es obligatorio.', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            const rucRegex = /^\d{11}$/; // Validar que sean exactamente 11 dígitos
            if (!value) {
              callback(new Error('El RUC es obligatorio.'));
            } else if (!rucRegex.test(value)) {
              callback(new Error('El RUC debe tener exactamente 11 dígitos numéricos.'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      razon_social: [
        { required: true, message: 'La razón social es obligatoria.', trigger: 'blur' },
      ],
      nombre_comercial: [
        { required: true, message: 'El nombre comercial es obligatorio.', trigger: 'blur' },
      ],
      pais_id: [
        { required: true, message: 'Seleccione un país.', trigger: 'change' },
      ],
    };

    // Obtener lista de países
    const fetchPaises = async () => {
      try {
        const { data, error } = await supabase.from('pais').select('id, nombre');
        if (error) throw error;
        paises.value = data || [];
      } catch (err) {
        console.error('Error al obtener los países:', err.message);
      }
    };

    // Validar duplicidad del RUC
    const isRUCRegistered = async (ruc) => {
      const { data, error } = await supabase
        .from('empresa')
        .select('nro_identificacion')
        .eq('nro_identificacion', ruc);

      if (error) {
        console.error('Error al verificar duplicidad del RUC:', error.message);
        return false;
      }

      return data && data.length > 0;
    };

    // Guardar empresa
    const saveEmpresa = async () => {
      if (!empresaForm.value) return;

      try {
        // Validar formulario
        await empresaForm.value.validate();

        // Validar si el RUC ya está registrado
        if (await isRUCRegistered(empresa.nro_identificacion)) {
          ElMessage.error('El RUC ya está registrado.');
          return;
        }

        // Configurar campos automáticos
        const usuarioActual = GetUser(); // Obtener ID del usuario actual
        const fechaActual = new Date().toISOString();

        loading.value = true;

        // Insertar en la base de datos
        const { error } = await supabase.from('empresa').insert({
  razon_social: empresa.razon_social,
  nombre_comercial: empresa.nombre_comercial,
  direccion_central: empresa.direccion_central,
  nro_identificacion: empresa.nro_identificacion,
  pais_id: empresa.pais_id,
  autor: usuarioActual, // Obligatorio
  ultimo_autor: usuarioActual, // Obligatorio
  fecha_de_creacion: fechaActual,
  fecha_de_modificacion: fechaActual,
  Estado: true, // Si aplica
});

        if (error) throw error;

        // Notificar éxito
        ElMessage.success('Empresa registrada correctamente.');
        emit('refreshTable');
        emit('closeModal');
        
        // Limpiar los campos del formulario
        empresa.nro_identificacion = '';
        empresa.razon_social = '';
        empresa.nombre_comercial = '';
        empresa.direccion_central = '';
        empresa.pais_id = null;

      } catch (err) {
        console.error('Error al registrar la empresa:', err.message || err);
        ElMessage.error('Hubo un problema al registrar la empresa.');
      } finally {
        loading.value = false;
      }
    };

    // Cargar países al montar
    fetchPaises();

    return {
      empresa,
      empresaForm,
      rules,
      saveEmpresa,
      paises,
      loading,
    };
  },
};
</script>

<style scoped>
.register-empresa-container {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-wrapper {
  margin: 0;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.25rem;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>