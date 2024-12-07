<template>
  <el-form ref="formRegistro" :model="form" label-width="120px" label-position="top" class="responsive-form">
    <h2 class="text-center">Registrar Inspector</h2>

    <!-- Asistente de Operaciones -->
    <el-form-item label="Asistente de Operaciones">
      <el-select v-model="form.asistenteOperacionesId" placeholder="Seleccione un asistente" filterable>
        <el-option
          v-for="asistente in asistentesOperaciones"
          :key="asistente.id"
          :label="asistente.nombre_completo"
          :value="asistente.id"
        />
      </el-select>
    </el-form-item>

    <!-- Tipo de Inspección -->
    <el-form-item label="Tipo de Inspección">
      <el-select v-model="form.tipoInspeccion" placeholder="Seleccione el tipo de inspección" filterable>
        <el-option
          v-for="tipo in tiposInspeccion"
          :key="tipo.tipo_id"
          :label="tipo.nombre_inspeccion"
          :value="tipo.tipo_id"
        />
      </el-select>
    </el-form-item>

    <!-- Entidad Certificadora -->
    <el-form-item label="Entidad Certificadora">
      <el-input v-model="form.entidadCertificadora" placeholder="Ingrese la entidad certificadora" />
    </el-form-item>

    <!-- Número de Certificado -->
    <el-form-item label="Número de Certificado">
      <el-input v-model="form.numeroCertificado" placeholder="Ingrese el número del certificado" />
    </el-form-item>

    <!-- Fecha de Emisión -->
    <el-form-item label="Fecha de Emisión">
      <el-date-picker v-model="form.fechaEmision" type="date" placeholder="Seleccione la fecha de emisión" />
    </el-form-item>

    <!-- Fecha de Caducidad -->
    <el-form-item label="Fecha de Caducidad">
      <el-date-picker v-model="form.fechaCaducidad" type="date" placeholder="Seleccione la fecha de caducidad" />
    </el-form-item>

    <!-- Subir Certificado Digital -->
    <el-form-item label="Certificado Digital">
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="handleFileChange"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Arrastra el archivo o haz clic para subir</div>
        <div class="el-upload__tip" slot="tip">Solo archivos PDF. Máx 2MB</div>
      </el-upload>
    </el-form-item>

    <!-- Botones de Acción -->
    <el-form-item class="form-actions">
      <el-button type="primary" @click="registrarInspector">Registrar</el-button>
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
        tipoInspeccion: '',
        entidadCertificadora: '',
        numeroCertificado: '',
        fechaEmision: '',
        fechaCaducidad: '',
        certificadoDigitalUrl: '',
      },
      asistentesOperaciones: [],
      tiposInspeccion: [],
      selectedFile: null, // Almacenar el archivo seleccionado para subir
    };
  },
  async created() {
    try {
      // Obtener tipos de inspección
      const { data: tipos, error: errorTipos } = await supabase.rpc('obtener_tipos_inspeccion');
      if (errorTipos) throw errorTipos;
      this.tiposInspeccion = tipos;

      // Obtener asistentes de operaciones
      const { data: asistentes, error: errorAsistentes } = await supabase.rpc('obtener_asistentes_operaciones');
      if (errorAsistentes) throw errorAsistentes;
      this.asistentesOperaciones = asistentes;
    } catch (error) {
      console.error('Error al cargar datos:', error.message);
    }
  },
  methods: {
    handleFileChange(file) {
      this.selectedFile = file.raw;
    },
    async beforeUpload() {
      try {
        if (!this.selectedFile) {
          this.$notify({
            title: 'Error',
            message: 'Por favor, selecciona un archivo de certificado',
            type: 'warning',
          });
          return false;
        }

        const filePath = `Certificados_Inspectores/${this.selectedFile.name}`;
        
        // Intenta subir el archivo al bucket especificado
        const { data, error } = await supabase.storage
          .from('certificados_de_personal')
          .upload(filePath, this.selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Asigna la URL del archivo si la subida fue exitosa
        this.form.certificadoDigitalUrl = `${supabase.storage.from('certificados_de_personal').getPublicUrl(filePath).publicURL}`;
        return true;

      } catch (error) {
        console.error('Error al subir el archivo:', error.message);
        this.$notify({
          title: 'Error',
          message: `No se pudo subir el archivo de certificado: ${error.message}`,
          type: 'error',
        });
        return false;
      }
    },
    async registrarInspector() {
      try {
        const uploadSuccess = await this.beforeUpload();
        if (!uploadSuccess) return;

        const { error } = await supabase.rpc('registrar_inspector', {
          p_asistente_operaciones_id: this.form.asistenteOperacionesId,
          p_tipo_inspeccion_id: this.form.tipoInspeccion,
          p_certificado_digital: this.form.certificadoDigitalUrl,
          p_numero_certificado: this.form.numeroCertificado,
          p_entidad_certificadora: this.form.entidadCertificadora,
          p_fecha_emision: this.form.fechaEmision,
          p_fecha_caducidad: this.form.fechaCaducidad,
        });

        if (error) throw error;
        this.$emit('refreshTable');
        this.$emit('closeModal');
        this.$notify({
          title: 'Éxito',
          message: 'Inspector registrado con éxito',
          type: 'success',
        });
      } catch (error) {
        console.error('Error al registrar inspector:', error.message);
        this.$notify({
          title: 'Error',
          message: `No se pudo registrar el inspector: ${error.message}`,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style scoped>
.responsive-form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.upload-demo {
  width: 100%;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
@media (max-width: 600px) {
  .responsive-form {
    padding: 10px;
  }
}
</style>
