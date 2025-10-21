"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, UsersRound, Award, Plus, Trash2, X } from "lucide-react"
import type { Student, Subject, Teacher, Group, Career } from "@/lib/types"

type StudentAssignmentModalProps = {
  student: Student | null
  isOpen: boolean
  onClose: () => void
  subjects: Subject[]
  teachers: Teacher[]
  groups: Group[]
  careers: Career[]
  onUpdateStudent: (student: Student) => void
}

export function StudentAssignmentModal({
  student,
  isOpen,
  onClose,
  subjects,
  teachers,
  groups,
  careers,
  onUpdateStudent,
}: StudentAssignmentModalProps) {
  const [newSubject, setNewSubject] = useState("")
  const [newTeacher, setNewTeacher] = useState("")
  const [newGroup, setNewGroup] = useState("")
  const [newGradeSubject, setNewGradeSubject] = useState("")
  const [newGradeValue, setNewGradeValue] = useState("")
  const [newGradeDate, setNewGradeDate] = useState("")

  if (!student) return null

  const addSubjectToStudent = () => {
    if (!newSubject) return
    const updated = { ...student, assignedSubjects: [...(student.assignedSubjects || []), newSubject] }
    onUpdateStudent(updated)
    setNewSubject("")
  }

  const addTeacherToStudent = () => {
    if (!newTeacher) return
    const updated = { ...student, assignedTeachers: [...(student.assignedTeachers || []), newTeacher] }
    onUpdateStudent(updated)
    setNewTeacher("")
  }

  const addGroupToStudent = () => {
    if (!newGroup) return
    const updated = { ...student, assignedGroups: [...(student.assignedGroups || []), newGroup] }
    onUpdateStudent(updated)
    setNewGroup("")
  }

  const addGradeToStudent = () => {
    if (!newGradeSubject || !newGradeValue || !newGradeDate) return
    const grade = { subjectId: newGradeSubject, grade: Number.parseFloat(newGradeValue), date: newGradeDate }
    const updated = { ...student, grades: [...(student.grades || []), grade] }
    onUpdateStudent(updated)
    setNewGradeSubject("")
    setNewGradeValue("")
    setNewGradeDate("")
  }

  const removeSubjectFromStudent = (subjectId: string) => {
    const updated = { ...student, assignedSubjects: student.assignedSubjects?.filter((id) => id !== subjectId) }
    onUpdateStudent(updated)
  }

  const removeTeacherFromStudent = (teacherId: string) => {
    const updated = { ...student, assignedTeachers: student.assignedTeachers?.filter((id) => id !== teacherId) }
    onUpdateStudent(updated)
  }

  const removeGroupFromStudent = (groupId: string) => {
    const updated = { ...student, assignedGroups: student.assignedGroups?.filter((id) => id !== groupId) }
    onUpdateStudent(updated)
  }

  const removeGradeFromStudent = (index: number) => {
    const updated = { ...student, grades: student.grades?.filter((_, i) => i !== index) }
    onUpdateStudent(updated)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Perfil del Alumno</DialogTitle>
          <DialogDescription>Asigna materias, docentes, grupos y calificaciones a {student.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Matrícula</p>
              <p className="font-medium">{student.enrollmentNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correo</p>
              <p className="font-medium">{student.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Carrera</p>
              <p className="font-medium">
                {student.career ? careers.find((c) => c.id === student.career)?.name : "No asignada"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Materias Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Materias Asignadas
            </h3>
            <div className="flex gap-2">
              <Select value={newSubject} onValueChange={setNewSubject}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects
                    .filter((s) => !student.assignedSubjects?.includes(s.id))
                    .map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={addSubjectToStudent} disabled={!newSubject}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.assignedSubjects?.map((subjectId) => {
                const subject = subjects.find((s) => s.id === subjectId)
                return subject ? (
                  <Badge key={subjectId} variant="secondary" className="gap-2">
                    {subject.name}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeSubjectFromStudent(subjectId)}
                    />
                  </Badge>
                ) : null
              })}
              {(!student.assignedSubjects || student.assignedSubjects.length === 0) && (
                <p className="text-sm text-muted-foreground">No hay materias asignadas</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Docentes Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Docentes Asignados
            </h3>
            <div className="flex gap-2">
              <Select value={newTeacher} onValueChange={setNewTeacher}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona un docente" />
                </SelectTrigger>
                <SelectContent>
                  {teachers
                    .filter((t) => !student.assignedTeachers?.includes(t.id))
                    .map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.department}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={addTeacherToStudent} disabled={!newTeacher}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.assignedTeachers?.map((teacherId) => {
                const teacher = teachers.find((t) => t.id === teacherId)
                return teacher ? (
                  <Badge key={teacherId} variant="secondary" className="gap-2">
                    {teacher.name}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTeacherFromStudent(teacherId)}
                    />
                  </Badge>
                ) : null
              })}
              {(!student.assignedTeachers || student.assignedTeachers.length === 0) && (
                <p className="text-sm text-muted-foreground">No hay docentes asignados</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Grupos Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UsersRound className="h-5 w-5" />
              Grupos Asignados
            </h3>
            <div className="flex gap-2">
              <Select value={newGroup} onValueChange={setNewGroup}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups
                    .filter((g) => !student.assignedGroups?.includes(g.id))
                    .map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.enrolled}/{group.capacity})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={addGroupToStudent} disabled={!newGroup}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.assignedGroups?.map((groupId) => {
                const group = groups.find((g) => g.id === groupId)
                return group ? (
                  <Badge key={groupId} variant="secondary" className="gap-2">
                    {group.name}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeGroupFromStudent(groupId)}
                    />
                  </Badge>
                ) : null
              })}
              {(!student.assignedGroups || student.assignedGroups.length === 0) && (
                <p className="text-sm text-muted-foreground">No hay grupos asignados</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Calificaciones Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Calificaciones
            </h3>
            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2">
              <Select value={newGradeSubject} onValueChange={setNewGradeSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="Calif."
                className="w-24"
                value={newGradeValue}
                onChange={(e) => setNewGradeValue(e.target.value)}
              />
              <Input
                type="date"
                className="w-40"
                value={newGradeDate}
                onChange={(e) => setNewGradeDate(e.target.value)}
              />
              <Button onClick={addGradeToStudent} disabled={!newGradeSubject || !newGradeValue || !newGradeDate}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {student.grades?.map((grade, index) => {
                const subject = subjects.find((s) => s.id === grade.subjectId)
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{subject?.name}</span>
                      <Badge variant={grade.grade >= 7 ? "default" : "destructive"}>{grade.grade.toFixed(1)}</Badge>
                      <span className="text-sm text-muted-foreground">{grade.date}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeGradeFromStudent(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
              {(!student.grades || student.grades.length === 0) && (
                <p className="text-sm text-muted-foreground">No hay calificaciones registradas</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
