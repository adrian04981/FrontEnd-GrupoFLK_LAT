<template>
    <div class="container pt-5">
      <h1>Gestión de Entidades</h1>
  
      <!-- Filtros de búsqueda -->
      <div class="row mb-3">
        <div class="col-auto">
          <div class="input-group input-group-sm">
            <label for="name-filter" class="input-group-text">Filtrar por nombre:</label>
            <input type="text" class="form-control" id="name-filter" v-model="nameFilter">
          </div>
        </div>
        <div class="col-auto">
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" placeholder="Buscar en todos los campos..." v-model="globalSearch">
            <button class="btn btn-outline-secondary" type="button" @click="clearFilters">Limpiar</button>
          </div>
        </div>
      </div>
  
      <!-- Tabla de Asistentes de Operaciones -->
      <h2>Asistentes de Operaciones</h2>
      <table class="table table-striped" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asistente in paginatedAsistentes" :key="asistente.id">
            <td>{{ asistente.id }}</td>
            <td>{{ asistente.nombres }}</td>
            <td>{{ asistente.email }}</td>
            <td>{{ asistente.telefono }}</td>
            <td>{{ asistente.dni }}</td>
            <td>
              <button class="btn btn-info btn-sm" @click="consultarAsistente(asistente.id)">Consultar</button>
              <button class="btn btn-warning btn-sm" @click="editarAsistente(asistente.id)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="eliminarAsistente(asistente.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Tabla de Certificadores -->
      <h2>Certificadores</h2>
      <table class="table table-striped" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número Certificado</th>
            <th>Entidad Certificadora</th>
            <th>Fecha Emisión</th>
            <th>Fecha Caducidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="certificador in paginatedCertificadores" :key="certificador.id">
            <td>{{ certificador.id }}</td>
            <td>{{ certificador.numero_certificado }}</td>
            <td>{{ certificador.entidad_certificadora }}</td>
            <td>{{ new Date(certificador.fecha_de_emision_de_certificado).toLocaleDateString() }}</td>
            <td>{{ new Date(certificador.fecha_de_caducidad_de_certificado).toLocaleDateString() }}</td>
            <td>
              <button class="btn btn-info btn-sm" @click="consultarCertificador(certificador.id)">Consultar</button>
              <button class="btn btn-warning btn-sm" @click="editarCertificador(certificador.id)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="eliminarCertificador(certificador.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Tabla de Inspectores -->
      <h2>Inspectores</h2>
      <table class="table table-striped" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número Certificado</th>
            <th>Entidad Certificadora</th>
            <th>Fecha Emisión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inspector in paginatedInspectores" :key="inspector.id">
            <td>{{ inspector.id }}</td>
            <td>{{ inspector.numero_certificado }}</td>
            <td>{{ inspector.entidad_certificadora }}</td>
            <td>{{ new Date(inspector.fecha_de_emision_de_certificado).toLocaleDateString() }}</td>
            <td>
              <button class="btn btn-info btn-sm" @click="consultarInspector(inspector.id)">Consultar</button>
              <button class="btn btn-warning btn-sm" @click="editarInspector(inspector.id)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="eliminarInspector(inspector.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Paginación -->
      <div class="row justify-content-between mb-3">
        <div class="col-auto">
          <div class="input-group input-group-sm">
            <label for="page-select" class="input-group-text">Página:</label>
            <select class="form-select" id="page-select" v-model="pageSize">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
        </div>
        <div class="col-auto">
          <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  
      <!-- Modales de CRUD para cada tabla -->
      <ConsultarAsistente v-if="showConsultarModal" @close="showConsultarModal = false" :id="asistenteId" />
      <ConsultarCertificador v-if="showConsultarModalCert" @close="showConsultarModalCert = false" :id="certificadorId" />
      <ConsultarInspector v-if="showConsultarModalIns" @close="showConsultarModalIns = false" :id="inspectorId" />
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase.js';
  import ConsultarAsistente from '@/components/GestionarPersonal/AsistentedeOperaciones/ConsultarAsistente.vue';
  import ConsultarCertificador from '@/components/GestionarPersonal/Certificador/ConsultarCertificador.vue';
  import ConsultarInspector from '@/components/GestionarPersonal/Inspector/ConsultaInspector.vue';
  import EditarAsistente from '@/components/GestionarPersonal/AsistentedeOperaciones/EditarAsistente.vue';
  import EditarCertificador from '@/components/GestionarPersonal/Certificador/EditarCertificador.vue';
  import EditarInspector from '@/components/GestionarPersonal/Inspector/EditarInspector.vue';
  import EliminarAsistente from '@/components/GestionarPersonal/AsistentedeOperaciones/EliminarAsistente.vue';
  import EliminarCertificador from '@/components/GestionarPersonal/Certificador/EliminarCertificador.vue';
  import EliminarInspector from '@/components/GestionarPersonal/Inspector/EliminarInspector.vue';

  export default {  
    components: {
      ConsultarAsistente,
      ConsultarCertificador,
      ConsultarInspector,
    },
    data() {
      return {
        asistentes: [],
        certificadores: [],
        inspectores: [],
        nameFilter: '',
        globalSearch: '',
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 15, 20],
        asistenteId: null,
        certificadorId: null,
        inspectorId: null,
        showConsultarModal: false,
        showConsultarModalCert: false,
        showConsultarModalIns: false,
      };
    },
    computed: {
      // Similar filtered and paginated data for the other tables
      filteredAsistentes() {
        return this.asistentes.filter(asistente => {
          const matchesName = asistente.nombres.toLowerCase().includes(this.nameFilter.toLowerCase());
          const matchesGlobalSearch = Object.values(asistente).some(value =>
            value.toString().toLowerCase().includes(this.globalSearch.toLowerCase())
          );
          return matchesName && matchesGlobalSearch;
        });
      },
      paginatedAsistentes() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredAsistentes.slice(start, end);
      },
      // Certificadores e Inspectores similar
    },
    created() {
      this.fetchAsistentes();
      this.fetchCertificadores();
      this.fetchInspectores();
    },
    methods: {
      async fetchAsistentes() {
        let { data: asistentes, error } = await supabase.from('asistente_de_operaciones_pe').select('*');
        if (!error) this.asistentes = asistentes;
      },
      async fetchCertificadores() {
        let { data: certificadores, error } = await supabase.from('certificador').select('*');
        if (!error) this.certificadores = certificadores;
      },
      async fetchInspectores() {
        let { data: inspectores, error } = await supabase.from('inspector').select('*');
        if (!error) this.inspectores = inspectores;
      },
      async fetchAsistentes() {
        let { data: asistentes, error } = await supabase
          .from('asistente_de_operaciones_pe')
          .select('*');
        if (!error) this.asistentes = asistentes;
      },
      async fetchCertificadores() {
        let { data: certificadores, error } = await supabase
          .from('certificador')
          .select('*');
        if (!error) this.certificadores = certificadores;
      },
      async fetchInspectores() {
        let { data: inspectores, error } = await supabase
          .from('inspector')
          .select('*');
        if (!error) this.inspectores = inspectores;
      },
      consultarAsistente(id) {
        this.asistenteId = id;
        this.showConsultarModal = true;
      },
      consultarCertificador(id) {
        this.certificadorId = id;
        this.showConsultarModalCert = true;
      },
      consultarInspector(id) {
        this.inspectorId = id;
        this.showConsultarModalIns = true;
      },
      editarAsistente(id) {
        this.asistenteId = id;
        this.showEditarModal = true;
      },
      editarCertificador(id) {
        this.certificadorId = id;
        this.showEditarModalCert = true;
      },
      editarInspector(id) {
        this.inspectorId = id;
        this.showEditarModalIns = true;
      },
      eliminarAsistente(id) {
        this.asistenteId = id;
        this.showDeleteModal = true;
      },
      eliminarCertificador(id) {
        this.certificadorId = id;
        this.showDeleteModalCert = true;
      },
      eliminarInspector(id) {
        this.inspectorId = id;
        this.showDeleteModalIns = true;
      },
      clearFilters() {
        this.nameFilter = '';
        this.globalSearch = '';
        this.currentPage = 1;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      }
    }
  };
  </script>
  
  <style>
  /* Agregar estilos personalizados aquí si es necesario */
  </style>