"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Dumbbell, Clock } from "lucide-react"
import Link from "next/link"

interface Routine {
  id_cliente: string
  nombre_cliente: string
  id_rutina: string
  nombre_rutina: string
  nombre_tipo_rutina: string
  fecha_pautada: string
  ejercicio: string
  estado: string
}

export function TodayRoutinesCard() {
  const [routines, setRoutines] = useState<Routine[]>([])

const statusColors: Record<string, string> = {
  pendiente: "!bg-orange-100 !text-orange-700",
  enproceso: "!bg-green-100 !text-green-700",
  completado: "!bg-yellow-100 !text-yellow-700",
  atrasado: "!bg-red-100 !text-red-700",
}

  useEffect(() => {
    fetch("http://localhost:5057/api/Dashboard/SRutinaHoy")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRoutines(data)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Rutinas de Hoy</CardTitle>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/calendario" className="flex items-center gap-1 text-primary">
            Ver calendario
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {routines.length > 0 ? (
          routines.map((routine, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {routine.nombre_rutina}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {routine.nombre_cliente}
                </p>

                <p className="text-xs text-primary mt-1">
                  {routine.ejercicio}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-sm text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {new Date(routine.fecha_pautada).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <Badge variant="secondary">
                  {routine.nombre_tipo_rutina}
                </Badge>

                 <Badge
  className={`border-0 font-medium ${
    statusColors[routine.estado?.trim().toLowerCase()] ||
    "!bg-gray-100 !text-gray-700"
  }`}
>
  {routine.estado}
</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay rutinas para hoy
          </p>
        )}
      </CardContent>
    </Card>
  )
}