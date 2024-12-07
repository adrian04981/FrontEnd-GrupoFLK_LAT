<template>
  <div class="request-training">
    <div class="logo">
      <img src="@/assets/SELLO_FLK.png" alt="Logo" />
    </div>
    <div class="background-container"></div>
    <div class="main-container">
      <div class="form-container">
        <h1>Formulario de Solicitud de Capacitación</h1>
        <form @submit.prevent="submitForm" class="training-form">
          <!-- Información Personal -->
          <div class="form-section">
            <h2>Información Personal</h2>
            <div class="form-group">
              <label for="dni" class="required">DNI</label>
              <input
                type="text"
                id="dni"
                v-model="form.dni"
                @input="validateDni"
                required
                class="form-input"
                :class="{ 'is-invalid': errors.dni }"
              />
              <span v-if="errors.dni" class="error-message">{{ errors.dni }}</span>
            </div>

            <div class="form-group">
              <label for="nombre_completo" class="required">Nombre Completo</label>
              <input
                type="text"
                id="nombre_completo"
                v-model="form.nombre_completo"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="fecha_nacimiento" class="required">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                v-model="form.fecha_nacimiento"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="nacionalidad" class="required">Nacionalidad</label>
              <select
                id="nacionalidad"
                v-model="form.nacionalidad"
                required
                class="form-input"
              >
                <option value="" disabled>Seleccione un país</option>
                <option
                  v-for="pais in paises"
                  :key="pais.id"
                  :value="pais.nombre"
                >
                  {{ pais.nombre }}
                </option>
              </select>
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="form-section">
            <h2>Información de Contacto</h2>
            <div class="form-group">
              <label for="correo_electronico" class="required">Correo Electrónico</label>
              <input
                type="email"
                id="correo_electronico"
                v-model="form.correo_electronico"
                @input="validateEmail"
                required
                class="form-input"
                :class="{ 'is-invalid': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="telefono_contacto" class="required">Teléfono de Contacto</label>
              <input
                type="tel"
                id="telefono_contacto"
                v-model="form.telefono_contacto"
                @input="filterPhoneNumber('telefono_contacto')"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="direccion" class="required">Dirección</label>
              <input
                type="text"
                id="direccion"
                v-model="form.direccion"
                required
                class="form-input"
              />
            </div>
          </div>

          <!-- Información Profesional -->
          <div class="form-section">
            <h2>Información Profesional</h2>
            <div class="form-group">
              <label for="ocupacion_actual" class="required">Ocupación Actual</label>
              <input
                type="text"
                id="ocupacion_actual"
                v-model="form.ocupacion_actual"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="nombre_empresa">Nombre de la Empresa</label>
              <input
                type="text"
                id="nombre_empresa"
                v-model="form.nombre_empresa"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="cargo_actual">Cargo Actual</label>
              <input
                type="text"
                id="cargo_actual"
                v-model="form.cargo_actual"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="experiencia_maquinaria">Experiencia en Maquinaria</label>
              <textarea
                id="experiencia_maquinaria"
                v-model="form.experiencia_maquinaria"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Información del Curso -->
          <div class="form-section">
            <h2>Información del Curso</h2>
            <div class="form-group">
              <label for="fk_curso" class="required">Curso</label>
              <select
                id="fk_curso"
                v-model="form.fk_curso"
                required
                class="form-input"
              >
                <option value="" disabled>Seleccione un curso</option>
                <option
                  v-for="curso in cursos"
                  :key="curso.pk_curso"
                  :value="curso.pk_curso"
                >
                  {{ curso.titulo_curso }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="fecha_inicio_preferida">Fecha de Inicio Preferida</label>
              <input
                type="date"
                id="fecha_inicio_preferida"
                v-model="form.fecha_inicio_preferida"
                :min="today"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="turno_preferido">Turno Preferido</label>
              <select
                id="turno_preferido"
                v-model="form.turno_preferido"
                class="form-input"
              >
                <option value="" disabled>Seleccione un turno</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
          </div>

          <!-- Documentos -->
          <div class="form-section">
            <h2>Documentos</h2>
            <div class="form-group">
              <label for="dni_adjunto" class="required">DNI Adjunto</label>
              <div class="file-input-wrapper">
                <input
                  type="file"
                  id="dni_adjunto"
                  @change="handleFileUpload('dni_adjunto', $event)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  class="file-input"
                />
                <div class="file-input-custom">
                  <span class="file-name">{{ getFileName('dni_adjunto') || 'Ningún archivo seleccionado' }}</span>
                  <button type="button" class="browse-button">Examinar</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="certificado_medico_adjunto" class="required">Certificado Médico</label>
              <div class="file-input-wrapper">
                <input
                  type="file"
                  id="certificado_medico_adjunto"
                  @change="handleFileUpload('certificado_medico_adjunto', $event)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  class="file-input"
                />
                <div class="file-input-custom">
                  <span class="file-name">{{ getFileName('certificado_medico_adjunto') || 'Ningún archivo seleccionado' }}</span>
                  <button type="button" class="browse-button">Examinar</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="licencia_conducir_adjunto">Licencia de Conducir</label>
              <div class="file-input-wrapper">
                <input
                  type="file"
                  id="licencia_conducir_adjunto"
                  @change="handleFileUpload('licencia_conducir_adjunto', $event)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="file-input"
                />
                <div class="file-input-custom">
                  <span class="file-name">{{ getFileName('licencia_conducir_adjunto') || 'Ningún archivo seleccionado' }}</span>
                  <button type="button" class="browse-button">Examinar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Información Médica -->
          <div class="form-section">
            <h2>Información Médica</h2>
            <div class="form-group">
              <label for="alergias_condiciones">Alergias/Condiciones</label>
              <textarea
                id="alergias_condiciones"
                v-model="form.alergias_condiciones"
                class="form-input"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="necesidades_especiales">Necesidades Especiales</label>
              <textarea
                id="necesidades_especiales"
                v-model="form.necesidades_especiales"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Contacto de Emergencia -->
          <div class="form-section">
            <h2>Contacto de Emergencia</h2>
            <div class="form-group">
              <label for="nombre_contacto_emergencia" class="required">Nombre de Contacto</label>
              <input
                type="text"
                id="nombre_contacto_emergencia"
                v-model="form.nombre_contacto_emergencia"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="relacion_contacto_emergencia" class="required">Relación con el Contacto</label>
              <input
                type="text"
                id="relacion_contacto_emergencia"
                v-model="form.relacion_contacto_emergencia"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="telefono_contacto_emergencia" class="required">Teléfono del Contacto</label>
              <input
                type="tel"
                id="telefono_contacto_emergencia"
                v-model="form.telefono_contacto_emergencia"
                @input="filterPhoneNumber('telefono_contacto_emergencia')"
                required
                class="form-input"
              />
            </div>
          </div>

          <!-- Consentimientos -->
          <div class="form-section">
            <h2>Consentimientos</h2>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="consentimientos.consentimiento_participacion"
                />
                <span>Consentimiento de Participación</span>
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="consentimientos.autorizacion_imagen"
                />
                <span>Autorización de Imagen</span>
              </label>
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="consentimientos.consentimiento_tratamiento_datos"
                />
                <span>Consentimiento para Tratamiento de Datos</span>
              </label>
            </div>
            <span v-if="!allCheckboxesChecked" class="error-message">
              Debe aceptar todos los consentimientos
            </span>
          </div>

          <!-- Firma -->
          <div class="form-section">
            <h2>Firma</h2>
            <div class="form-group">
              <label for="firma" class="required">Firma Digital</label>
              <div class="file-input-wrapper">
                <input
                  type="file"
                  id="firma"
                  @change="handleFileUpload('firma', $event)"
                  accept=".jpg,.jpeg,.png"
                  required
                  class="file-input"
                />
                <div class="file-input-custom">
                  <span class="file-name">{{ getFileName('firma') || 'Ningún archivo seleccionado' }}</span>
                  <button type="button" class="browse-button">Examinar</button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="!isFormValid"
            :class="{ 'button-disabled': !isFormValid }"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase'
import Swal from 'sweetalert2'

export default {
  name: 'RequestTraining',
  setup() {
    const form = ref({
      nombre_completo: '',
      nro_telefonico: '',
      dni: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono_contacto: '',
      correo_electronico: '',
      nacionalidad: '',
      ocupacion_actual: '',
      nombre_empresa: '',
      cargo_actual: '',
      experiencia_maquinaria: '',
      nombre_contacto_emergencia: '',
      relacion_contacto_emergencia: '',
      telefono_contacto_emergencia: '',
      fk_curso: null,
      fecha_inicio_preferida: '',
      turno_preferido: '',
      dni_adjunto: null,
      certificado_medico_adjunto: null,
      licencia_conducir_adjunto: null,
      alergias_condiciones: '',
      necesidades_especiales: '',
      firma: null
    })

    const fileNames = ref({
      dni_adjunto: '',
      certificado_medico_adjunto: '',
      licencia_conducir_adjunto: '',
      firma: ''
    })

    const consentimientos = ref({
      consentimiento_participacion: false,
      autorizacion_imagen: false,
      consentimiento_tratamiento_datos: false
    })

    const errors = ref({
      dni: '',
      email: ''
    })

    const paises = ref([])
    const cursos = ref([])
    const today = ref(new Date().toISOString().split('T')[0])

    const validateDni = async () => {
      if (!/^\d+$/.test(form.value.dni)) {
        errors.value.dni = 'El DNI debe contener solo números'
        return false
      }

      const { data, error } = await supabase
        .from('solicitud_capacitacion')
        .select('dni')
        .eq('dni', form.value.dni)
        .single()

      if (data) {
        errors.value.dni = 'Este DNI ya está registrado'
        return false
      }

      errors.value.dni = ''
      return true
    }

    const validateEmail = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.value.correo_electronico)) {
        errors.value.email = 'Correo electrónico inválido'
        return false
      }

      const { data, error } = await supabase
        .from('solicitud_capacitacion')
        .select('correo_electronico')
        .eq('correo_electronico', form.value.correo_electronico)
        .single()

      if (data) {
        errors.value.email = 'Este correo ya está registrado'
        return false
      }

      errors.value.email = ''
      return true
    }

    const isFormValid = computed(() => {
      return (
        !errors.value.dni &&
        !errors.value.email &&
        form.value.dni &&
        form.value.correo_electronico &&
        allCheckboxesChecked.value
      )
    })

    const allCheckboxesChecked = computed(() => {
      return Object.values(consentimientos.value).every(value => value)
    })

    const getFileName = (field) => {
      return fileNames.value[field]
    }

    const loadData = async () => {
      try {
        const { data: paisData, error: paisError } = await supabase
          .from('pais')
          .select('id, nombre')
        if (paisError) throw paisError
        paises.value = paisData

        const { data: cursoData, error: cursoError } = await supabase
          .from('cursos')
          .select('pk_curso, titulo_curso')
        if (cursoError) throw cursoError
        cursos.value = cursoData
      } catch (error) {
        console.error('Error al cargar datos:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los datos iniciales'
        })
      }
    }

    const handleFileUpload = (field, event) => {
      const file = event.target.files[0]
      form.value[field] = file
      fileNames.value[field] = file ? file.name : ''
    }

    const filterPhoneNumber = (field) => {
      form.value[field] = form.value[field].replace(/[^0-9]/g, '')
    }

    const submitForm = async () => {
  try {
    // Primero validamos el DNI y el correo electrónico antes de proceder
    const isValidDni = await validateDni()
    const isValidEmail = await validateEmail()

    if (!isValidDni || !isValidEmail) {
      return
    }

    if (!isFormValid.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, corrija los errores del formulario'
      })
      return
    }

    const formData = {
      ...form.value,
      ...consentimientos.value
    }

    const { error } = await supabase
      .from('solicitud_capacitacion')
      .insert([formData])

    if (error) throw error

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Solicitud enviada correctamente'
    })

    // Reset form
    form.value = {
      nombre_completo: '',
      nro_telefonico: '',
      dni: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono_contacto: '',
      correo_electronico: '',
      nacionalidad: '',
      ocupacion_actual: '',
      nombre_empresa: '',
      cargo_actual: '',
      experiencia_maquinaria: '',
      nombre_contacto_emergencia: '',
      relacion_contacto_emergencia: '',
      telefono_contacto_emergencia: '',
      fk_curso: null,
      fecha_inicio_preferida: '',
      turno_preferido: '',
      dni_adjunto: null,
      certificado_medico_adjunto: null,
      licencia_conducir_adjunto: null,
      alergias_condiciones: '',
      necesidades_especiales: '',
      firma: null
    }
    
    fileNames.value = {
      dni_adjunto: '',
      certificado_medico_adjunto: '',
      licencia_conducir_adjunto: '',
      firma: ''
    }

    consentimientos.value = {
      consentimiento_participacion: false,
      autorizacion_imagen: false,
      consentimiento_tratamiento_datos: false
    }

  } catch (error) {
    console.error('Error al enviar formulario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al enviar la solicitud'
    })
  }
}

    onMounted(loadData)

    return {
      form,
      paises,
      cursos,
      handleFileUpload,
      submitForm,
      today,
      filterPhoneNumber,
      consentimientos,
      allCheckboxesChecked,
      errors,
      validateDni,
      validateEmail,
      isFormValid,
      getFileName
    }
  }
}
</script>

<style scoped>
.request-training {
  min-height: 100vh;
  position: relative;
}

.background-container {
  background-image: url("@/assets/imagen-Solicitud.jpg");
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.15;
}

.logo {
  text-align: center;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo img {
  width: auto;
  height: 80px;
}

.main-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.form-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

label.required::after {
  content: "*";
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.is-invalid {
  border-color: #dc2626;
}

.error-message {
  display: block;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-input-custom {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
}

.file-name {
  flex: 1;
  margin-right: 1rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.browse-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-button:hover {
  background-color: #2563eb;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  cursor: pointer;
}

button[type="submit"] {
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 2rem;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #2563eb;
}

button[type="submit"]:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-section h2 {
    font-size: 1.125rem;
  }

  .logo img {
    height: 60px;
  }
}
</style>