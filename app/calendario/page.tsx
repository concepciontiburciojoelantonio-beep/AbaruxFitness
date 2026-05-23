"use client"

import { url } from "@/lib/url"
import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Dumbbell,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockCalendarEvents } from "@/lib/data"
import type { CalendarEvent } from "@/lib/types"
import Link from "next/link"


type Sesion = {
  id_sesion: number
  id_cliente: number
  id_tipo_rutina: number
  estado: string
  fecha_inicio: string
  fecha: string
}


const statusColors: Record<CalendarEvent["status"], string> = {
  pendiente: "bg-muted text-muted-foreground",
  "en-progreso": "bg-warning/20 text-warning",
  completado: "bg-primary/20 text-primary",
  cancelado: "bg-destructive/20 text-destructive",
}

const statusLabels: Record<CalendarEvent["status"], string> = {
  pendiente: "Pendiente",
  "en-progreso": "En Progreso",
  completado: "Completado",
  cancelado: "Cancelado",
}
  
  
 


const daysOfWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const daysOfWeekFull = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

export default function CalendarioPage() {
  // ==============================
  // STATES
  // ==============================
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sesiones, setSesiones] = useState<Sesion[]>([])

  // ==============================
  // CARGAR SESIONES DESDE LA API
  // ==============================
  useEffect(() => {
    const cargarSesiones = async () => {
      try {
        const response = await fetch(
          `${url}/api/Sesion/SSecion`
        )

        if (!response.ok) {
          throw new Error("Error al cargar sesiones")
        }

        const data: Sesion[] = await response.json()
        setSesiones(data)
      } catch (error) {
        console.error("Error cargando sesiones:", error)
      }
    }

    cargarSesiones()
  }, [])

  // ==============================
  // VARIABLES DE FECHA
  // ==============================
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // ==============================
  // OBTENER FECHAS DE LA SEMANA
  // ==============================
  const getWeekDates = () => {
    const curr = new Date(currentDate)
    const first = curr.getDate() - curr.getDay() + 1 // Lunes

    const dates: Date[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(curr)
      date.setDate(first + i)
      dates.push(date)
    }

    return dates
  }

  const weekDates = getWeekDates()

  const startWeek = weekDates[0]
const endWeek = weekDates[6]

const sesionesSemana = sesiones.filter((sesion) => {
  const fechaSesion = new Date(sesion.fecha)

  return (
    fechaSesion >= startWeek &&
    fechaSesion <= endWeek
  )
})

const totalSesiones = sesionesSemana.length

const completadas = sesionesSemana.filter(
  (s) => s.estado?.toLowerCase() === "finalizada"
).length

const pendientes = sesionesSemana.filter(
  (s) => s.estado?.toLowerCase() === "pendiente"
).length

const canceladas = sesionesSemana.filter(
  (s) => s.estado?.toLowerCase() === "cancelada"
).length

  // ==============================
  // OBTENER FECHAS DEL MES
  // ==============================
  const getMonthDates = () => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6

    const dates: (Date | null)[] = []

    for (let i = 0; i < startDay; i++) {
      dates.push(null)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i))
    }

    return dates
  }

  const monthDates = getMonthDates()

  // ==============================
  // FILTRAR SESIONES POR FECHA
  // ==============================
  const getEventsForDate = (date: Date) => {
    return sesiones.filter((sesion) => {
      const fechaSesion = new Date(sesion.fecha)

      return (
        fechaSesion.getFullYear() === date.getFullYear() &&
        fechaSesion.getMonth() === date.getMonth() &&
        fechaSesion.getDate() === date.getDate()
      )
    })
  }

  // ==============================
  // SESIONES DEL DÍA SELECCIONADO
  // ==============================
  const eventsForDate = useMemo(() => {
    return getEventsForDate(selectedDate)
  }, [selectedDate, sesiones])

  // ==============================
  // FUNCIONES AUXILIARES
  // ==============================
  const today = new Date()

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const isSelected = (date: Date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear()

  // ==============================
  // NAVEGACIÓN
  // ==============================
  const navigatePrev = () => {
    if (viewMode === "week") {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 7)
      setCurrentDate(newDate)
    } else {
      setCurrentDate(new Date(year, month - 1, 1))
    }
  }

  const navigateNext = () => {
    if (viewMode === "week") {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 7)
      setCurrentDate(newDate)
    } else {
      setCurrentDate(new Date(year, month + 1, 1))
    }
  }

  // ==============================
  // NOMBRE DEL MES
  // ==============================
  const monthName = currentDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  // ==============================
  // RETURN JSX
  // ==============================




  

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Calendario</h1>
            <p className="text-muted-foreground mt-1">
              Planifica y gestiona las sesiones de entrenamiento
            </p>
          </div>
        <Link href="/calendario/nuevo">
    <Button className="w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      Nueva Sesión
    </Button>
  </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={navigatePrev}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
                  <Button variant="ghost" size="icon" onClick={navigateNext}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Mes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "week" ? (
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, index) => {
                    const dayEvents = getEventsForDate(date)
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center rounded-lg p-2 transition-colors min-h-24",
                          isSelected(date)
                            ? "bg-primary text-primary-foreground"
                            : isToday(date)
                            ? "bg-primary/20"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className="text-xs text-muted-foreground">
                          {daysOfWeek[index]}
                        </span>
                        <span
                          className={cn(
                            "text-lg font-semibold mt-1",
                            isSelected(date) && "text-primary-foreground"
                          )}
                        >
                          {date.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="flex flex-col gap-0.5 mt-2 w-full">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id_sesion}
                                className={cn(
                                  "text-xs px-1 py-0.5 rounded truncate",
                                  isSelected(date)
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-primary/20 text-primary"
                                )}
                              >
                                {event.fecha_inicio}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-xs text-center">
                                +{dayEvents.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {monthDates.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="p-2" />
                    }
                    const dayEvents = getEventsForDate(date)
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center justify-start rounded-lg p-1 transition-colors min-h-16 text-sm",
                          isSelected(date)
                            ? "bg-primary text-primary-foreground"
                            : isToday(date)
                            ? "bg-primary/20"
                            : "hover:bg-muted"
                        )}
                      >
                        <span>{date.getDate()}</span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isSelected(date)
                                    ? "bg-primary-foreground"
                                    : "bg-primary"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Day Details */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsForDate.length > 0 ? (
  eventsForDate.map((event) => (
    <Link
      key={event.id_sesion}
      href={`/calendario/nuevo?id_sesion=${event.id_sesion}`}
    >
      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 cursor-pointer hover:bg-secondary/50">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            S
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            Sesión #{event.id_sesion}
          </p>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(event.fecha_inicio).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Dumbbell className="h-3 w-3" />
            <span className="truncate">
              Rutina #{event.id_tipo_rutina}
            </span>
          </div>

          <Badge
            variant="secondary"
            className="mt-2 text-xs bg-primary/20 text-primary"
          >
            Programada
          </Badge>
        </div>
      </div>
    </Link>
  ))





                
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay sesiones programadas</p>
                  
                </div>
              )}






            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Esta Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total sesiones</span>
                <span className="font-semibold text-foreground">
  {totalSesiones}
</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completadas</span>
                <span className="font-semibold text-primary">
  {completadas}
</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pendientes</span>
                <span className="font-semibold text-warning">
  {pendientes}
</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Canceladas</span>
                <span className="font-semibold text-destructive">
  {canceladas}
</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
