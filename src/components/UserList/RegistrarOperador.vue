<template>
  <div class="register-form">
    <h2 class="text-center mb-4">Registrar Operador</h2>

    <el-form :model="form" @submit.prevent="registrarOperador">
      <el-form-item label="Nombre" required>
        <el-input v-model="form.nombre" placeholder="Ingrese el nombre"></el-input>
      </el-form-item>

      <el-form-item label="Apellidos" required>
        <el-input v-model="form.apellidos" placeholder="Ingrese los apellidos"></el-input>
      </el-form-item>

      <el-form-item label="Fecha de Nacimiento" required>
        <el-date-picker v-model="form.fecha_nacimiento" type="date" placeholder="Seleccione la fecha"></el-date-picker>
      </el-form-item>

      <el-form-item label="Número de Documento" required>
        <el-input v-model="form.nro_documento" placeholder="Ingrese el número de documento"></el-input>
      </el-form-item>

      <el-form-item label="Número Telefónico" required>
        <el-input v-model="form.nro_telefonico" placeholder="Ingrese el número telefónico"></el-input>
      </el-form-item>

      <el-form-item label="Tipo de Documento" required>
        <el-select v-model="form.Fk_tipodocumento" placeholder="Seleccione el tipo de documento">
          <el-option
            v-for="tipo in tiposDocumento"
            :key="tipo.id"
            :label="tipo.nombre"
            :value="tipo.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Correo Electrónico" required>
        <el-input v-model="form.correo_electronico" placeholder="Ingrese el correo electrónico"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="registrarOperador">Registrar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { GetUser } from '@/auth'; // Correcta importación de GetUser

export default {
  name: 'RegistrarOperador',
  setup() {
    const form = ref({
      nombre: '',
      apellidos: '',
      fecha_nacimiento: '',
      nro_documento: '',
      nro_telefonico: '',
      Fk_tipodocumento: null,
      correo_electronico: ''
    });
    const tiposDocumento = ref([]);

    const fetchTiposDocumento = async () => {
      const { data, error } = await supabase.rpc('obtener_tip_documento');
      if (error) {
        console.error('Error al obtener tipos de documento:', error.message);
      } else {
        tiposDocumento.value = data;
      }
    };

    const registrarOperador = async () => {
      try {
        const autor = GetUser(); // Obtiene el UUID del usuario logeado
        const ultimoAutor = GetUser(); // Puedes poner otro valor si prefieres tener diferente "autor" y "último autor"

        const { error } = await supabase.rpc('registrar_operador', {
          p_nombre: form.value.nombre,
          p_apellidos: form.value.apellidos,
          p_fecha_nacimiento: form.value.fecha_nacimiento,
          p_nro_documento: form.value.nro_documento,
          p_nro_telefonico: form.value.nro_telefonico,
          p_Fk_tipodocumento: form.value.Fk_tipodocumento,
          p_correo_electronico: form.value.correo_electronico,
          p_autor: autor,  // Pasamos el UUID del autor
          p_ultimo_autor: ultimoAutor  // Pasamos el UUID del último autor
        });

        if (error) {
          console.error('Error al registrar operador:', error.message);
          alert('Error al registrar el operador');
        } else {
          alert('Operador registrado exitosamente');
          form.value = {
            nombre: '',
            apellidos: '',
            fecha_nacimiento: '',
            nro_documento: '',
            nro_telefonico: '',
            Fk_tipodocumento: null,
            correo_electronico: ''
          };
        }
      } catch (error) {
        console.error('Error al registrar operador:', error.message);
      }
    };

    onMounted(fetchTiposDocumento);

    return {
      form,
      tiposDocumento,
      registrarOperador
    };
  }
};
</script>

<style scoped>
.register-form {
  max-width: 600px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}
</style>
