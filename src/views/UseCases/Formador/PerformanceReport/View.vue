<template>
    <div class="report-container">
        <h1>Informe de Evaluaciones</h1>
        <div v-if="evaluaciones.length === 0">
            <p>No se encontraron evaluaciones registradas.</p>
        </div>
        <div v-else>
            <table class="tabla-evaluaciones">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Operador</th>
                        <th>Documento</th>
                        <th>Curso</th>
                        <th>Nota</th>
                        <th>Aprobado</th>
                        <th>Fecha de Realización</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="evaluacion in evaluaciones" :key="evaluacion.id">
                        <td>{{ evaluacion.id }}</td>
                        <td>{{ evaluacion.operador }}</td>
                        <td>{{ evaluacion.nro_documento }}</td>
                        <td>{{ evaluacion.curso }}</td>
                        <td>{{ evaluacion.nota }}</td>
                        <td>{{ evaluacion.aprobado ? "Sí" : "No" }}</td>
                        <td>{{ evaluacion.fecha }}</td>
                        <td>
                            <button class="view-button" @click="abrirModal(evaluacion)">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="download-button" @click="generarPDF(evaluacion)">
                                Descargar PDF
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal para mostrar detalles de la evaluación -->
        <div v-if="modalVisible" class="modal-overlay">
            <div class="modal-content">
                <img src="@/assets/SELLO_FLK.png" alt="Logo FLK" class="logo-modal" />
                <h2>Detalles de la Evaluación</h2>
                <p><strong>ID:</strong> {{ evaluacionSeleccionada.id }}</p>
                <p><strong>Operador:</strong> {{ evaluacionSeleccionada.operador }}</p>
                <p><strong>Documento:</strong> {{ evaluacionSeleccionada.nro_documento }}</p>
                <p><strong>Curso:</strong> {{ evaluacionSeleccionada.curso }}</p>
                <p><strong>Nota:</strong> {{ evaluacionSeleccionada.nota }}</p>
                <p><strong>Aprobado:</strong> {{ evaluacionSeleccionada.aprobado ? "Sí" : "No" }}</p>
                <p><strong>Fecha de Realización:</strong> {{ evaluacionSeleccionada.fecha }}</p>
                <h3>Respuestas:</h3>
                <ul>
                    <li v-for="(respuesta, index) in evaluacionSeleccionada.respuestas || []" :key="index">
                        {{ index + 1 }}: {{ respuesta }}
                    </li>
                </ul>
                <h3>Respuestas Correctas:</h3>
                <ul>
                    <li v-for="(respuesta, index) in evaluacionSeleccionada.respuestas_correctas || []" :key="index">
                        {{ index + 1 }}: {{ respuesta }}
                    </li>
                </ul>
                <button class="close-button" @click="cerrarModal">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script>
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
    name: "PerformanceReport",
    setup() {
        const evaluaciones = ref([]);
        const modalVisible = ref(false);
        const evaluacionSeleccionada = ref(null);

        const cargarEvaluaciones = async () => {
            try {
                const { data, error: supabaseError } = await supabase
                    .from("evaluaciones_teoricas")
                    .select(`
                        id,
                        fk_curso(titulo_curso),
                        fk_alumno(nombre, apellidos, nro_documento),
                        respuestas,
                        respuestas_correctas,
                        nota,
                        aprobado,
                        fecha_realizacion
                    `);

                if (supabaseError) throw new Error(supabaseError.message);

                evaluaciones.value = data.map((evaluacion) => ({
                    id: evaluacion.id,
                    operador: `${evaluacion.fk_alumno.nombre} ${evaluacion.fk_alumno.apellidos}`,
                    nro_documento: evaluacion.fk_alumno.nro_documento || "Sin documento",
                    curso: evaluacion.fk_curso.titulo_curso || "Curso no especificado",
                    nota: evaluacion.nota || 0,
                    aprobado: evaluacion.aprobado || false,
                    respuestas: evaluacion.respuestas
                        ? (typeof evaluacion.respuestas === "string"
                            ? JSON.parse(evaluacion.respuestas)
                            : evaluacion.respuestas)
                        : [],
                    respuestas_correctas: evaluacion.respuestas_correctas
                        ? (typeof evaluacion.respuestas_correctas === "string"
                            ? JSON.parse(evaluacion.respuestas_correctas)
                            : evaluacion.respuestas_correctas)
                        : [],
                    fecha: evaluacion.fecha_realizacion
                        ? new Date(evaluacion.fecha_realizacion).toLocaleString()
                        : "Fecha no disponible",
                }));
            } catch (err) {
                console.error("Error al cargar evaluaciones:", err.message);
            }
        };

        const abrirModal = (evaluacion) => {
            evaluacionSeleccionada.value = evaluacion;
            modalVisible.value = true;
        };

        const cerrarModal = () => {
            modalVisible.value = false;
            evaluacionSeleccionada.value = null;
        };

        const generarPDF = (evaluacion) => {
            try {
                const doc = new jsPDF();
                
                // Configuración inicial
                doc.setFont("helvetica");
                
                // Encabezado
                doc.setFontSize(20);
                doc.setTextColor(231, 76, 60); // Color rojo del header
                doc.text("Informe de Evaluación Teórica", 105, 20, { align: "center" });
                
                // Información del estudiante
                doc.setFontSize(12);
                doc.setTextColor(0);
                
                const infoEstudiante = [
                    ["ID:", evaluacion.id],
                    ["Operador:", evaluacion.operador],
                    ["Documento:", evaluacion.nro_documento],
                    ["Curso:", evaluacion.curso],
                    ["Nota:", evaluacion.nota],
                    ["Estado:", evaluacion.aprobado ? "APROBADO" : "NO APROBADO"],
                    ["Fecha:", evaluacion.fecha]
                ];

                doc.autoTable({
                    startY: 30,
                    head: [],
                    body: infoEstudiante,
                    theme: 'plain',
                    styles: {
                        cellPadding: 2,
                        fontSize: 12
                    },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 40 },
                        1: { cellWidth: 'auto' }
                    }
                });

                // Tabla de respuestas
                const respuestasData = [];
                evaluacion.respuestas.forEach((respuesta, index) => {
                    respuestasData.push([
                        index + 1,
                        respuesta,
                        evaluacion.respuestas_correctas[index],
                        respuesta === evaluacion.respuestas_correctas[index] ? "✓" : "✗"
                    ]);
                });

                doc.autoTable({
                    startY: doc.lastAutoTable.finalY + 15,
                    head: [['#', 'Respuesta del Estudiante', 'Respuesta Correcta', 'Estado']],
                    body: respuestasData,
                    headStyles: {
                        fillColor: [231, 76, 60],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    styles: {
                        halign: 'center',
                        valign: 'middle',
                        fontSize: 10,
                        cellPadding: 3
                    }
                });

                // Pie de página
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text(
                        `Página ${i} de ${pageCount}`,
                        doc.internal.pageSize.width / 2,
                        doc.internal.pageSize.height - 10,
                        { align: "center" }
                    );
                }

                // Guardar el PDF
                doc.save(`Informe_${evaluacion.operador.replace(/\s+/g, '_')}_${evaluacion.id}.pdf`);
            } catch (error) {
                console.error("Error al generar el PDF:", error.message);
            }
        };

        onMounted(() => {
            cargarEvaluaciones();
        });

        return {
            evaluaciones,
            modalVisible,
            evaluacionSeleccionada,
            abrirModal,
            cerrarModal,
            generarPDF,
        };
    },
};
</script>

<style scoped>
.report-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    text-align: center;
    margin-bottom: 05px;
    color: #333;
}

h3 {
    text-align: center;
    margin-bottom: 05px;
    color: #333;
}

.tabla-evaluaciones {
    background-color: #ffffff;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.tabla-evaluaciones th,
.tabla-evaluaciones td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.tabla-evaluaciones th {
    background-color: #e74c3c;
    color: white;
    font-weight: bold;
}

.download-button {
    background-color: #ecfa24;
    color: rgb(3, 3, 3);
    border: none;
    padding: 5px 10px;
    border-radius: 9px;
    cursor: pointer;
}

.view-button {
    background-color: #1e748a;
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 9px;
    cursor: pointer;
}

.view-button:hover {
    background-color: #4fb4c2;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 50%;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1000;
    font-family: Arial, sans-serif;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo-modal {
    width: 200px;
    height: auto;
}

.close-button {
    background-color: #189dc5;
    color: white;
    border: none;
    padding: 5px 9px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}
</style>