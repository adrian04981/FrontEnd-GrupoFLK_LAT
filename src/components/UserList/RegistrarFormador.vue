<template>
    <div class="register-form">
      <h2 class="text-center mb-4">Registrar Formador</h2>
  
      <el-form :model="form" @submit.prevent="registrarFormador">
        <el-form-item label="Nombre" required>
          <el-input v-model="form.nombre" placeholder="Ingrese el nombre"></el-input>
        </el-form-item>
  
        <el-form-item label="DNI" required>
          <el-input v-model="form.dni" placeholder="Ingrese el número de DNI"></el-input>
        </el-form-item>
  
        <el-form-item label="Correo Electrónico" required>
          <el-input v-model="form.correo" placeholder="Ingrese el correo electrónico"></el-input>
        </el-form-item>
  
        <el-form-item label="Número Telefónico" required>
          <el-input v-model="form.nro_telefonico" placeholder="Ingrese el número telefónico"></el-input>
        </el-form-item>
  
        <el-form-item label="Modo de Curso" required>
          <el-select v-model="form.fk_modo_curso" placeholder="Seleccione el modo de curso">
            <el-option
              v-for="modo in modosCurso"
              :key="modo.id"
              :label="modo.nombre"
              :value="modo.id"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="registrarFormador">Registrar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { supabase } from '@/supabase';
  
  export default {
    name: 'RegistrarFormador',
    props: {
      closeDialog: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      const form = ref({
        nombre: '',
        dni: '',
        correo: '',
        nro_telefonico: '',
        fk_modo_curso: null,
      });
  
      const modosCurso = ref([]);
  
      const fetchModosCurso = async () => {
        const { data, error } = await supabase.rpc('obtener_modo_curso');
        if (error) {
          console.error('Error al obtener modos de curso:', error.message);
        } else {
          modosCurso.value = data;
        }
      };
  
      const registrarFormador = async () => {
        try {
          const { error } = await supabase.rpc('registrar_formador', {
            p_nombre: form.value.nombre,
            p_dni: form.value.dni,
            p_correo: form.value.correo,
            p_nro_telefonico: form.value.nro_telefonico,
            p_fk_modo_curso: form.value.fk_modo_curso,
          });
  
          if (error) {
            console.error('Error al registrar formador:', error.message);
            alert('Error al registrar el formador');
          } else {
            alert('Formador registrado exitosamente');
            form.value = {
              nombre: '',
              dni: '',
              correo: '',
              nro_telefonico: '',
              fk_modo_curso: null,
            };
            props.closeDialog(); // Cierra el diálogo
          }
        } catch (error) {
          console.error('Error de autenticación:', error.message);
        }
      };
  
      onMounted(() => {
        fetchModosCurso();
      });
  
      return {
        form,
        modosCurso,
        registrarFormador,
      };
    },
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
  