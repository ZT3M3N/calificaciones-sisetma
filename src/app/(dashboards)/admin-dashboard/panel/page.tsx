"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, BookOpen, Calendar, Clock, UsersRound, Award } from "lucide-react"
import { StudentsTab } from "../../ejemplo/components/students-tab"
import { TeachersTab } from "../../ejemplo/components/teachers-tab"
import { SubjectsTab } from "../../ejemplo/components/subjects-tab"
import { CareersTab } from "../../ejemplo/components/careers-tab"
import { SchedulesTab } from "../../ejemplo/components/schedules-tab"
import { GroupsTab } from "../../ejemplo/components/groups-tab"
import { GradesTab } from "../../ejemplo/components/grades-tab"
import { StudentAssignmentModal } from "../../ejemplo/components/student-assignment-modal"
import type { Student, Teacher, Subject, Career, Schedule, Group, Grade } from "@/lib/types"
import { useData } from "../../ejemplo/hooks/use-data"

export default function GradesManagementSystem() {
  const { 
    students,
    teachers,
    subjects,
    groups,
    loading,
    error,
    setStudents
  } = useData();

  const [careers] = useState<Career[]>([
    { id: "1", name: "Ingeniería en Sistemas", duration: "4 años" },
    { id: "2", name: "Ingeniería Industrial", duration: "4 años" },
  ])

  const [schedules] = useState<Schedule[]>([
    { id: "1", day: "Lunes", startTime: "08:00", endTime: "10:00", classroom: "A-101" },
    { id: "2", day: "Miércoles", startTime: "10:00", endTime: "12:00", classroom: "B-205" },
  ])

  const [grades] = useState<Grade[]>([
    { id: "1", studentName: "Ana García", subjectName: "Cálculo Diferencial", grade: 9.5, date: "2024-10-15" },
    { id: "2", studentName: "Carlos Rodríguez", subjectName: "Física I", grade: 8.7, date: "2024-10-16" },
  ])

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    setIsStudentModalOpen(true)
  }

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
    setSelectedStudent(updatedStudent)
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Cargando...</h2>
          <p className="text-muted-foreground">Por favor espere mientras se cargan los datos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Sistema de Gestión de Calificaciones</h1>
        <p className="text-muted-foreground text-lg">Administra estudiantes, docentes, materias y calificaciones</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Alumnos</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Docentes</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Materias</span>
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Carreras</span>
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horarios</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <UsersRound className="h-4 w-4" />
            <span className="hidden sm:inline">Grupos</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calificaciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentsTab students={students} careers={careers} onStudentClick={handleStudentClick} />
        </TabsContent>

        <TabsContent value="teachers">
          <TeachersTab teachers={teachers} subjects={subjects} />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectsTab subjects={subjects} teachers={teachers} />
        </TabsContent>

        <TabsContent value="careers">
          <CareersTab careers={careers} />
        </TabsContent>

        <TabsContent value="schedules">
          <SchedulesTab schedules={schedules} subjects={subjects} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsTab groups={groups} subjects={subjects} teachers={teachers} />
        </TabsContent>

        <TabsContent value="grades">
          <GradesTab grades={grades} students={students} subjects={subjects} />
        </TabsContent>
      </Tabs>

      <StudentAssignmentModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        subjects={subjects}
        teachers={teachers}
        groups={groups}
        careers={careers}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  )
}
