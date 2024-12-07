<template>
  <el-container>
    <el-header>
      <h1>Inspecciones Como Inspector</h1>
    </el-header>
    <el-main>
      <!-- Filtros y Paginación -->
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchQuery" placeholder="Buscar..." @input="handleSearch" />
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalRecords"
          />
        </el-col>
      </el-row>

      <!-- Inspecciones -->
      <el-row>
        <el-col :span="24">
          <h2>Inspecciones</h2>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="inspections.length > 0">
        <el-col :span="8" v-for="inspection in inspections" :key="inspection.id">
          <el-card shadow="hover">
            <h3>Inspección #{{ inspection.id }}</h3>
            <p><strong>Inicio:</strong> {{ inspection.fecha_hora_inicio }}</p>
            <p><strong>Ubicación:</strong> {{ inspection.ubicacionregistrada }}</p>
            <p><strong>Tipo de Inspección:</strong> {{ inspection.tipo_inspeccion_nombre }}</p>
            <div class="inspection-actions">
              <el-button 
                type="primary" 
                @click="verificarAcceso(inspection)"
                :loading="verificandoAcceso === inspection.id"
              >
                Iniciar Inspección
              </el-button>
              <el-tag 
                v-if="inspection.evaluacionStatus" 
                :type="getEvaluacionStatusType(inspection.evaluacionStatus)"
              >
                {{ getEvaluacionStatusText(inspection.evaluacionStatus) }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <p>No hay inspecciones programadas.</p>
        </el-col>
      </el-row>
    </el-main>

    <!-- Modal de Advertencia -->
    <el-dialog
      v-model="showWarningDialog"
      title="Acceso No Permitido"
      width="30%"
    >
      <span>{{ warningMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showWarningDialog = false">Cerrar</el-button>
          <el-button 
            v-if="canRedirectToTheory"
            type="primary" 
            @click="redirectToTheoryEvaluation"
          >
            Ir a Evaluación Teórica
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { GetUser } from "@/auth";
import { supabase } from "@/supabase";

export default {
  name: "InspectorInspections",
  setup() {
    const router = useRouter();
    const inspections = ref([]);
    const totalRecords = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref("");
    const verificandoAcceso = ref(null);
    const showWarningDialog = ref(false);
    const warningMessage = ref("");
    const canRedirectToTheory = ref(false);
    const currentInspection = ref(null);

    const fetchInspections = async () => {
      const userId = GetUser();
      if (!userId) {
        console.error("No se pudo obtener el UUID del usuario.");
        return;
      }

      try {
        const { data, error, count } = await supabase
          .rpc("obtener_inspecciones_asignadas", { p_uuid: userId })
          .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);

        if (error) {
          console.error("Error al obtener inspecciones:", error.message);
        } else {
          inspections.value = data;
          totalRecords.value = count || 0;
        }
      } catch (error) {
        console.error("Error inesperado al obtener inspecciones:", error);
      }
    };

    const verificarAprobacionTeorica = async (operadorId, cursoId) => {
      try {
        const { data, error } = await supabase
          .from("evaluacion_teorica")
          .select("calificacion, estado")
          .eq("fk_operador", operadorId)
          .eq("fk_curso", cursoId)
          .single();

        if (error) {
          console.error("Error al verificar evaluación teórica:", error);
          return { aprobado: false, estado: "no_iniciada" };
        }

        return {
          aprobado: data?.calificacion >= 14,
          estado: data?.estado || "no_iniciada",
          calificacion: data?.calificacion
        };
      } catch (error) {
        console.error("Error inesperado al verificar evaluación teórica:", error);
        return { aprobado: false, estado: "error" };
      }
    };

    const verificarAcceso = async (inspection) => {
      verificandoAcceso.value = inspection.id;
      currentInspection.value = inspection;

      try {
        const resultado = await verificarAprobacionTeorica(
          inspection.fk_operador,
          inspection.fk_curso
        );

        if (!resultado.aprobado) {
          showWarningDialog.value = true;
          canRedirectToTheory.value = true;
          
          if (resultado.estado === "no_iniciada") {
            warningMessage.value = "Debe completar y aprobar la evaluación teórica antes de acceder a la inspección práctica.";
          } else if (resultado.estado === "reprobado") {
            warningMessage.value = `No ha aprobado la evaluación teórica. Calificación actual: ${resultado.calificacion}/20`;
          } else {
            warningMessage.value = "No se encontró una evaluación teórica aprobada para este curso.";
          }
        } else {
          goToInspection(inspection.id);
        }
      } catch (error) {
        console.error("Error al verificar acceso:", error);
        warningMessage.value = "Error al verificar el acceso. Por favor, intente nuevamente.";
        showWarningDialog.value = true;
        canRedirectToTheory.value = false;
      } finally {
        verificandoAcceso.value = null;
      }
    };

    const redirectToTheoryEvaluation = () => {
      if (currentInspection.value) {
        router.push({
          path: '/evaluacion-teorica',
          query: {
            curso: currentInspection.value.fk_curso,
            retorno: router.currentRoute.value.fullPath
          }
        });
      }
      showWarningDialog.value = false;
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchInspections();
    };

    const handleSearch = () => {
      fetchInspections();
    };

    const goToInspection = (inspectionId) => {
      router.push(`/operations-assistant-dashboard/realizarinspeccion/${inspectionId}`);
    };

    const getEvaluacionStatusType = (status) => {
      switch (status) {
        case 'aprobado': return 'success';
        case 'reprobado': return 'danger';
        case 'pendiente': return 'warning';
        default: return 'info';
      }
    };

    const getEvaluacionStatusText = (status) => {
      switch (status) {
        case 'aprobado': return 'Aprobado';
        case 'reprobado': return 'Reprobado';
        case 'pendiente': return 'Pendiente';
        default: return 'Sin evaluación';
      }
    };

    watch([currentPage, pageSize], fetchInspections, { immediate: true });

    return {
      inspections,
      totalRecords,
      currentPage,
      pageSize,
      searchQuery,
      verificandoAcceso,
      showWarningDialog,
      warningMessage,
      canRedirectToTheory,
      handlePageChange,
      handleSearch,
      verificarAcceso,
      redirectToTheoryEvaluation,
      getEvaluacionStatusType,
      getEvaluacionStatusText
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin: 20px 0 10px;
}

.el-card {
  margin: 10px 0;
}

.inspection-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.el-tag {
  margin-left: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Estados de evaluación */
.el-tag.el-tag--success {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

.el-tag.el-tag--danger {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.el-tag.el-tag--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

.el-tag.el-tag--info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
</style>