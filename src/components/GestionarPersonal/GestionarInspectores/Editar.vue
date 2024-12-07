<template>
  <el-form ref="formEdicion" :model="form" label-width="120px">
    <el-form-item label="Nombre Completo">
      <el-input v-model="form.nombreCompleto" disabled />
    </el-form-item>
    <el-form-item label="Tipo de Inspección">
      <el-select v-model="form.tipoInspeccion">
        <el-option
          v-for="tipo in tiposInspeccion"
          :key="tipo.tipo_id"
          :label="tipo.nombre_inspeccion"
          :value="tipo.tipo_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Entidad Certificadora">
      <el-input v-model="form.entidadCertificadora" />
    </el-form-item>
    <el-form-item label="Fecha de Emisión">
      <el-date-picker v-model="form.fechaEmision" type="date" />
    </el-form-item>
    <el-form-item label="Fecha de Caducidad">
      <el-date-picker v-model="form.fechaCaducidad" type="date" />
    </el-form-item>
    <el-form-item label="Número de Certificado">
      <el-input v-model="form.numeroCertificado" />
    </el-form-item>
    <el-form-item label="Certificado Digital">
      <el-upload
        action=""
        :auto-upload="false"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        drag
        list-type="picture-card"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Arrastra el archivo aquí o haz clic para cargar</div>
      </el-upload>
      <el-dialog v-model="previewDialogVisible">
        <img :src="form.certificadoDigital" alt="Preview Image" width="100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="editarInspector">Guardar Cambios</el-button>
      <el-button @click="closeAndReset">Cancelar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import supabase from '@/supabase';

export default {
  props: {
    inspector: Object,
  },
  data() {
    return {
      form: {
        tipoInspeccion: '',
        entidadCertificadora: '',
        fechaEmision: '',
        fechaCaducidad: '',
        numeroCertificado: '',
        certificadoDigital: '',
        nombreCompleto: '',
      },
      tiposInspeccion: [],
      fileList: [],
      previewDialogVisible: false,
    };
  },
  watch: {
    inspector: {
      immediate: true,
      handler(newInspector) {
        if (newInspector) {
          this.loadInspectorData();
        }
      },
    },
  },
  async created() {
    const { data, error } = await supabase.rpc('obtener_tipos_inspeccion');
    if (error) {
      console.error('Error al obtener tipos de inspección:', error.message);
    } else {
      this.tiposInspeccion = data;
    }
  },
  methods: {
    async loadInspectorData() {
      const { data, error } = await supabase
        .from('inspector')
        .select(`
          tipo_de_inspeccion_id,
          entidad_certificadora,
          fecha_de_emision_de_certificado,
          fecha_de_caducidad_de_certificado,
          numero_certificado,
          certificado_digital,
          asistente_de_operaciones_pe (nombres, apellido_paterno, apellido_materno)
        `)
        .eq('id', this.inspector.id)
        .single();

      if (error) {
        console.error('Error al obtener datos del inspector:', error.message);
      } else {
        this.form = {
          tipoInspeccion: data.tipo_de_inspeccion_id,
          entidadCertificadora: data.entidad_certificadora,
          fechaEmision: data.fecha_de_emision_de_certificado,
          fechaCaducidad: data.fecha_de_caducidad_de_certificado,
          numeroCertificado: data.numero_certificado,
          certificadoDigital: data.certificado_digital
            ? `https://qyfrfgcefvwpkqtzjjxi.supabase.co/storage/v1/object/public/${data.certificado_digital}`
            : '',
          nombreCompleto: `${data.asistente_de_operaciones_pe.nombres} ${data.asistente_de_operaciones_pe.apellido_paterno} ${data.asistente_de_operaciones_pe.apellido_materno}`,
        };
      }
    },
    handlePreview(file) {
      this.previewDialogVisible = true;
      this.form.certificadoDigital = file.url;
    },
    async beforeUpload(file) {
      const { data, error } = await supabase.storage
        .from('certificados_de_personal')
        .upload(`Certificados_Inspectores/${encodeURIComponent(file.name)}`, file, {
          upsert: true,
        });

      if (error) {
        console.error('Error al subir certificado:', error.message);
        alert('No se pudo subir el archivo');
        return false;
      } else {
        this.form.certificadoDigital = `https://qyfrfgcefvwpkqtzjjxi.supabase.co/storage/v1/object/public/${data.path}`;
        return true;
      }
    },
    async editarInspector() {
      const updateData = {
        tipo_de_inspeccion_id: this.form.tipoInspeccion,
        entidad_certificadora: this.form.entidadCertificadora,
        fecha_de_emision_de_certificado: this.form.fechaEmision,
        fecha_de_caducidad_de_certificado: this.form.fechaCaducidad,
        numero_certificado: this.form.numeroCertificado,
      };

      if (this.form.certificadoDigital) {
        updateData.certificado_digital = this.form.certificadoDigital;
      }

      const { error } = await supabase
        .from('inspector')
        .update(updateData)
        .eq('id', this.inspector.id);

      if (error) {
        console.error('Error al actualizar el inspector:', error.message);
        alert('Error al actualizar el inspector');
      } else {
        alert('Inspector actualizado con éxito');
        this.$emit('refreshTable');
        this.closeAndReset();
      }
    },
    resetForm() {
      this.form = {
        tipoInspeccion: '',
        entidadCertificadora: '',
        fechaEmision: '',
        fechaCaducidad: '',
        numeroCertificado: '',
        certificadoDigital: '',
        nombreCompleto: '',
      };
      this.fileList = [];
    },
    closeAndReset() {
      this.resetForm();
      this.$emit('closeModal');
    },
  },
};
</script>

<style scoped>
.el-upload__text {
  margin-top: 10px;
}
</style>
