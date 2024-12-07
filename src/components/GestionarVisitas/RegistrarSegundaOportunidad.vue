<template>
  <el-dialog v-model="dialogVisible" title="Registrar Segunda Oportunidad" width="500px">
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="Fecha de Visita" prop="fecha_visita" :rules="[{ required: true, message: 'La fecha de visita es requerida', trigger: 'blur' }]">
        <el-date-picker v-model="form.fecha_visita" type="datetime" placeholder="Seleccionar fecha y hora" style="width: 100%" />
      </el-form-item>

      <el-form-item label="Inspector" prop="inspector" :rules="[{ required: true, message: 'El inspector es requerido', trigger: 'blur' }]">
        <el-input v-model="form.inspector" placeholder="Nombre del inspector" />
      </el-form-item>

      <el-form-item label="Certificador" prop="certificador" :rules="[{ required: true, message: 'El certificador es requerido', trigger: 'blur' }]">
        <el-input v-model="form.certificador" placeholder="Nombre del certificador" />
      </el-form-item>

      <el-button type="primary" @click="handleSubmit" :loading="loading">Registrar Oportunidad</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import supabase from '@/supabase';

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        fecha_visita: null,
        inspector: '',
        certificador: '',
      },
      loading: false,
      inspeccionId: null,
      inspeccionData: null,
    };
  },
  methods: {
    async fetchInspeccionData() {
      const route = useRoute();
      this.inspeccionId = route.params.id; // Asumiendo que el ID está en la URL
      
      try {
        const { data, error } = await supabase
          .from('inspecciones')
          .select('*')
          .eq('id_inspeccion', this.inspeccionId)
          .single();  // Esperamos solo un registro

        if (error) {
          console.error('Error al obtener los datos de la inspección:', error.message);
        } else {
          this.inspeccionData = data;
        }
      } catch (err) {
        console.error('Error al obtener la inspección:', err.message);
      }
    },

    async verifyIfCanRegisterOpportunity() {
      try {
        const { data, error } = await supabase.rpc('puede_programar_visita', {
          inspeccion_id: this.inspeccionId,
        });

        if (error) {
          console.error('Error al verificar las oportunidades:', error.message);
          this.$message.error('Hubo un problema al verificar las oportunidades.');
          return false;
        }

        if (!data) {
          this.$message.error('La inspección ya no puede programar una nueva visita.');
          return false;
        }

        return true; // Puede registrar la segunda oportunidad
      } catch (err) {
        console.error('Error al verificar las oportunidades:', err.message);
        this.$message.error('Hubo un error inesperado.');
        return false;
      }
    },

    async handleSubmit() {
      const canRegister = await this.verifyIfCanRegisterOpportunity();
      if (!canRegister) {
        return;
      }

      this.loading = true;

      try {
        // Registrar la segunda oportunidad en la base de datos
        const { error } = await supabase
          .from('registro')
          .update({
            fecha_hora_registro_2: this.form.fecha_visita,
            inspector: this.form.inspector,
            certificador: this.form.certificador,
          })
          .eq('inspeccion_id_1', this.inspeccionId);

        if (error) {
          console.error('Error al registrar la segunda oportunidad:', error.message);
          this.$message.error('Hubo un error al registrar la oportunidad.');
        } else {
          this.$message.success('Segunda oportunidad registrada con éxito.');
          this.dialogVisible = false; // Cerrar el modal
        }
      } catch (err) {
        console.error('Error inesperado:', err.message);
        this.$message.error('Hubo un error inesperado.');
      } finally {
        this.loading = false;
      }
    },

    openDialog() {
      this.dialogVisible = true;
      this.fetchInspeccionData(); // Cargar los datos de la inspección cuando se abre el modal
    },
  },
  created() {
    this.openDialog(); // Llamamos a la función cuando se crea el componente
  },
};
</script>

<style scoped>
.el-dialog {
  max-width: 600px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
