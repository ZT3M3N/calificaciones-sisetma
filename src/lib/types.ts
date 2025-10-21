export type Student = {
  id: string
  name: string
  email: string
  enrollmentNumber: string
  career?: string
  assignedSubjects?: string[]
  assignedTeachers?: string[]
  assignedGroups?: string[]
  grades?: { subjectId: string; grade: number; date: string }[]
}

export type Teacher = {
  id: string
  name: string
  email: string
  department: string
}

export type Subject = {
  id: string
  name: string
  code: string
  credits: number
}

export type Career = {
  id: string
  name: string
  duration: string
}

export type Schedule = {
  id: string
  day: string
  startTime: string
  endTime: string
  classroom: string
}

export type Group = {
  id: string
  name: string
  capacity: number
  enrolled: number
}

export type Grade = {
  id: string
  studentName: string
  subjectName: string
  grade: number
  date: string
}
