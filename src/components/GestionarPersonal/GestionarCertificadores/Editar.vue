<template>
  <el-form ref="formEdicion" :model="form" label-width="120px">
    <el-form-item label="Asistente de Operaciones">
      <el-select v-model="form.asistenteOperacionesId" disabled>
        <el-option
          v-for="asistente in asistentesOperaciones"
          :key="asistente.id"
          :label="asistente.nombre_completo"
          :value="asistente.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Entidad Certificadora">
      <el-input v-model="form.entidadCertificadora" />
    </el-form-item>
    <el-form-item label="Tipo de Inspección">
      <el-select v-model="form.tipoInspeccionId">
        <el-option
          v-for="tipo in tiposInspeccion"
          :key="tipo.tipo_id"
          :label="tipo.nombre_inspeccion"
          :value="tipo.tipo_id"
        />
      </el-select>
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
        drag
        list-type="picture-card"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Arrastra el archivo aquí o haz clic para cargar</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="editarCertificador">Guardar Cambios</el-button>
      <el-button @click="closeAndReset">Cancelar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import supabase from '@/supabase';

export default {
  props: {
    certificador: Object,
  },
  data() {
    return {
      form: {
        asistenteOperacionesId: '',
        tipoInspeccionId: '',
        entidadCertificadora: '',
        fechaEmision: '',
        fechaCaducidad: '',
        numeroCertificado: '',
        certificadoDigital: '',
      },
      asistentesOperaciones: [],
      tiposInspeccion: [],
      fileList: [],
    };
  },
  async created() {
    await this.fetchAsistentesOperaciones();
    await this.fetchTiposInspeccion();
    this.loadCertificadorData();
  },
  methods: {
    async fetchAsistentesOperaciones() {
      const { data, error } = await supabase.rpc('obtener_asistentes_operaciones');
      if (error) {
        console.error('Error al obtener asistentes de operaciones:', error.message);
      } else {
        this.asistentesOperaciones = data;
      }
    },
    async fetchTiposInspeccion() {
      const { data, error } = await supabase.rpc('obtener_tipos_inspeccion');
      if (error) {
        console.error('Error al obtener tipos de inspección:', error.message);
      } else {
        this.tiposInspeccion = data;
      }
    },
    async loadCertificadorData() {
      const { data, error } = await supabase
        .from('certificador')
        .select(`asistente_de_operaciones_id, tipo_inspeccion_id, entidad_certificadora, fecha_de_emision_de_certificado, fecha_de_caducidad_de_certificado, numero_certificado, certificado_digital`)
        .eq('id', this.certificador.id)
        .single();

      if (error) {
        console.error('Error al obtener datos del certificador:', error.message);
      } else {
        this.form = {
          asistenteOperacionesId: data.asistente_de_operaciones_id,
          tipoInspeccionId: data.tipo_inspeccion_id,
          entidadCertificadora: data.entidad_certificadora,
          fechaEmision: data.fecha_de_emision_de_certificado,
          fechaCaducidad: data.fecha_de_caducidad_de_certificado,
          numeroCertificado: data.numero_certificado,
          certificadoDigital: data.certificado_digital,
        };
      }
    },
    async beforeUpload(file) {
      const { data, error } = await supabase.storage
        .from('certificados_de_personal')
        .upload(`/Certificados_Certificadores/${file.name}`, file);
      if (error) {
        console.error('Error al subir el certificado:', error.message);
        alert('No se pudo subir el archivo');
        return false;
      } else {
        this.form.certificadoDigital = data.path;
        return true;
      }
    },
    async editarCertificador() {
      const updateData = {
        tipo_inspeccion_id: this.form.tipoInspeccionId,
        entidad_certificadora: this.form.entidadCertificadora,
        fecha_de_emision_de_certificado: this.form.fechaEmision,
        fecha_de_caducidad_de_certificado: this.form.fechaCaducidad,
        numero_certificado: this.form.numeroCertificado,
        certificado_digital: this.form.certificadoDigital || null,
      };

      const { error } = await supabase
        .from('certificador')
        .update(updateData)
        .eq('id', this.certificador.id);

      if (error) {
        console.error('Error al actualizar el certificador:', error.message);
        alert('Error al actualizar el certificador');
      } else {
        alert('Certificador actualizado con éxito');
        this.$emit('refreshTable');
        this.closeAndReset();
      }
    },
    closeAndReset() {
      this.form = {
        asistenteOperacionesId: '',
        tipoInspeccionId: '',
        entidadCertificadora: '',
        fechaEmision: '',
        fechaCaducidad: '',
        numeroCertificado: '',
        certificadoDigital: '',
      };
      this.fileList = [];
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
