"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Schedule, Subject } from "@/lib/types"

type SchedulesTabProps = {
  schedules: Schedule[]
  subjects: Subject[]
}

export function SchedulesTab({ schedules, subjects }: SchedulesTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Horarios</CardTitle>
          <CardDescription>Administra los horarios de clases</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Horario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Horario</DialogTitle>
              <DialogDescription>Configura un nuevo horario de clase</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="schedule-subject">Materia</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-day">Día</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunes">Lunes</SelectItem>
                    <SelectItem value="martes">Martes</SelectItem>
                    <SelectItem value="miercoles">Miércoles</SelectItem>
                    <SelectItem value="jueves">Jueves</SelectItem>
                    <SelectItem value="viernes">Viernes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-start">Hora Inicio</Label>
                  <Input id="schedule-start" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-end">Hora Fin</Label>
                  <Input id="schedule-end" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-classroom">Aula</Label>
                <Input id="schedule-classroom" placeholder="A-101" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Horario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Día</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Aula</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{schedule.day}</TableCell>
                <TableCell>
                  {schedule.startTime} - {schedule.endTime}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{schedule.classroom}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
