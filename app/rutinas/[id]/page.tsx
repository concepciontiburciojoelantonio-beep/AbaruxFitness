"use client"

import { url } from "@/lib/url"
import { use, useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Edit,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Timer,
  Dumbbell,
  User,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

const typeColors: Record<string, string> = {
  fuerza: "bg-chart-1/20 text-chart-1",
  cardio: "bg-destructive/20 text-destructive",
  mixto: "bg-chart-3/20 text-chart-3",
  flexibilidad: "bg-chart-2/20 text-chart-2",
}

const typeLabels: Record<string, string> = {
  fuerza: "Fuerza",
  cardio: "Cardio",
  mixto: "Mixto",
  flexibilidad: "Flexibilidad",
}

export default function RoutineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)


  const [routine, setRoutine] = useState<any>(null)
  const [activeDay, setActiveDay] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const searchParams = useSearchParams()
const clienteId = searchParams.get("cliente")

  // 🔥 FETCH A TU API
  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const res = await fetch(
    `${url}/api/Rutinas/SRutinaCompleta?id_rutina=${id}&id_cliente=${clienteId}`
)

        const data = await res.json()
const dias = data.days || data.dias || []

if (!data || !Array.isArray(dias)) {
  console.error("Respuesta inválida", data)
  return
}

// 🔥 TRANSFORMACIÓN
const rutinaTransformada = {
  id: data.id_rutina.toString(),
  name: data.rutina || data.nombre || "Rutina",
  type: data.type || data.tipo || "fuerza",
  clientName: data.clientName || data.cliente || "Sin cliente",
  days: dias.map((d: any) => ({
    id: d.id_dia,
    name: d.nombre_dia,
    exercises: d.exercises || [],
  })),
}
  

        setRoutine(rutinaTransformada)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRutina()
  }, [id])

  // 🟡 LOADING
  if (!routine) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <p className="text-lg">Cargando rutina...</p>
        </div>
      </DashboardLayout>
    )
  }

  const currentDay = routine.days[activeDay]

  const completedCount = currentDay.exercises.filter((e: any) =>
    completedExercises.has(e.id)
  ).length

  const progress =
    currentDay.exercises.length > 0
      ? (completedCount / currentDay.exercises.length) * 100
      : 0

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev)
      newSet.has(exerciseId) ? newSet.delete(exerciseId) : newSet.add(exerciseId)
      return newSet
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/rutinas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{routine.name}</h1>
                <Badge className={typeColors[routine.type]}>
                  {typeLabels[routine.type]}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{routine.clientName}</span>
              </div>
            </div>




{/* Este es el boton de editar pendiente trabajarle */}


            {/* <Button asChild>
              <Link href={`/rutinas/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button> */}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* IZQUIERDA */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Días de Entrenamiento</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {routine.days.map((day: any, index: number) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(index)}
                  className={cn(
                    "w-full flex justify-between p-3 rounded-lg",
                    activeDay === index
                      ? "bg-primary text-white"
                      : "bg-secondary/50"
                  )}
                >
                  <div>
                    <p className="font-medium">{day.name}</p>
                    <p className="text-xs">
                      {day.exercises.length} ejercicios
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* DERECHA */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{currentDay.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {currentDay.exercises.map((exercise: any, index: number) => (
                <div
                  key={exercise.id}
                  className="flex items-center gap-4 border p-4 rounded-lg"
                >
                  <Checkbox
                    checked={completedExercises.has(exercise.id)}
                    onCheckedChange={() => toggleExercise(exercise.id)}
                  />

                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>

                    <div className="flex gap-2 mt-1">
                      <Badge>{exercise.sets} series</Badge>
                      <Badge>{exercise.reps} reps</Badge>
                      {exercise.weight && <Badge>{exercise.weight}</Badge>}
                    </div>
                  </div>

                  <Dumbbell className="h-5 w-5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}