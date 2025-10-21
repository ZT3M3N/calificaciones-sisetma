import { useEffect, useState } from "react";
import type { Student, Teacher, Subject, Group } from "@/lib/types";

export function useData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [studentsRes, teachersRes, subjectsRes, groupsRes] = await Promise.all([
          fetch('/api/estudiantes'),
          fetch('/api/teachers'),
          fetch('/api/asignaturas'),
          fetch('/api/grupos')
        ]);

        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const subjectsData = await subjectsRes.json();
        const groupsData = await groupsRes.json();

        // Transform the data to match your frontend types
        setStudents(studentsData.map((student: any) => ({
          id: student.id.toString(),
          name: `${student.nombre} ${student.apellidos}`,
          email: student.correo,
          enrollmentNumber: student.matricula,
          career: student.carrera,
          assignedSubjects: [],  // You might need to fetch these relationships separately
          assignedTeachers: [],  // You might need to fetch these relationships separately
          assignedGroups: [],    // You might need to fetch these relationships separately
          grades: []            // You might need to fetch grades separately
        })));

        setTeachers(teachersData.map((teacher: any) => ({
          id: teacher.id.toString(),
          name: `${teacher.nombre} ${teacher.apellidos}`,
          email: teacher.correo,
          department: "General" // You might want to add department to your schema
        })));

        setSubjects(subjectsData.map((subject: any) => ({
          id: subject.id.toString(),
          name: subject.nombre,
          code: subject.clave,
          credits: subject.creditos
        })));

        setGroups(groupsData.map((group: any) => ({
          id: group.id.toString(),
          name: group.nombre,
          capacity: group.capacidadMaxima || 30,
          enrolled: 0  // You might want to calculate this from actual enrollments
        })));

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    students,
    teachers,
    subjects,
    groups,
    loading,
    error,
    setStudents,  // Expose the setters in case we need to update the state
    setTeachers,
    setSubjects,
    setGroups
  };
}