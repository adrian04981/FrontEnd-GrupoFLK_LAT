<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="ID del Inspector">
        <el-input v-model="form.inspector_id" />
      </el-form-item>
      
      <el-form-item label="ID del Certificador">
        <el-input v-model="form.certificador_id" />
      </el-form-item>

      <el-form-item label="ID de Maquinaria">
        <el-input v-model="form.maquinariaxrepresentante_de_empresa_id" />
      </el-form-item>

      <!-- Selección de fecha -->
      <el-form-item label="Fecha de la Primera Visita">
        <el-date-picker
          v-model="form.fecha"
          type="date"
          placeholder="Seleccione una fecha"
        />
      </el-form-item>

      <!-- Selección de turno -->
      <el-form-item label="Turno">
        <el-radio-group v-model="form.turno">
          <el-radio-button label="Mañana (10am)" />
          <el-radio-button label="Tarde (3pm)" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Ubicación Registrada">
        <el-input v-model="form.ubicacionregistrada" />
      </el-form-item>

      <el-form-item label="Estado">
        <el-input v-model="form.Estado" />
      </el-form-item>

      <el-form-item label="Tipo de Inspección">
        <el-input v-model="form.tipo_de_inspeccion" />
      </el-form-item>
      
      <div class="dialog-footer">
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
        <el-button type="primary" @click="scheduleFirstVisit">Programar Visita</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { GetUser } from '@/auth';
import supabase from '@/supabase';

export default {
  name: 'ProgramarPrimeraVisita',
  emits: ['closeModal', 'refreshTable'],
  setup() {
    const userId = GetUser(); // ID del usuario autenticado
    const form = reactive({
      inspector_id: '',
      certificador_id: '',
      maquinariaxrepresentante_de_empresa_id: '',
      fecha: '', // Solo fecha sin hora
      turno: '', // Mañana o Tarde
      ubicacionregistrada: '',
      fecha_de_creacion: new Date(),
      fecha_de_modificacion: new Date(),
      autor: userId,
      ultimo_autor: userId,
      Estado: '',
      tipo_de_inspeccion: ''
    });

    // Función para programar la primera visita en la base de datos
    const scheduleFirstVisit = async () => {
      // Definir la hora según el turno seleccionado
      let fecha_hora_asignada;
      if (form.fecha && form.turno) {
        const hora = form.turno === 'Mañana (10am)' ? '10:00:00' : '15:00:00';
        fecha_hora_asignada = new Date(`${form.fecha}T${hora}`);
      } else {
        console.error('Fecha y turno deben estar seleccionados');
        return;
      }

      const { error } = await supabase.from('inspeccion').insert([
        {
          inspector_id: form.inspector_id,
          certificador_id: form.certificador_id,
          maquinariaxrepresentante_de_empresa_id: form.maquinariaxrepresentante_de_empresa_id,
          fecha_hora_asignada: fecha_hora_asignada,
          ubicacionregistrada: form.ubicacionregistrada,
          fecha_de_creacion: form.fecha_de_creacion,
          fecha_de_modificacion: form.fecha_de_modificacion,
          autor: form.autor,
          ultimo_autor: form.ultimo_autor,
          Estado: form.Estado,
          tipo_de_inspeccion: form.tipo_de_inspeccion
        }
      ]);

      if (error) {
        console.error('Error al programar la primera visita:', error.message);
      } else {
        this.$emit('refreshTable'); // Refrescar la tabla principal
        this.$emit('closeModal');   // Cerrar el modal
      }
    };

    return {
      form,
      scheduleFirstVisit
    };
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
