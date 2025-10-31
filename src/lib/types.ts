export type PeriodoEvaluacion = {
  id: number;
  nombre: string;
  porcentaje: number;
};

export type Calificacion = {
  id: number;
  calificacion: number;
  faltas: number;
  observaciones: string | null;
  periodo_evaluacion: PeriodoEvaluacion;
  asignatura_docente: {
    cicloEscolar: string;
    asignatura: { nombre: string };
    docente: { nombre: string; apellidos: string };
    horarios: {
      dia_semana: string;
      hora_inicio: string;
      hora_fin: string;
      aula: string;
    }[];
  };
};

export type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  carrera: { nombre: true };
  asignaciones: {
    id: number;
    asignatura_docente: {
      asignatura: { nombre: string };
      docente: { nombre: string; apellidos: string };
      horarios: {
        dia_semana: string;
        hora_inicio: string;
        hora_fin: string;
        aula: string;
      }[];
    };
  }[];
  calificaciones: Calificacion[];
};
