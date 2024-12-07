<template>
  <el-form :model="newRegistro" ref="registroForm" label-width="120px">
    <el-form-item label="ID de Inspección" prop="inspeccion_id">
      <el-input v-model="newRegistro.inspeccion_id" />
    </el-form-item>
    <el-form-item label="ID de Maquinaria" prop="maquinariaxrepresentante_de_empresa_id">
      <el-input v-model="newRegistro.maquinariaxrepresentante_de_empresa_id" />
    </el-form-item>
    <el-form-item label="Fecha Registro 1" prop="fecha_hora_registro_1">
      <el-date-picker v-model="newRegistro.fecha_hora_registro_1" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Registro 2" prop="fecha_hora_registro_2">
      <el-date-picker v-model="newRegistro.fecha_hora_registro_2" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Registro 3" prop="fecha_hora_registro_3">
      <el-date-picker v-model="newRegistro.fecha_hora_registro_3" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Fecha Máxima de Evaluación" prop="fecha_maxima_de_evaluacion">
      <el-date-picker v-model="newRegistro.fecha_maxima_de_evaluacion" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-button type="primary" @click="submitRegistro">Registrar</el-button>
    <el-button @click="$emit('closeModal')">Cancelar</el-button>
  </el-form>
</template>

<script>
import { ref } from 'vue';
import { GetUser } from '@/auth';
import supabase from '@/supabase';

export default {
  emits: ['closeModal', 'refreshTable'],
  setup(_, { emit }) {
    const newRegistro = ref({
      inspeccion_id: null,
      maquinariaxrepresentante_de_empresa_id: null,
      fecha_hora_registro_1: null,
      fecha_hora_registro_2: null,
      fecha_hora_registro_3: null,
      fecha_maxima_de_evaluacion: null,
      fecha_de_creacion: new Date().toISOString(),
      fecha_de_modificacion: new Date().toISOString(),
      autor: GetUser(),
      ultimo_autor: GetUser(),
    });

    const submitRegistro = async () => {
      const { error } = await supabase.from('registro').insert([newRegistro.value]);
      if (error) {
        console.error('Error al registrar visita:', error.message);
      } else {
        emit('refreshTable');
        emit('closeModal');
      }
    };

    return { newRegistro, submitRegistro };
  },
};
</script>
