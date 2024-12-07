<template>
  <div class="inspection-list-container">
    <el-button type="primary" @click="showCreateDialog = true">Crear Tipo de Inspección</el-button>

    <!-- Contenedor de la tabla para DataTables.net -->
    <div class="table-responsive">
      <table id="inspection-table" class="display" style="width:100%">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo de Maquinaria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inspection, index) in inspections" :key="index">
            <td>{{ inspection.nombre }}</td>
            <td>{{ inspection.descripcion }}</td>
            <td>{{ getMachineryDescription(inspection.tipo_de_maquinaria_id) }}</td>
            <td>
              <button class="btn btn-primary" @click="openEditDialog(inspection)">Editar</button>
              <button class="btn btn-danger" @click="openDeleteDialog(inspection)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Diálogos para Crear, Editar y Eliminar -->
    <el-dialog v-model="showCreateDialog" title="Crear Tipo de Inspección" :modal-append-to-body="false">
      <CreateInspection @created="fetchInspections" @close="showCreateDialog = false" />
    </el-dialog>

    <el-dialog v-model="showEditDialog" title="Editar Tipo de Inspección" :modal-append-to-body="false">
      <EditInspection :inspection="selectedInspection" @updated="fetchInspections" />
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="Eliminar Tipo de Inspección" :modal-append-to-body="false">
      <DeleteInspection :inspectionId="selectedInspection.id" @deleted="fetchInspections" @close="showDeleteDialog = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import { supabase } from '@/supabase'
import $ from 'jquery'
import 'datatables.net'

import CreateInspection from './CreateInspection.vue'
import EditInspection from './EditInspection.vue'
import DeleteInspection from './DeleteInspection.vue'
import { GetUser } from '@/auth'

const inspections = ref([])
const maquinarias = ref([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedInspection = ref(null)

async function fetchInspections() {
  const { data: inspectionsData, error: inspectionError } = await supabase
    .from('tipo_de_inspeccion')
    .select('*')

  if (inspectionError) console.error('Error fetching inspections:', inspectionError)
  inspections.value = inspectionsData

  const { data: maquinariaData, error: maquinariaError } = await supabase
    .from('tipo_de_maquinaria')
    .select('*')

  if (maquinariaError) console.error('Error fetching maquinarias:', maquinariaError)
  maquinarias.value = maquinariaData

  initializeDataTable()
}

function initializeDataTable() {
  $(document).ready(function () {
    $('#inspection-table').DataTable({
      searching: true,
      paging: true,
      info: true,
      responsive: true,
      autoWidth: false,
      destroy: true, // Esto es necesario para evitar problemas al recargar la tabla
      language: {
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      }
    })
  })
}

function getMachineryDescription(maquinariaId) {
  const maquinaria = maquinarias.value.find((m) => m.id === maquinariaId)
  return maquinaria ? maquinaria.descripcion : 'N/A'
}

function openEditDialog(inspection) {
  selectedInspection.value = inspection
  showEditDialog.value = true
}

function openDeleteDialog(inspection) {
  selectedInspection.value = inspection
  showDeleteDialog.value = true
}

onMounted(() => {
  fetchInspections()
})
</script>

<style scoped>
.inspection-list-container {
  padding: 20px;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 20px;
}

.btn {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .el-button {
    width: 100%;
    margin-bottom: 10px;
  }

  .table-responsive {
    width: 100%;
  }

  .btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>