<template>
  <el-container>
    <el-header>
      <h1>Inspecciones Como Certificador</h1>
    </el-header>
    <el-main>
      <!-- Inspecciones de Hoy -->
      <el-row>
        <el-col :span="24">
          <h2>Inspecciones de Hoy</h2>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="todayInspections.length > 0">
        <el-col :span="8" v-for="inspection in todayInspections" :key="inspection.id">
          <el-card shadow="hover">
            <h3>Inspección #{{ inspection.id }}</h3>
            <p><strong>Inicio:</strong> {{ inspection.fecha_hora_inicio }}</p>
            <p><strong>Fin:</strong> {{ inspection.fecha_hora_fin }}</p>
            <p><strong>Ubicación:</strong> {{ inspection.ubicacionregistrada }}</p>
            <p><strong>Placa:</strong> {{ inspection.placa }}</p>
            <p>
              <strong>Representante:</strong>
              {{ inspection.representante_nombre }} {{ inspection.representante_apellido_paterno }} {{ inspection.representante_apellido_materno }}
            </p>
            <p><strong>Tipo de Inspección:</strong> {{ inspection.tipo_inspeccion_nombre }}</p>
            <p><strong>Tipo de Maquinaria:</strong> {{ inspection.tipo_maquinaria_descripcion }}</p>
            <el-button
              type="primary"
              size="small"
              @click="goToVerification(inspection.id)"
              style="margin-top: 10px;"
            >
              Verificar Inspección
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <p>No hay inspecciones programadas para hoy.</p>
        </el-col>
      </el-row>

      <!-- Inspecciones Futuras -->
      <el-row>
        <el-col :span="24">
          <h2>Inspecciones Futuras</h2>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="futureInspections.length > 0">
        <el-col :span="8" v-for="inspection in futureInspections" :key="inspection.id">
          <el-card shadow="hover">
            <h3>Inspección #{{ inspection.id }}</h3>
            <p><strong>Inicio:</strong> {{ inspection.fecha_hora_inicio }}</p>
            <p><strong>Fin:</strong> {{ inspection.fecha_hora_fin }}</p>
            <p><strong>Ubicación:</strong> {{ inspection.ubicacionregistrada }}</p>
            <p><strong>Placa:</strong> {{ inspection.placa }}</p>
            <p>
              <strong>Representante:</strong>
              {{ inspection.representante_nombre }} {{ inspection.representante_apellido_paterno }} {{ inspection.representante_apellido_materno }}
            </p>
            <p><strong>Tipo de Inspección:</strong> {{ inspection.tipo_inspeccion_nombre }}</p>
            <p><strong>Tipo de Maquinaria:</strong> {{ inspection.tipo_maquinaria_descripcion }}</p>
            <el-button
              type="primary"
              size="small"
              @click="goToVerification(inspection.id)"
              style="margin-top: 10px;"
            >
              Verificar Inspección
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <p>No hay inspecciones futuras programadas.</p>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { GetUser } from "@/auth";
import { supabase } from "@/supabase";

export default {
  name: "CertifierInspections",
  setup() {
    const router = useRouter();
    const todayInspections = ref([]);
    const futureInspections = ref([]);

    const fetchCertifierInspections = async () => {
      const userId = GetUser();
      if (!userId) {
        console.error("No se pudo obtener el UUID del usuario.");
        return;
      }

      try {
        const { data, error } = await supabase.rpc("obtener_inspecciones_como_certificador", {
          p_uuid: userId,
        });

        if (error) {
          console.error("Error al obtener las inspecciones como certificador:", error.message);
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Ajustar la hora a 00:00:00

          todayInspections.value = data.filter((inspection) => {
            const inspectionDate = new Date(inspection.fecha_hora_inicio);
            inspectionDate.setHours(0, 0, 0, 0);
            return inspectionDate.getTime() === today.getTime();
          });

          futureInspections.value = data.filter((inspection) => {
            const inspectionDate = new Date(inspection.fecha_hora_inicio);
            return inspectionDate.getTime() > today.getTime();
          });
        }
      } catch (error) {
        console.error("Error inesperado al obtener inspecciones:", error);
      }
    };

    const goToVerification = (inspectionId) => {
      router.push(`/operations-assistant-dashboard/verificarinspeccion/${inspectionId}`);
    };

    onMounted(() => {
      fetchCertifierInspections();
    });

    return {
      todayInspections,
      futureInspections,
      goToVerification,
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

p {
  margin: 5px 0;
}
</style>