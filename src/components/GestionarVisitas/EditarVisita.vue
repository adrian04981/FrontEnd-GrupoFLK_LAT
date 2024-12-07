<template>
  <el-dialog v-model="dialogVisible" title="Editar Inspección" width="500px">
    <el-form :model="formData" ref="form" label-width="120px" :rules="formRules">
      <!-- ID de Inspección (solo lectura) -->
      <el-form-item label="ID Inspección" prop="id_inspeccion">
        <el-input v-model="formData.id_inspeccion" disabled />
      </el-form-item>

      <!-- Nombre de la Empresa -->
      <el-form-item label="Empresa" prop="nombre_empresa">
        <el-input v-model="formData.nombre_empresa" />
      </el-form-item>

      <!-- Ubicación -->
      <el-form-item label="Ubicación" prop="ubicacion">
        <el-input v-model="formData.ubicacion" />
      </el-form-item>

      <!-- Fecha de Inicio -->
      <el-form-item label="Fecha de Inicio" prop="fecha_inicio">
        <el-date-picker
          v-model="formData.fecha_inicio"
          type="date"
          placeholder="Seleccionar fecha"
          format="yyyy-MM-dd"
        />
      </el-form-item>

      <!-- Tipo de Producto -->
      <el-form-item label="Tipo de Producto" prop="nombre_tipo_producto">
        <el-input v-model="formData.nombre_tipo_producto" />
      </el-form-item>

      <!-- Estado de la Inspección -->
      <el-form-item label="Estado" prop="estado_inspeccion">
        <el-select v-model="formData.estado_inspeccion" placeholder="Seleccionar estado">
          <el-option label="Pendiente" value="Pendiente" />
          <el-option label="Completado" value="Completado" />
          <el-option label="Cancelado" value="Cancelado" />
        </el-select>
      </el-form-item>

      <!-- Botones para guardar o cancelar -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">Cancelar</el-button>
        <el-button type="primary" @click="saveInspection">Guardar</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import supabase from '@/supabase';

export default {
  props: {
    inspeccion: {
      type: Object,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    },
    refreshTable: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: true,
      formData: { ...this.inspeccion }, // Evitar que sea null
      formRules: {
        nombre_empresa: [{ required: true, message: 'Por favor ingresa el nombre de la empresa', trigger: 'blur' }],
        ubicacion: [{ required: true, message: 'Por favor ingresa la ubicación', trigger: 'blur' }],
        fecha_inicio: [{ required: true, message: 'Por favor selecciona la fecha de inicio', trigger: 'change' }],
        nombre_tipo_producto: [{ required: true, message: 'Por favor ingresa el tipo de producto', trigger: 'blur' }],
        estado_inspeccion: [{ required: true, message: 'Por favor selecciona el estado de la inspección', trigger: 'change' }],
      },
    };
  },
  watch: {
    inspeccion(newValue) {
      if (newValue) {
        this.formData = { ...newValue };
      }
    },
  },
  methods: {
    async saveInspection() {
      try {
        await this.$refs.form.validate();
        const { data, error } = await supabase
          .from('inspecciones')
          .update({
            nombre_empresa: this.formData.nombre_empresa,
            ubicacion: this.formData.ubicacion,
            fecha_inicio: this.formData.fecha_inicio,
            nombre_tipo_producto: this.formData.nombre_tipo_producto,
            estado_inspeccion: this.formData.estado_inspeccion,
          })
          .eq('id_inspeccion', this.formData.id_inspeccion);

        if (error) {
          ElMessage.error('Error al actualizar la inspección');
        } else {
          ElMessage.success('Inspección actualizada con éxito');
          this.closeModal();
          this.refreshTable();
        }
      } catch (err) {
        ElMessage.error('Error al guardar la inspección');
        console.error(err);
      }
    },
    closeModal() {
      this.dialogVisible = false;
    },
  },
  onMounted() {
    if (!this.inspeccion) {
      console.error('La inspección no está disponible');
    }
  }
};
</script>
