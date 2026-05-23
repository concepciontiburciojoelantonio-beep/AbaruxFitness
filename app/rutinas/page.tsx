"use client"

import { url } from "@/lib/url"
import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Dumbbell,
  User,
  Calendar,
} from "lucide-react"
import Link from "next/link"

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

export default function RutinasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | "all">("all")
  const [rutinas, setRutinas] = useState<any[]>([])

  // 🔥 CARGAR DESDE API
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        let urll = `${url}/api/Rutinas/SListRutinas`

        if (searchQuery.trim() !== "") {
          urll += `?nombre_cliente=${searchQuery}`
        }

        const res = await fetch(urll)
        const data = await res.json()

        // 👇 adaptamos a tu UI
        const adaptadas = data.data.map((r: any) => ({
  id: r.id_rutina,
  id_cliente: r.id_cliente, // 👈 IMPORTANTE
  name: r.rutina,
  clientName: r.cliente,
  type: r.tipo?.toLowerCase() || "fuerza",
  days: Array(r.total_dias).fill({}),
  resumen: r.resumen,
}))

        setRutinas(adaptadas)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRutinas()
  }, [searchQuery])

  // 🔍 FILTRO LOCAL (tipo)
  const filteredRoutines = useMemo(() => {
    return rutinas.filter((routine) => {
      const matchesType =
        filterType === "all" || routine.type === filterType
      return matchesType
    })
  }, [rutinas, filterType])

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Rutinas</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las rutinas de entrenamiento
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/rutinas/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Rutina
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Tipo
              {filterType !== "all" && (
                <Badge variant="secondary" className="ml-1">
                  {typeLabels[filterType]}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterType("all")}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("fuerza")}>
              Fuerza
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("cardio")}>
              Cardio
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("mixto")}>
              Mixto
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("flexibilidad")}>
              Flexibilidad
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Routines List */}
      <div className="space-y-4">
        {filteredRoutines.map((routine) => (
          <Card key={routine.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                    <Dumbbell className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{routine.name}</h3>
                      <Badge className={typeColors[routine.type]}>
                        {typeLabels[routine.type]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span>{routine.clientName}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{routine.days.length} día(s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" asChild>
                  <Link href={`/rutinas/${routine.id}?cliente=${routine.id_cliente}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Link>
                </Button>
              </div>

              {/* 🔥 USAMOS TU RESUMEN REAL */}
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Resumen de ejercicios:
                </p>
                <div className="text-xs bg-secondary rounded-md px-2 py-2">
                  {routine.resumen}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutines.length === 0 && (
        <div className="text-center py-12">
          <p>No se encontraron rutinas</p>
        </div>
      )}
    </DashboardLayout>
  )
}