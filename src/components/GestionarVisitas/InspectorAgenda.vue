<template>
  <div>
    <!-- Selección de Inspector -->
    <el-form-item label="Inspector">
      <el-select v-model="selectedInspectorId" placeholder="Seleccione un inspector" @change="fetchInspectorAgenda">
        <el-option
          v-for="inspector in inspectores"
          :key="inspector.id"
          :label="`${inspector.entidad_certificadora} - Certificado No. ${inspector.numero_certificado}`"
          :value="inspector.id"
        />
      </el-select>
    </el-form-item>

    <!-- Calendario de Inspecciones -->
    <vue-cal
      v-if="inspectorAgenda.length"
      :events="inspectorAgenda"
      :time="true"
      :on-event-click="onEventClick"
      style="height: 600px"
      default-view="week"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import supabase from '@/supabase';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: { VueCal },
  props: {
    tipoDeInspeccionId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const inspectores = ref([]);
    const selectedInspectorId = ref(null);
    const inspectorAgenda = ref([]);

    // Función para cargar los inspectores que pueden realizar este tipo de inspección
    const fetchInspectores = async () => {
      const { data, error } = await supabase.rpc('fetch_inspectores_por_tipo_de_inspeccion', { p_tipo_de_inspeccion_id: props.tipoDeInspeccionId });
      if (error) {
        console.error('Error al obtener inspectores:', error.message);
      } else {
        inspectores.value = data;
      }
    };

    // Función para cargar la agenda del inspector seleccionado
    const fetchInspectorAgenda = async () => {
      if (!selectedInspectorId.value) return;

      const { data, error } = await supabase
        .from('inspeccion')
        .select('fecha_hora_inicio, fecha_hora_fin')
        .eq('inspector_id', selectedInspectorId.value)
        .order('fecha_hora_inicio', { ascending: true });

      if (error) {
        console.error('Error al obtener agenda del inspector:', error.message);
      } else {
        inspectorAgenda.value = data.map((inspeccion) => ({
          start: inspeccion.fecha_hora_inicio,
          end: inspeccion.fecha_hora_fin,
          title: 'Inspección'
        }));
      }
    };

    // Función para mostrar detalles al hacer clic en un evento
    const onEventClick = (event) => {
      alert(`Detalles de la inspección:\nInicio: ${event.start}\nFin: ${event.end}`);
    };

    onMounted(() => {
      fetchInspectores();
    });

    return {
      inspectores,
      selectedInspectorId,
      inspectorAgenda,
      fetchInspectorAgenda,
      onEventClick
    };
  }
};
</script>

<style scoped>
/* Agrega algunos estilos para el calendario */
.vuecal {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
