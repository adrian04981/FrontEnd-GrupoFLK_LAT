<template>
  <div>
    <el-form ref="maquinariaForm" label-width="120px">
      <el-form-item label="Descripción">
        <el-input v-model="maquinaria.descripcion" placeholder="Ingrese descripción del tipo de maquinaria" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="registerMaquinaria">Registrar</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  setup(_, { emit }) {
    const maquinaria = ref({
      descripcion: '',
      autor: GetUser(),
      ultimo_autor: GetUser(),
    });

    const registerMaquinaria = async () => {
      if (!maquinaria.value.descripcion) {
        alert('Ingrese una descripción para el tipo de maquinaria.');
        return;
      }

      const { data, error } = await supabase.from('tipo_de_maquinaria').insert([maquinaria.value]);

      if (error) {
        console.error('Error al registrar tipo de maquinaria:', error.message);
        alert(`Error al registrar el tipo de maquinaria: ${error.message}`);
      } else {
        alert('Tipo de maquinaria registrado exitosamente');
        emit('refreshMaquinaria'); // Actualizar el listado de maquinaria en Registrar.vue
        emit('closeModal'); // Cerrar el modal
      }
    };

    return {
      maquinaria,
      registerMaquinaria,
    };
  },
};
</script>