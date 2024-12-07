<template>
  <el-form ref="formRegistro" :model="form" label-width="120px">
    <el-form-item label="Asistente de Operaciones">
      <el-select v-model="form.asistenteOperacionesId" placeholder="Seleccione Asistente">
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
      <el-select v-model="form.tipoInspeccionId" placeholder="Seleccione Tipo de Inspección">
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
        <div class="el-upload__text">Arrastra o haz clic para cargar el archivo</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="registrarCertificador">Registrar</el-button>
      <el-button @click="$emit('closeModal')">Cancelar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import supabase from '@/supabase';

export default {
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
    async registrarCertificador() {
  const { error } = await supabase.rpc('registrar_certificador', {
    p_asistente_operaciones_id: this.form.asistenteOperacionesId,
    p_tipo_inspeccion_id: this.form.tipoInspeccionId,
    p_certificado_digital: this.form.certificadoDigital,
    p_numero_certificado: this.form.numeroCertificado,
    p_entidad_certificadora: this.form.entidadCertificadora,
    p_fecha_emision: this.form.fechaEmision,
    p_fecha_caducidad: this.form.fechaCaducidad,
  });

  if (error) {
    console.error('Error al registrar el certificador:', error.message);
    alert('Error al registrar el certificador');
  } else {
    alert('Certificador registrado con éxito');
    this.$emit('refreshTable');
    this.$emit('closeModal');
  }
},
  },
};
</script>

<style scoped>
.el-upload__text {
  margin-top: 10px;
}
</style>
