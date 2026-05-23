"use client"

import { url } from "@/lib/url"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Check,
  Calendar,
  Dumbbell,
  ChevronRight,
} from "lucide-react"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar as CalendarUI } from "@/components/ui/calendar"

import Link from "next/link"

import type { Routine, RoutineDay, Exercise } from "@/lib/types"

type Step = "info" | "days" | "exercises"

interface SavedRoutine {
  id: number
  nombre: string
  id_cliente: number
  tipo: string
}

export default function NuevaRutinaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [savedRoutine, setSavedRoutine] = useState<SavedRoutine | null>(null)
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    type: "" as Routine["type"] | "",
  })

  const [days, setDays] = useState<RoutineDay[]>([])
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [tiposRutina, setTiposRutina] = useState<any[]>([])

  // Fetch clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${url}/api/Rutinas/SClientes`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setClientes(data)
        } else if (Array.isArray(data.data)) {
          setClientes(data.data)
        } else {
          setClientes([])
        }
      } catch (error) {
        console.error("Error cargando clientes", error)
        setClientes([])
      }
    }
    fetchClientes()
  }, [])

  // Fetch ejercicios
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const res = await fetch(`${url}/api/Ejercicios/SListEjercicios`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setEjercicios(data)
        } else if (Array.isArray(data.data)) {
          setEjercicios(data.data)
        } else {
          setEjercicios([])
        }
      } catch (error) {
        console.error("Error cargando ejercicios", error)
        setEjercicios([])
      }
    }
    fetchEjercicios()
  }, [])







useEffect(() => {
  const fetchTiposRutina = async () => {
    try {
      const res = await fetch(`${url}/api/Rutinas/StipoRutina`)
      const data = await res.json()

      if (Array.isArray(data)) {
        setTiposRutina(data)
      } else if (Array.isArray(data.data)) {
        setTiposRutina(data.data)
      } else {
        setTiposRutina([])
      }

    } catch (error) {
      console.error("Error cargando tipos de rutina", error)
      setTiposRutina([])
    }
  }

  fetchTiposRutina()
}, [])





  // PASO 1: Guardar información básica de la rutina
  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.clientId || !formData.type) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      setIsLoading(true)

      const payload = {
        nombre: formData.name,
        id_cliente: parseInt(formData.clientId),
        id_tipo_rutina: parseInt(formData.type),
        dias: [], // Sin días inicialmente
      }

      const res = await fetch(`${url}/api/Rutinas/ICrearRutina`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        alert("ERROR:\n" + text)
        return
      }

      const data = await res.json()
      console.log("RESPUESTA API:", data)
      
      // Guardar la rutina creada y avanzar al paso 2
      setSavedRoutine({
        id: data.id_rutina, // 🔥 ESTE ES EL IMPORTANTE
        nombre: formData.name,
        id_cliente: parseInt(formData.clientId),
        tipo: formData.type,
      })
      setCurrentStep("days")

    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Agregar día
const addDay = () => {
  const newDay: RoutineDay = {
    id: `day-${Date.now()}`,
    name: `Día ${days.length + 1}`,
    exercises: [],
    year: "",
    month: "",
    day: "",
    hour: "08",
    minute: "00",
    selectedDate: undefined,
  }

  setDays((prevDays) => [...prevDays, newDay])
}

  // Eliminar día
  const removeDay = (dayId: string) => {
    setDays(days.filter((d) => d.id !== dayId))
    if (selectedDayId === dayId) {
      setSelectedDayId(null)
    }
  }

  // Duplicar día
  const duplicateDay = (dayIndex: number) => {
    const dayToCopy = days[dayIndex]
    const newDay: RoutineDay = {
      id: `day-${Date.now()}`,
      name: `${dayToCopy.name} (copia)`,
      exercises: dayToCopy.exercises.map((e) => ({
        ...e,
        id: `ex-${Date.now()}-${Math.random()}`,
      })),
    }
    const newDays = [...days]
    newDays.splice(dayIndex + 1, 0, newDay)
    setDays(newDays)
  }

  // Actualizar nombre del día
  const updateDayName = (dayId: string, name: string) => {
    setDays(days.map((d) => (d.id === dayId ? { ...d, name } : d)))
  }


const updateDayDate = (
  dayId: string,
  field: "year" | "month" | "day",
  value: string
) => {
  setDays(days.map(d =>
    d.id === dayId ? { ...d, [field]: value } : d
  ))
}


const updateDayFromCalendar = (
  dayId: string,
  date: Date | undefined
) => {
  if (!date) return

  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  setDays(days.map((d) =>
    d.id === dayId
      ? {
          ...d,
          selectedDate: date,
          year,
          month,
          day,
        }
      : d
  ))
}















  // PASO 2: Guardar días y pasar a ejercicios
const handleSaveDays = async (e?: any) => {
  e?.preventDefault()
  if (days.length === 0) {
    alert("Agrega al menos un día")
    return
  }

  // 🔥 VALIDAR FECHAS
  const invalidDay = days.find(
    (d) => !d.year || !d.month || !d.day
  )

  if (invalidDay) {
    alert(`Completa la fecha del ${invalidDay.name}`)
    return
  }

  try {
    setIsLoading(true)

    const payload = days.map((d) => ({
  id_rutina: savedRoutine?.id,
  nombre_dia: d.name,
  year: d.year,
  month: d.month,
  day: d.day,
  hour: d.hour || "08",
  minute: d.minute || "00",
   period: d.period || "AM",
}))

    console.log("ENVIANDO:", payload)

    const res = await fetch(
      `${url}/api/Rutinas/ICrearDiasRutina`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const responseData = await res.json()

    const diasCreados = Array.isArray(responseData)
      ? responseData
      : responseData.data || []

    console.log("DIAS CREADOS:", diasCreados)

    const updatedDays = days.map((day) => {
      const encontrado = diasCreados.find(
        (x: any) => x.nombre_dia === day.name
      )

      return {
        ...day,
        id_dia: encontrado?.id_dia,
      }
    })

    setDays(updatedDays)

    if (updatedDays.length > 0) {
      setSelectedDayId(updatedDays[0].id)
    }

    setCurrentStep("exercises")

  } catch (error: any) {
    alert(error.message)
  } finally {
    setIsLoading(false)
  }
}


















  // Agregar ejercicio a un día
  const addExercise = (dayId: string) => {
  setDays(
    days.map((d) =>
      d.id === dayId
        ? {
            ...d,
            exercises: [
              ...d.exercises,
              {
                id: `ex-${Date.now()}`,
                name: "",
                sets: 0,      // inicia en 0
                reps: "",     // vacío
                weight: "", 
                status: "",
              },
            ],
          }
        : d
    )
  )
}

  // Eliminar ejercicio
  const removeExercise = (dayId: string, exerciseId: string) => {
    setDays(
      days.map((d) =>
        d.id === dayId
          ? {
              ...d,
              exercises: d.exercises.filter((e) => e.id !== exerciseId),
            }
          : d
      )
    )
  }


const updateDayTime = (
  dayId: string,
  field: "hour" | "minute" | "period",
  value: string
) => {
  setDays(days.map((d) =>
    d.id === dayId
      ? { ...d, [field]: value }
      : d
  ))
}



  // Actualizar ejercicio
  const updateExercise = (
    dayId: string,
    exerciseId: string,
    field: keyof Exercise,
    value: string | number
  ) => {
    setDays(
      days.map((d) =>
        d.id === dayId
          ? {
              ...d,
              exercises: d.exercises.map((e) =>
                e.id === exerciseId ? { ...e, [field]: value } : e
              ),
            }
          : d
      )
    )
  }

  // PASO 3: Guardar ejercicios del día seleccionado
  const handleSaveExercises = async () => {
  const selectedDay = days.find(d => d.id === selectedDayId)

  if (!selectedDay || selectedDay.exercises.length === 0) {
    alert("Agrega al menos un ejercicio al día")
    return
  }

  try {
    setIsLoading(true)
      // Aquí puedes hacer la llamada a tu API para guardar los ejercicios del día
      const payload = {
        id_rutina: savedRoutine?.id,
        id_dia: selectedDay.id_dia, // 🔥 ESTE ES EL FIX
        ejercicios: selectedDay.exercises.map((e) => ({
        id_ejercicio: parseInt(e.name),
        series: e.sets.toString(),
        reps: e.reps,
        peso: e.weight,
        estado: e.status,
         })),
      }

      console.log("ENVIANDO A API:", payload)

    const res = await fetch(`${url}/api/Rutinas/IDetalleEjercicio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    const data = await res.json()
    console.log("RESPUESTA API:", data)

 

    alert(`Ejercicios del ${selectedDay.name} guardados correctamente`)

  } catch (error: any) {
    alert("Error: " + error.message)
  } finally {
    setIsLoading(false)
  }
}

  // Finalizar y volver a rutinas
  const handleFinish = () => {
    router.push("/rutinas")
  }

  const selectedDay = days.find(d => d.id === selectedDayId)

  // Obtener el cliente seleccionado
  const selectedClient = clientes.find(c => c.id.toString() === formData.clientId)

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/rutinas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Nueva Rutina</h1>
            <p className="text-muted-foreground mt-1">
              Crea una nueva rutina de entrenamiento
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentStep === "info" 
              ? "bg-primary text-primary-foreground" 
              : savedRoutine 
                ? "bg-green-500/20 text-green-600" 
                : "bg-secondary text-muted-foreground"
          }`}>
            {savedRoutine ? <Check className="h-4 w-4" /> : <span>1</span>}
            <span>Información</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentStep === "days" 
              ? "bg-primary text-primary-foreground" 
              : currentStep === "exercises"
                ? "bg-green-500/20 text-green-600"
                : "bg-secondary text-muted-foreground"
          }`}>
            {currentStep === "exercises" ? <Check className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
            <span>Días</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentStep === "exercises" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-muted-foreground"
          }`}>
            <Dumbbell className="h-4 w-4" />
            <span>Ejercicios</span>
          </div>
        </div>
      </div>

      {/* PASO 1: Información Básica */}
      {currentStep === "info" && (
        <form onSubmit={handleSaveRoutine} className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
              <CardDescription>
                Completa los datos básicos de la rutina y guarda para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la rutina *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Pecho y Tríceps"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as Routine["type"] })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
  {tiposRutina.map((tipo) => (
    <SelectItem key={tipo.id_tipo_rutina} value={tipo.id_tipo_rutina.toString()}>
      {tipo.nombre}
    </SelectItem>
  ))}
</SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
              <Link href="/rutinas">Cancelar</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name || !formData.clientId || !formData.type} 
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar y Continuar"}
            </Button>
          </div>
        </form>
      )}

      {/* PASO 2: Agregar Días */}
      {currentStep === "days" && (
        <div className="space-y-6">
          {/* Resumen de la rutina guardada */}
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-700">Rutina creada: {savedRoutine?.nombre}</p>
                  <p className="text-sm text-green-600">
                    Cliente: {selectedClient?.nombre} • Tipo: {savedRoutine?.tipo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agregar Días
              </CardTitle>
              <CardDescription>
                Agrega los días de entrenamiento para esta rutina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay días agregados</p>
                  <p className="text-sm">Haz clic en el botón para agregar un día</p>
                </div>
              ) : (
                
                
                
                
                <div className="space-y-3">
                  {days.map((day, index) => (
                    <div
                      key={day.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border"
                    >





                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <Input
                        value={day.name}
                        onChange={(e) => updateDayName(day.id, e.target.value)}
                        className="flex-1 max-w-xs font-medium"
                      />



                     
                     
                     
                     
   <div className="flex items-center gap-2">
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className="min-w-[220px] justify-start text-left font-normal"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {day.year && day.month && day.day
          ? `${day.day}/${day.month}/${day.year}`
          : "Seleccionar fecha"}
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-auto p-0" align="end">
      <CalendarUI
        mode="single"
        selected={day.selectedDate}
        onSelect={(date) => updateDayFromCalendar(day.id, date)}
        initialFocus
      />

      <div className="border-t p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Hora del entrenamiento
        </p>

        <div className="flex items-center gap-2">
          {/* HORA (01 - 12) */}
          <Select
            value={day.hour || "08"}
            onValueChange={(value) =>
              updateDayTime(day.id, "hour", value)
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = String(i + 1).padStart(2, "0")
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          <span className="font-bold">:</span>

          {/* MINUTOS (00 - 59) */}
          <Select
            value={day.minute || "00"}
            onValueChange={(value) =>
              updateDayTime(day.id, "minute", value)
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => {
                const minute = String(i).padStart(2, "0")
                return (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* AM / PM */}
          <Select
            value={day.period || "AM"}
            onValueChange={(value) =>
              updateDayTime(day.id, "period", value)
            }
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </PopoverContent>
  </Popover>

  <Badge variant="secondary">
    {day.hour || "08"}:{day.minute || "00"} {day.period || "AM"}
  </Badge>
</div>





                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateDay(index)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDay(day.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button type="button" variant="outline" onClick={addDay} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Día
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCurrentStep("info")}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <Button
  type="button"
  onClick={handleSaveDays}
  disabled={isLoading || days.length === 0}
  className="flex-1 sm:flex-none"
>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar Días y Continuar"}
            </Button>
          </div>
        </div>
      )}

      {/* PASO 3: Agregar Ejercicios */}
      {currentStep === "exercises" && (
        <div className="space-y-6">
          {/* Resumen */}
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-700">{savedRoutine?.nombre}</p>
                  <p className="text-sm text-green-600">
                    {days.length} días configurados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Lista de días */}
            <Card className="bg-card border-border lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Días</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {days.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDayId(day.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedDayId === day.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span className="font-medium text-sm">{day.name}</span>
                      <Badge 
                        variant={selectedDayId === day.id ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {day.exercises.length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Editor de ejercicios */}
            <Card className="bg-card border-border lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Ejercicios - {selectedDay?.name}
                </CardTitle>
                <CardDescription>
                  Agrega los ejercicios para este día
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDay && (
                  <>
                    {/* Headers */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
                      <div className="col-span-5">Ejercicio</div>
                      <div className="col-span-2">Series</div>
                      <div className="col-span-2">Reps</div>
                      <div className="col-span-2">Peso</div>
                      <div className="col-span-1"></div>
                    </div>

                    {selectedDay.exercises.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No hay ejercicios</p>
                        <p className="text-sm">Agrega ejercicios a este día</p>
                      </div>
                    ) : (






                      
                     selectedDay.exercises.map((exercise) => (
  <div
    key={exercise.id}
    className="
      rounded-xl border border-border bg-secondary/30 p-4
      space-y-4
      md:space-y-0
      md:grid md:grid-cols-12 md:gap-3 md:items-end
    "
  >
    {/* Ejercicio */}
    <div className="w-full md:col-span-5">
      <Label className="text-xs text-muted-foreground mb-1 block md:hidden">
        Ejercicio
      </Label>
      <Select
        value={exercise.name}
        onValueChange={(value) =>
          updateExercise(selectedDay.id, exercise.id, "name", value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar ejercicio" />
        </SelectTrigger>
        <SelectContent>
          {ejercicios.map((e) => (
            <SelectItem key={e.id} value={e.id.toString()}>
              {e.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Series */}
    <div className="w-full md:col-span-2">
      <Label className="text-xs text-muted-foreground mb-1 block md:hidden">
        Series
      </Label>
      <Input
        type="number"
        min={0}
        placeholder="0"
        value={exercise.sets}
        onChange={(e) =>
          updateExercise(
            selectedDay.id,
            exercise.id,
            "sets",
            parseInt(e.target.value) || 0
          )
        }
      />
    </div>

    {/* Repeticiones */}
    <div className="w-full md:col-span-2">
      <Label className="text-xs text-muted-foreground mb-1 block md:hidden">
        Reps
      </Label>
      <Input
        placeholder="10-12"
        value={exercise.reps || ""}
        onChange={(e) =>
          updateExercise(selectedDay.id, exercise.id, "reps", e.target.value)
        }
      />
    </div>

    {/* Peso */}
    <div className="w-full md:col-span-2">
      <Label className="text-xs text-muted-foreground mb-1 block md:hidden">
        Peso
      </Label>
      <Input
        placeholder="20kg"
        value={exercise.weight || ""}
        onChange={(e) =>
          updateExercise(selectedDay.id, exercise.id, "weight", e.target.value)
        }
      />
    </div>


{/* Estado */}
<div className="w-full md:col-span-2">
  <Label className="text-xs text-muted-foreground mb-1 block md:hidden">
    Estado
  </Label>

  <Select
    value={exercise.status || "Pendiente"}
    onValueChange={(value) =>
      updateExercise(selectedDay.id, exercise.id, "status", value)
    }
  >
    <SelectTrigger className="w-full">
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="Pendiente">Pendiente</SelectItem>
      <SelectItem value="Atrasado">Atrasado</SelectItem>
      <SelectItem value="En Proceso">EnProceso</SelectItem>
      <SelectItem value="Completado">Completado</SelectItem>
    </SelectContent>
  </Select>
</div>

 
    {/* Eliminar */}
    <div className="flex justify-end md:justify-center md:col-span-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() =>
          removeExercise(selectedDay.id, exercise.id)
        }
        className="h-9 w-9 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
))
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addExercise(selectedDay.id)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Ejercicio
                    </Button>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={handleSaveExercises}
                        disabled={isLoading || selectedDay.exercises.length === 0}
                        className="w-full"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Guardando..." : `Guardar Ejercicios de ${selectedDay.name}`}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCurrentStep("days")}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Días
            </Button>
            <Button 
              onClick={handleFinish}
              variant="default"
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Finalizar Rutina
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
