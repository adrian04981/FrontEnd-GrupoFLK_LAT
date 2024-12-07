<template>
  <el-form :model="editedRegistro" ref="registroForm" label-width="120px">
    <el-form-item label="ID de Inspección" prop="inspeccion_id">
      <el-input v-model="editedRegistro.inspeccion_id" />
    </el-form-item>
    <el-form-item label="ID de Maquinaria" prop="maquinariaxrepresentante_de_empresa_id">
      <el-input v-model="editedRegistro.maquinariaxrepresentante_de_empresa_id" />
    </el-form-item>
    <el-form-item label="Fecha Registro 1" prop="fecha_hora_registro_1">
      <el-date-picker v-model="editedRegistro.fecha_hora_registro_1" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Registro 2" prop="fecha_hora_registro_2">
      <el-date-picker v-model="editedRegistro.fecha_hora_registro_2" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Registro 3" prop="fecha_hora_registro_3">
      <el-date-picker v-model="editedRegistro.fecha_hora_registro_3" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Máxima de Evaluación" prop="fecha_maxima_de_evaluacion">
      <el-date-picker v-model="editedRegistro.fecha_maxima_de_evaluacion" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-button type="primary" @click="submitEdit">Guardar Cambios</el-button>
    <el-button @click="$emit('closeModal')">Cancelar</el-button>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue';
import { GetUser } from '@/auth';
import supabase from '@/supabase';

export default {
  props: ['registro'],
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const editedRegistro = ref({ ...props.registro });

    watch(
      () => props.registro,
      (newVal) => {
        editedRegistro.value = { ...newVal };
      }
    );

    const submitEdit = async () => {
      editedRegistro.value.fecha_de_modificacion = new Date().toISOString();
      editedRegistro.value.ultimo_autor = GetUser();

      const { error } = await supabase
        .from('registro')
        .update(editedRegistro.value)
        .eq('id', editedRegistro.value.id);

      if (error) {
        console.error('Error al editar registro:', error.message);
      } else {
        emit('refreshTable');
        emit('closeModal');
      }
    };

    return { editedRegistro, submitEdit };
  },
};
</script>
