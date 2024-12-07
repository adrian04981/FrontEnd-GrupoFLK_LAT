<template>
  <div class="inspection-view">
    <el-card>
      <h2>Buscar Inspecciones por RUC</h2>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="RUC" prop="ruc">
          <el-input
            v-model="searchForm.ruc"
            placeholder="Ingrese el RUC"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchInspections">Buscar</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="inspections" v-if="inspections.length > 0" border>
        <el-table-column
          prop="fecha_hora"
          label="Fecha"
          :formatter="(row) => new Date(row.fecha_hora).toLocaleDateString()"
        />
        <el-table-column prop="placa" label="Placa" />
        <el-table-column prop="estado" label="Estado" />
        <el-table-column>
          <template #default="scope">
            <el-button
              type="success"
              @click="generateCertificate(scope.row)"
            >
              Generar Certificado
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="No se encontraron resultados." />
    </el-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase";
import jsPDF from "jspdf";
import { backgroundImage } from "@/assets/backgroundImage"; // Imagen en Base64

export default {
  name: "ListarInspeccionesPorRUC",
  setup() {
    const searchForm = ref({
      ruc: "",
    });
    const inspections = ref([]);

    const fetchInspections = async () => {
      inspections.value = [];
      if (!searchForm.value.ruc || isNaN(searchForm.value.ruc) || searchForm.value.ruc.length !== 11) {
        console.error("Por favor, ingrese un RUC válido de 11 dígitos.");
        return;
      }

      try {
        const { data, error } = await supabase.rpc("obtener_inspecciones_por_ruc", {
          p_ruc: parseInt(searchForm.value.ruc, 10),
        });

        if (error) {
          console.error("Error al obtener inspecciones:", error.message);
          return;
        }

        inspections.value = data || [];
      } catch (err) {
        console.error("Error inesperado:", err);
      }
    };

    const generateCertificate = (inspection) => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.addImage(backgroundImage, "PNG", 0, 0, pageWidth, pageHeight);
      // Título
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Certificado de Inspección", pageWidth / 2, 40, { align: "center" });

      // Información de la inspección
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      const startX = 20;
      let startY = 100;

      doc.text(`Fecha de Inspección: ${new Date(inspection.fecha_hora).toLocaleDateString()}`, startX, startY);
      startY += 10;
      doc.text(`Placa: ${inspection.placa}`, startX, startY);
      startY += 10;
      doc.text(`Estado: ${inspection.estado}`, startX, startY);
      startY += 10;
      doc.text(`Inspector: ${inspection.inspector_nombre} ${inspection.inspector_apellido}`, startX, startY);
      startY += 10;
      doc.text(`Certificador: ${inspection.certificador_nombre} ${inspection.certificador_apellido}`, startX, startY);
      startY += 10;
      doc.text(`Razón Social: ${inspection.empresa_razon_social}`, startX, startY);
      startY += 10;
      doc.text(`Nombre Comercial: ${inspection.empresa_nombre_comercial}`, startX, startY);
      startY += 10;
      doc.text(`Dirección Central: ${inspection.direccion_central}`, startX, startY);

      // Generar el PDF
      const fileName = `Certificado_${inspection.placa}_${inspection.id}.pdf`;
      doc.save(fileName);
    };

    return {
      searchForm,
      inspections,
      fetchInspections,
      generateCertificate,
    };
  },
};
</script>

<style scoped>
.inspection-view {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.el-card {
  padding: 20px;
}

.el-empty {
  text-align: center;
  margin-top: 20px;
}
</style>