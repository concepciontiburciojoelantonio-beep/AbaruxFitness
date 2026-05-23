"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  Ruler,
  Target,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { mockClients, mockProgress } from "@/lib/data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

// Extended mock progress data for charts
const progressData = [
  { date: "Ene", peso: 82, grasa: 20, musculo: 35 },
  { date: "Feb", peso: 80, grasa: 19, musculo: 36 },
  { date: "Mar", peso: 78, grasa: 17, musculo: 37 },
  { date: "Abr", peso: 77, grasa: 16, musculo: 38 },
  { date: "May", peso: 76, grasa: 15, musculo: 39 },
  { date: "Jun", peso: 75, grasa: 14, musculo: 40 },
]

const measurementsData = [
  { date: "Ene", pecho: 98, cintura: 88, brazos: 34 },
  { date: "Feb", pecho: 99, cintura: 86, brazos: 35 },
  { date: "Mar", pecho: 100, cintura: 84, brazos: 36 },
  { date: "Abr", pecho: 101, cintura: 82, brazos: 36.5 },
  { date: "May", pecho: 102, cintura: 80, brazos: 37 },
  { date: "Jun", pecho: 103, cintura: 79, brazos: 37.5 },
]

const performanceData = [
  { ejercicio: "Sentadilla", inicial: 80, actual: 110 },
  { ejercicio: "Press Banca", inicial: 60, actual: 85 },
  { ejercicio: "Peso Muerto", inicial: 100, actual: 140 },
  { ejercicio: "Press Militar", inicial: 40, actual: 55 },
]

export default function ProgresoPage() {
  const [selectedClient, setSelectedClient] = useState(mockClients[0].id)
  const [timeRange, setTimeRange] = useState("6m")

  const client = mockClients.find((c) => c.id === selectedClient)

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Progreso</h1>
            <p className="text-muted-foreground mt-1">
              Seguimiento del progreso de tus clientes
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Registrar Progreso
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="sm:w-64">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 mes</SelectItem>
            <SelectItem value="3m">3 meses</SelectItem>
            <SelectItem value="6m">6 meses</SelectItem>
            <SelectItem value="1y">1 ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Peso Actual</p>
                <p className="text-2xl font-bold text-foreground">75 kg</p>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-7 kg</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">% Grasa Corporal</p>
                <p className="text-2xl font-bold text-foreground">14%</p>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-6%</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Target className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Masa Muscular</p>
                <p className="text-2xl font-bold text-foreground">40 kg</p>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5 kg</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cintura</p>
                <p className="text-2xl font-bold text-foreground">79 cm</p>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-9 cm</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Ruler className="h-5 w-5 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Progress Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Evolucion del Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="peso"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPeso)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Body Composition Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Composicion Corporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="grasa"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="% Grasa"
                    dot={{ fill: "hsl(var(--destructive))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="musculo"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Musculo (kg)"
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Measurements Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Medidas Corporales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurementsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pecho"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Pecho"
                  />
                  <Line
                    type="monotone"
                    dataKey="cintura"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Cintura"
                  />
                  <Line
                    type="monotone"
                    dataKey="brazos"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name="Brazos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Rendimiento en Ejercicios (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="ejercicio" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="inicial" fill="hsl(var(--muted))" name="Inicial" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="actual" fill="hsl(var(--primary))" name="Actual" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photos Section */}
      <Card className="bg-card border-border mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Fotos de Progreso</CardTitle>
          <Button variant="outline" size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Subir Foto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-secondary/50 border border-border flex items-center justify-center"
              >
                <div className="text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {i === 1 ? "Enero" : i === 2 ? "Marzo" : i === 3 ? "Mayo" : "Actual"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card className="bg-card border-border mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Historial de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProgress.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(entry.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      {entry.weight && <span>Peso: {entry.weight} kg</span>}
                      {entry.bodyFat && <span>Grasa: {entry.bodyFat}%</span>}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Ver detalles
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
