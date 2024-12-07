<template>
  <el-form :model="empresa" ref="form" label-width="120px">
    <el-form-item label="RUC" :label-width="formLabelWidth">
      <el-input v-model="empresa.ruc" :disabled="true" />
    </el-form-item>
    <el-form-item label="Nombre Comercial" :label-width="formLabelWidth">
      <el-input v-model="empresa.nombre_comercial" />
    </el-form-item>
    <el-form-item label="País" :label-width="formLabelWidth">
      <el-input v-model="empresa.pais_nombre" :disabled="true" />
    </el-form-item>
    <el-form-item label="Dirección Central" :label-width="formLabelWidth">
      <el-input v-model="empresa.direccion_central" />
    </el-form-item>
    <el-form-item label="Estado" :label-width="formLabelWidth">
      <el-switch v-model="empresa.estado" active-text="Activo" inactive-text="Inactivo" />
    </el-form-item>

    <el-button type="primary" @click="updateEmpresa">Actualizar</el-button>
    <el-button @click="closeModal">Cerrar</el-button>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue';
import supabase from '@/supabase';

export default {
  props: {
    empresaInicial: Object,
  },
  setup(props, { emit }) {
    // Creamos una ref para manejar los datos de la empresa
    const empresa = ref({
      ...props.empresaInicial, // Al principio se llena con los datos recibidos como propiedad
    });

    const formLabelWidth = '120px';

    // Función para actualizar la empresa
    const updateEmpresa = async () => {
      const { id, ruc, nombre_comercial, pais_nombre, direccion_central, Estado } = empresa.value;

      try {
        const { error } = await supabase
          .from('empresa')
          .update({
            nombre_comercial,
            direccion_central,
            Estado,  // Ahora se usa 'estado' y no 'Estado'
          })
          .eq('id', id);

        if (error) throw error;

        emit('refreshTable');
        emit('closeModal');
      } catch (err) {
        console.error('Error al actualizar empresa:', err.message);
      }
    };

    // Función para cerrar el modal y limpiar los datos del formulario
    const closeModal = () => {
      // Limpiar los datos de la empresa y reiniciar el formulario
      empresa.value = { ruc: '', nombre_comercial: '', pais_nombre: '', direccion_central: '', estado: true };
      emit('closeModal');
    };

    // Limpiar los datos cuando cambie la propiedad "empresaInicial"
    watch(() => props.empresaInicial, (newValue) => {
      empresa.value = { ...newValue }; // Asignamos los nuevos datos cuando la empresa inicial cambia
    });

    return {
      empresa,
      formLabelWidth,
      updateEmpresa,
      closeModal,
    };
  },
};
</script>

<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
