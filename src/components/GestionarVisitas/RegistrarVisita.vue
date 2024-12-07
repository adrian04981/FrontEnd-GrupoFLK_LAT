<template>
  <el-form :model="newInspection" ref="inspectionForm" label-width="200px">
    <!-- Selección de Empresa -->
    <el-form-item label-width="auto" label-position="top" prop="empresa_id">
      Empresa
      <div style="display: flex; align-items: center; width: 100%;">
        <el-select
          v-model="selectedEmpresaId"
          placeholder="Seleccione una empresa"
          @change="fetchRepresentantes"
          style="flex-grow: 1; margin-right: 10px;"
        >
          <el-option
            v-for="empresa in empresas"
            :key="empresa.id"
            :label="empresa.nombre_comercial"
            :value="empresa.id"
          />
        </el-select>
        <button type="button" class="button" @click="openRegistrarEmpresa">
          <span class="button__text">Registrar</span>
          <span class="button__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" class="svg">
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
      </div>
    </el-form-item>

    <!-- Selección de Representante -->
    <el-form-item label-width="auto" label-position="top" prop="representante_id">
      Representante de Empresa
      <div style="display: flex; align-items: center; width: 100%;">
        <el-select
          v-model="selectedRepresentanteId"
          placeholder="Seleccione un representante"
          @change="fetchMaquinarias"
          style="flex-grow: 1; margin-right: 10px;"
        >
          <el-option
            v-for="representante in representantes"
            :key="representante.id"
            :label="`${representante.nombre} ${representante.apellido_paterno} ${representante.apellido_materno}`"
            :value="representante.id"
          />
        </el-select>
        <button type="button" class="button" @click="openRegistrarRepresentante">
          <span class="button__text">Registrar</span>
          <span class="button__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" class="svg">
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
      </div>
    </el-form-item>

    <!-- Selección de Maquinaria -->
    <el-form-item label-width="auto" label-position="top" prop="maquinariaxrepresentante_de_empresa_id">
      Maquinaria
      <div style="display: flex; align-items: center; width: 100%;">
        <el-select
          v-model="newInspection.maquinariaxrepresentante_de_empresa_id"
          placeholder="Seleccione una maquinaria"
          @change="handleMaquinariaChange"
          style="flex-grow: 1; margin-right: 10px;"
        >
          <el-option
            v-for="maquinaria in maquinarias"
            :key="maquinaria.id"
            :label="`${maquinaria.descripcion} - ${maquinaria.placa || 'Sin placa'}`"
            :value="maquinaria.id"
          />
        </el-select>
        <button type="button" class="button" @click="openRegistrarMaquinaria">
          <span class="button__text">Registrar</span>
          <span class="button__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" class="svg">
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
      </div>
    </el-form-item>

    <!-- Selección de Tipo de Inspección -->
    <el-form-item label-width="auto" label-position="top" prop="tipo_de_inspeccion">
      Tipo de Inspección
      <div style="display: flex; align-items: center; width: 100%;">
        <el-select
          v-model="newInspection.tipo_de_inspeccion"
          placeholder="Seleccione un tipo de inspección"
          @change="fetchInspectoresCertificadores"
          style="flex-grow: 1; margin-right: 10px;"
        >
          <el-option
            v-for="tipo in tiposDeInspeccion"
            :key="tipo.id"
            :label="tipo.nombre"
            :value="tipo.id"
          />
        </el-select>
      </div>
    </el-form-item>

    <!-- Selección de Fecha -->
    <el-form-item label="Fecha de Inspección">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="Seleccionar fecha"
        :disabled-date="disablePastDates"
      />
    </el-form-item>

    <!-- Selección de Turno -->
    <el-form-item label="Turno de Inspección">
      <el-select v-model="selectedTurno" placeholder="Seleccione un turno">
        <el-option label="Turno Mañana (08:00 - 12:00)" value="mañana" />
        <el-option label="Turno Tarde (13:00 - 17:00)" value="tarde" />
      </el-select>
    </el-form-item>

    <!-- Ubicación Registrada -->
    <el-form-item label="Ubicación Registrada" prop="ubicacionregistrada">
      <el-input v-model="newInspection.ubicacionregistrada" />
    </el-form-item>

    <!-- Selección de Inspector -->
    <el-form-item label="Inspector" prop="inspector_id" :rules="[{ validator: validateInspectorCertificador, message: 'Inspector y certificador no pueden ser la misma persona', trigger: 'change' }]">
      <el-select v-model="newInspection.inspector_id" placeholder="Seleccione un inspector">
        <el-option
          v-for="inspector in inspectores"
          :key="inspector.id"
          :label="`${inspector.nombre} ${inspector.apellido_paterno} ${inspector.apellido_materno}`"
          :value="inspector.id"
        />
      </el-select>
    </el-form-item>

    <!-- Selección de Certificador -->
    <el-form-item label="Certificador" prop="certificador_id" :rules="[{ validator: validateInspectorCertificador, message: 'Inspector y certificador no pueden ser la misma persona', trigger: 'change' }]">
      <el-select v-model="newInspection.certificador_id" placeholder="Seleccione un certificador">
        <el-option
          v-for="certificador in certificadores"
          :key="certificador.id"
          :label="`${certificador.nombre} ${certificador.apellido_paterno} ${certificador.apellido_materno}`"
          :value="certificador.id"
        />
      </el-select>
    </el-form-item>

    <!-- Horarios de la Semana -->
<el-form-item label="Horario Semanal">
  <div v-for="(horarios, dia) in horariosSemana" :key="dia">
    <el-row>
      <el-col :span="6">
        <span>{{ dia.charAt(0).toUpperCase() + dia.slice(1) }}:</span>
      </el-col>
      <el-col :span="9">
        <el-time-picker
          v-model="horarios.inicio"
          is-range
          placeholder="Hora de inicio"
          format="HH:mm"
          :disabled="horarios.fin"
        />
      </el-col>
      <el-col :span="9">
        <el-time-picker
          v-model="horarios.fin"
          is-range
          placeholder="Hora de fin"
          format="HH:mm"
          :disabled="!horarios.inicio"
        />
      </el-col>
    </el-row>
  </div>
</el-form-item>

    <!-- Botones de Acción -->
    <el-button type="primary" @click="submitInspection">Registrar</el-button>
    <el-button @click="closeComponent">Cancelar</el-button>
  </el-form>

  <!-- Modals for Registration -->
  <el-dialog v-model="isRegistrarEmpresaVisible" width="50%">
    <RegistrarEmpresa @closeModal="closeRegistrarEmpresa" @refreshTable="fetchEmpresas" />
  </el-dialog>
  <el-dialog v-model="isRegistrarRepresentanteVisible" width="50%">
    <RegistrarRepresentante :empresaId="selectedEmpresaId" @closeModal="closeRegistrarRepresentante" @refreshTable="fetchRepresentantes" />
  </el-dialog>
  <el-dialog v-model="isRegistrarMaquinariaVisible" width="50%">
    <RegistrarMaquinaria :representanteId="selectedRepresentanteId" @closeModal="closeRegistrarMaquinaria" @refreshTable="fetchMaquinarias" />
  </el-dialog>
</template>

<script>
import RegistrarEmpresa from '@/components/GestionarEmpresas/Registrar.vue';
import RegistrarRepresentante from '@/components/GestionarEmpresas/GestionarRepresentantes/Registrar.vue';
import RegistrarMaquinaria from '@/components/GestionarEmpresas/GestionarRepresentantes/GestionarMaquinaria/Registrar.vue';
import { ref, reactive, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';
import { ElMessageBox, ElMessage } from 'element-plus';
export default {
  components: {
    RegistrarEmpresa,
    RegistrarRepresentante,
    RegistrarMaquinaria,
  },
  setup(_, { emit }) {
    const newInspection = reactive({
      maquinariaxrepresentante_de_empresa_id: null,
      inspector_id: null,
      certificador_id: null,
      fecha_hora_inicio: null,
      fecha_hora_fin: null,
      ubicacionregistrada: '',
      Estado: 'registrado',
      tipo_de_inspeccion: null,
      autor: null,
      ultimo_autor: null,
      fecha_de_creacion: null,
      fecha_de_modificacion: null,
    });

    const selectedDate = ref(null);
    const selectedTurno = ref(null);

    const selectedEmpresaId = ref(null);
    const selectedRepresentanteId = ref(null);
    const empresas = ref([]);
    const representantes = ref([]);
    const maquinarias = ref([]);
    const tiposDeInspeccion = ref([]);
    const inspectores = ref([]);
    const certificadores = ref([]);

    const isRegistrarEmpresaVisible = ref(false);
    const isRegistrarRepresentanteVisible = ref(false);
    const isRegistrarMaquinariaVisible = ref(false);

    // Función para deshabilitar fechas pasadas
    const disablePastDates = (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Asegurar que solo compara fechas, no horas
      return date < today;
    };
    const horariosSemana = reactive({
  lunes: { inicio: '', fin: '' },
  martes: { inicio: '', fin: '' },
  miercoles: { inicio: '', fin: '' },
  jueves: { inicio: '', fin: '' },
  viernes: { inicio: '', fin: '' },
  sabado: { inicio: '', fin: '' },
  domingo: { inicio: '', fin: '' },
});


    const resetInspectionData = () => {
      selectedRepresentanteId.value = null;
      newInspection.maquinariaxrepresentante_de_empresa_id = null;
      newInspection.tipo_de_inspeccion = null;
      tiposDeInspeccion.value = [];
      maquinarias.value = [];
      representantes.value = [];
      inspectores.value = [];
      certificadores.value = [];
      selectedDate.value = null;
      selectedTurno.value = null;
    };

    const fetchEmpresas = async () => {
      try {
        const { data, error } = await supabase
          .from('empresa')
          .select('id, nombre_comercial')
          .eq('Estado', true);
        if (error) throw error;
        empresas.value = data || [];
      } catch (err) {
        console.error('Error al obtener empresas:', err.message);
      }
    };

    const fetchRepresentantes = async () => {
      resetInspectionData();
      if (selectedEmpresaId.value) {
        try {
          const { data, error } = await supabase.rpc('fetch_representantes_por_empresa', {
            p_empresa_id: selectedEmpresaId.value,
          });
          if (error) throw error;
          representantes.value = data || [];
        } catch (err) {
          console.error('Error al obtener representantes:', err.message);
        }
      }
    };

    const fetchMaquinarias = async () => {
      maquinarias.value = [];
      tiposDeInspeccion.value = [];
      newInspection.tipo_de_inspeccion = null;
      if (selectedRepresentanteId.value) {
        try {
          const { data, error } = await supabase.rpc('fetch_maquinarias_por_representante', {
            p_representante_id: selectedRepresentanteId.value,
          });
          if (error) throw error;
          maquinarias.value = data || [];
        } catch (err) {
          console.error('Error al obtener maquinarias:', err.message);
        }
      }
    };

    const fetchTiposDeInspeccion = async (tipoDeMaquinariaId) => {
      if (tipoDeMaquinariaId) {
        try {
          const { data, error } = await supabase.rpc('fetch_tipos_de_inspeccion_por_maquinaria', {
            p_tipo_de_maquinaria_id: tipoDeMaquinariaId,
          });
          if (error) throw error;
          tiposDeInspeccion.value = data || [];
        } catch (err) {
          console.error('Error al obtener tipos de inspección:', err.message);
        }
      } else {
        tiposDeInspeccion.value = [];
      }
    };

    const fetchInspectoresCertificadores = async () => {
      if (newInspection.tipo_de_inspeccion) {
        try {
          const { data: inspectoresData, error: inspectoresError } = await supabase.rpc(
            'fetch_inspectores_por_tipo_inspeccion',
            { p_tipo_de_inspeccion_id: newInspection.tipo_de_inspeccion }
          );
          if (inspectoresError) throw inspectoresError;
          inspectores.value = inspectoresData;

          const { data: certificadoresData, error: certificadoresError } = await supabase.rpc(
            'fetch_certificadores_por_tipo_inspeccion',
            { p_tipo_de_inspeccion_id: newInspection.tipo_de_inspeccion }
          );
          if (certificadoresError) throw certificadoresError;
          certificadores.value = certificadoresData;
        } catch (err) {
          console.error('Error al obtener inspectores/certificadores:', err.message);
        }
      }
    };

    const openRegistrarEmpresa = () => {
      isRegistrarEmpresaVisible.value = true;
    };

    const closeRegistrarEmpresa = () => {
      isRegistrarEmpresaVisible.value = false;
      fetchEmpresas();
    };

    const openRegistrarRepresentante = () => {
      if (!selectedEmpresaId.value) {
        console.error('Seleccione una empresa antes de registrar un representante.');
        return;
      }
      isRegistrarRepresentanteVisible.value = true;
    };

    const closeRegistrarRepresentante = () => {
      isRegistrarRepresentanteVisible.value = false;
      fetchRepresentantes();
    };

    const openRegistrarMaquinaria = () => {
      if (!selectedRepresentanteId.value) {
        console.error('Seleccione un representante antes de registrar maquinaria.');
        return;
      }
      isRegistrarMaquinariaVisible.value = true;
    };

    const closeRegistrarMaquinaria = () => {
      isRegistrarMaquinariaVisible.value = false;
      fetchMaquinarias();
    };

    const handleMaquinariaChange = () => {
      const selectedMaquinaria = maquinarias.value.find(
        (maquinaria) => maquinaria.id === newInspection.maquinariaxrepresentante_de_empresa_id
      );

      if (selectedMaquinaria && selectedMaquinaria.tipo_de_maquinaria_id) {
        fetchTiposDeInspeccion(selectedMaquinaria.tipo_de_maquinaria_id);
      } else {
        console.error('No se pudo encontrar la maquinaria seleccionada o falta el tipo_de_maquinaria_id.');
        tiposDeInspeccion.value = [];
      }
    };

    const validateInspectorCertificador = (rule, value, callback) => {
      if (newInspection.inspector_id === newInspection.certificador_id) {
        callback(new Error('El inspector y el certificador no pueden ser la misma persona'));
      } else {
        callback();
      }
    };
    const submitInspection = async () => {
  try {
    // Validar si los campos esenciales están seleccionados
    if (!selectedDate.value || !selectedTurno.value) {
      await ElMessageBox.alert('Por favor, seleccione una fecha y turno.', 'Validación requerida', {
        type: 'warning',
      });
      return;
    }

    let fechaInicio;
let fechaFin;
const dateStr = selectedDate.value.toISOString().split('T')[0];  // Aseguramos que la fecha esté en formato ISO sin zona horaria

// Calcular las fechas de inicio y fin para cada turno
if (selectedTurno.value === 'mañana') {
  // Turno mañana de 08:00 a 12:00
  fechaInicio = new Date(`${dateStr}T08:00:00Z`);  // Aseguramos el formato UTC con 'Z' al final
  fechaFin = new Date(`${dateStr}T12:00:00Z`);
} else if (selectedTurno.value === 'tarde') {
  // Turno tarde de 13:00 a 17:00
  fechaInicio = new Date(`${dateStr}T13:00:00Z`);  // Aseguramos el formato UTC con 'Z' al final
  fechaFin = new Date(`${dateStr}T17:00:00Z`);
} else {
  await ElMessageBox.alert('Turno inválido.', 'Error', {
    type: 'error',
  });
  return;
}


    // Verificar si ya existe una inspección para el inspector en la fecha seleccionada
    const { data: inspectorInspections, error: inspectorError } = await supabase.rpc('fetch_fechas_por_inspector', {
      p_inspector_id: newInspection.inspector_id, // Usamos el ID del inspector seleccionado
    });

    if (inspectorError) throw inspectorError;

    // Verificamos si hay una inspección en el mismo rango de tiempo
    const hayConflictos = (inspections) => {
      return inspections.some((insp) => {
        const inicioExistente = new Date(insp.fecha_hora_inicio);
        const finExistente = new Date(inicioExistente);
        finExistente.setHours(finExistente.getHours() + 4); // Suponiendo que las inspecciones duran 4 horas

        return (
          (fechaInicio >= inicioExistente && fechaInicio < finExistente) || // El inicio de la nueva inspección se cruza con una existente
          (fechaFin > inicioExistente && fechaFin <= finExistente) || // El fin de la nueva inspección se cruza con una existente
          (fechaInicio <= inicioExistente && fechaFin >= finExistente) // La nueva inspección cubre toda la inspección existente
        );
      });
    };

    // Verificar conflictos con el inspector
    if (hayConflictos(inspectorInspections)) {
      await ElMessageBox.alert(
        'El inspector ya tiene una inspección registrada en esta fecha y no puede registrarse nuevamente.',
        'Conflicto detectado',
        {
          type: 'warning',
        }
      );
      return; // Detener el flujo aquí, no registrar la inspección
    }

    // Obtener inspecciones existentes del certificador
    const { data: certificadorInspections, error: certificadorError } = await supabase.rpc('fetch_fechas_por_certificador', {
      p_certificador_id: newInspection.certificador_id, // Usamos el ID del certificador seleccionado
    });
    if (certificadorError) throw certificadorError;

    // Validar conflictos con el certificador
    if (hayConflictos(certificadorInspections)) {
      await ElMessageBox.alert(
        'El horario seleccionado se cruza con otra inspección asignada al certificador.',
        'Conflicto detectado',
        {
          type: 'warning',
        }
      );
      return; // Detener el flujo aquí, no registrar la inspección
    }

    // Asignar datos de la inspección
    newInspection.fecha_hora_inicio = fechaInicio.toISOString();
    newInspection.fecha_hora_fin = fechaFin.toISOString();
    newInspection.autor = GetUser();
    newInspection.ultimo_autor = GetUser();
    newInspection.fecha_de_creacion = new Date().toISOString();
    newInspection.fecha_de_modificacion = new Date().toISOString();

    // Insertar la inspección en la base de datos
    const { data: insertedInspections, error } = await supabase.from('inspeccion').insert([newInspection]).select('id');
    if (error) throw error;

    // Obtener el ID de la inspección recién insertada
    const inspeccionId = insertedInspections[0].id;

    // Insertar en la tabla 'registro' con la nueva inspección
    const fechaMaximaEvaluacion = new Date(fechaInicio);
    fechaMaximaEvaluacion.setDate(fechaMaximaEvaluacion.getDate() + 30); // Sumar 30 días

    const registroData = {
      inspeccion_id_1: inspeccionId, // Usamos el ID de la inspección recién insertada
      maquinariaxrepresentante_de_empresa_id: newInspection.maquinariaxrepresentante_de_empresa_id, // Asume que este campo existe en 'newInspection'
      fecha_hora_registro_1: fechaInicio.toISOString(),
      fecha_maxima_de_evaluacion: fechaMaximaEvaluacion.toISOString(),
      Estado: 'en proceso 1',
    };

    const { error: registroError } = await supabase.from('registro').insert([registroData]);
    if (registroError) throw registroError;

    // Mostrar mensaje de éxito
    await ElMessageBox.alert('Inspección registrada con éxito y visita asociada.', 'Éxito', {
      type: 'success',
    });

    // Llamar a la función de actualización de tabla y restablecer los campos
    emit('refreshTable');
    resetInspectionData();
    resetAllData(); // Limpiar todos los campos después de registrar
    emit('closeModal');
  } catch (err) {
    console.error('Error al registrar la inspección:', err.message);
    await ElMessageBox.alert('Ocurrió un error al registrar la inspección. Intente nuevamente.', 'Error', {
      type: 'error',
    });
  }
};









    const resetAllData = () => {
      selectedEmpresaId.value = null;
      resetInspectionData();
    };

    const closeComponent = () => {
      resetAllData();
      emit('closeModal');
    };

    onMounted(() => {
      fetchEmpresas();
    });

    return {
      newInspection,
      selectedDate,
      disablePastDates,
      selectedTurno,
      selectedEmpresaId,
      selectedRepresentanteId,
      empresas,
      representantes,
      maquinarias,
      tiposDeInspeccion,
      inspectores,
      certificadores,
      isRegistrarEmpresaVisible,
      isRegistrarRepresentanteVisible,
      isRegistrarMaquinariaVisible,
      fetchRepresentantes,
      fetchMaquinarias,
      fetchTiposDeInspeccion,
      fetchInspectoresCertificadores,
      handleMaquinariaChange,
      validateInspectorCertificador,
      submitInspection,
      openRegistrarEmpresa,
      closeRegistrarEmpresa,
      openRegistrarRepresentante,
      closeRegistrarRepresentante,
      openRegistrarMaquinaria,
      closeRegistrarMaquinaria,
      resetAllData,
      closeComponent,
    };
  },
};
</script>

<style scoped>
.button {
  position: relative;
  width: 200px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #34974d;
  background-color: #3aa856;
}

.button, .button__icon, .button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(30px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 20px;
  background-color: #34974d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 30px;
  stroke: #fff;
}

.button:hover {
  background: #34974d;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 95%;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #2e8644;
}

.button:active {
  border: 1px solid #2e8644;
}
</style>