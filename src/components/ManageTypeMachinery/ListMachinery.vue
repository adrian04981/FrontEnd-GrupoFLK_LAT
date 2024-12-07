<template>
  <div class="machinery-container">
    <!-- Botón para crear nueva maquinaria -->
    <el-button type="primary" class="neon-button create-button" @click="showCreateDialog = true">Crear Tipo de Maquinaria</el-button>

    <!-- Contenedor de la tabla para hacerla deslizable en pantallas pequeñas -->
    <div class="table-responsive">
      <table id="machinery-table" class="display" style="width:100%">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(maquinaria, index) in maquinarias" :key="index">
            <td>{{ maquinaria.descripcion }}</td>
            <td>
              <button class="btn btn-primary" @click="openEditDialog(maquinaria)">Editar</button>
              <button class="btn btn-danger" @click="openDeleteDialog(maquinaria)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Diálogo para Crear -->
    <el-dialog v-model="showCreateDialog" title="Crear Tipo de Maquinaria" :modal-append-to-body="false">
      <CreateMachinery @created="handleCreated" />
    </el-dialog>

    <!-- Diálogo para Editar -->
    <el-dialog v-model="showEditDialog" title="Editar Tipo de Maquinaria" :modal-append-to-body="false">
      <EditMachinery :machinery="selectedMachinery" @updated="handleUpdated" />
    </el-dialog>

    <!-- Diálogo para Eliminar -->
    <el-dialog v-model="showDeleteDialog" title="Eliminar Tipo de Maquinaria" :modal-append-to-body="false">
      <DeleteMachinery :maquinariaId="machineryToDelete.id" @deleted="handleDeleted" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import { supabase } from '@/supabase'
import $ from 'jquery'
import 'datatables.net'
import CreateMachinery from '@/components/ManageTypeMachinery/CreateMachinery.vue'
import EditMachinery from '@/components/ManageTypeMachinery/EditMachinery.vue'
import DeleteMachinery from '@/components/ManageTypeMachinery/DeleteMachinery.vue'

const maquinarias = ref([]) // Datos obtenidos de Supabase
const selectedMachinery = ref(null)
const machineryToDelete = ref(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

// Función para obtener los datos de maquinaria desde Supabase
async function fetchMachineries() {
  const { data, error } = await supabase
    .from('tipo_de_maquinaria')
    .select('*')

  if (error) {
    console.error('Error al obtener tipos de maquinaria:', error)
  } else {
    maquinarias.value = data
    initializeDataTable() // Inicializar DataTable después de cargar los datos
  }
}

// Función para inicializar DataTables
function initializeDataTable() {
  $(document).ready(function () {
    $('#machinery-table').DataTable({
      searching: true,
      paging: true,
      info: true,
      responsive: true,
      autoWidth: false,
      destroy: true, // Añadir la opción para destruir la tabla y evitar problemas de recarga
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

// Funciones para abrir los diálogos
function openEditDialog(maquinaria) {
  selectedMachinery.value = maquinaria
  showEditDialog.value = true
}

function openDeleteDialog(maquinaria) {
  machineryToDelete.value = maquinaria
  showDeleteDialog.value = true
}

function handleCreated() {
  showCreateDialog.value = false
  fetchMachineries() // Actualiza la lista después de crear
}

function handleUpdated() {
  showEditDialog.value = false
  fetchMachineries() // Actualiza la lista después de editar
}

function handleDeleted() {
  showDeleteDialog.value = false
  fetchMachineries() // Actualiza la lista después de eliminar
}

// Ejecutar la carga de datos al montar el componente
onMounted(() => {
  fetchMachineries()
})
</script>

<style scoped>
/* Contenedor para hacer la tabla responsiva */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  margin-top: 15px;
}

/* Estilos para los botones */
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

/* Ajustar el tamaño del botón crear en pantallas pequeñas */
.create-button {
  margin-bottom: 10px;
  width: 100%;
}

/* Tabla estilizada */
#machinery-table {
  width: 100%;
  border-collapse: collapse;
}

#machinery-table th, #machinery-table td {
  padding: 10px;
  text-align: left;
}

/* Estilos responsivos para móviles y tablets */
@media (max-width: 768px) {
  .machinery-container {
    padding: 10px;
  }

  #machinery-table th, #machinery-table td {
    font-size: 12px;
    padding: 8px;
  }

  .btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  #machinery-table th, #machinery-table td {
    font-size: 10px;
    padding: 6px;
  }

  .btn {
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>
