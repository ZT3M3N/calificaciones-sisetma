// types/index.ts

export type Docente = {
  id: string
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

export type Grupo = {
  id: string
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

export type Carrera = {
  id: string
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

export type Materia = {
  id: string
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

export type AlumnoWithRelations = {
  id: string
  nombre: string
  apellido: string
  email: string
  grado: string
  docenteId: string
  grupoId: string
  carreraId: string
  createdAt?: Date
  updatedAt?: Date
  docente: Docente
  grupo: Grupo
  carrera: Carrera
  materias: {
    id: string
    alumnoId: string
    materiaId: string
    materia: Materia
    createdAt?: Date
  }[]
}

export type AlumnoFormData = {
  nombre: string
  apellido: string
  email: string
  docenteId: string
  grupoId: string
  grado: string
  carreraId: string
  materiaIds: string[]
}

// Tipo para crear un nuevo alumno
export type CreateAlumnoInput = AlumnoFormData

// Tipo para actualizar un alumno existente
export type UpdateAlumnoInput = AlumnoFormData

// Tipo para estadísticas
export type EstadisticasAlumnos = {
  totalAlumnos: number
  carrerasActivas: number
  materiasAsignadas: number
  alumnosPorCarrera: Record<string, number>
  alumnosPorGrado: Record<string, number>
}