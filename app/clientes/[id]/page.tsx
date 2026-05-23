"use client"

import { url } from "@/lib/url"
import { use, useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  Target,
  Scale,
  Ruler,
  Dumbbell,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { objectiveLabels, levelLabels } from "@/lib/types"
import type { Client } from "@/lib/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const levelColors: Record<Client["level"], string> = {
  principiante: "bg-chart-2/20 text-chart-2",
  intermedio: "bg-chart-3/20 text-chart-3",
  avanzado: "bg-chart-1/20 text-chart-1",
}

const statusColors: Record<Client["status"], string> = {
  active: "bg-primary/20 text-primary",
  inactive: "bg-muted text-muted-foreground",
}

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const router = useRouter()
const [mensaje, setMensaje] = useState("")

  const [activeTab, setActiveTab] = useState("info")
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

const [objetivos, setObjetivos] = useState<any[]>([])

const [editando, setEditando] = useState(false)
const [formData, setFormData] = useState<any>(null)

const [routines, setRoutines] = useState<any[]>([])
const [progress, setProgress] = useState<any[]>([])
const [history, setHistory] = useState<any[]>([])
  


  // 🔥 FETCH REAL
  useEffect(() => {
  const fetchCliente = async () => {
    try {
      const res = await fetch(`${url}/api/Clientes/SClientes`)
      const json = await res.json()

      const clientesMapeados = (json.data || []).map((c: any) => ({
        id: c.id?.toString() ?? "",
        name: c.nombre ?? "",
        email: c.email ?? "",
        phone: c.telefono ?? "No disponible",
        age: c.fecha_nacimiento
          ? new Date().getFullYear() - new Date(c.fecha_nacimiento).getFullYear()
          : 0,
        weight: c.peso ?? 0,
        height: c.altura ?? 0,
        objective: c.objetivo ?? "",
        level: c.nivel ?? "principiante",
        status: c.estado === "activo" ? "active" : "inactive",
        notes: c.notas ?? "",
        injuries: c.lesiones ?? "",
        joinDate: c.creado_en ?? "",
        lastActivity: c.creado_en ?? "",
        id_rutina: c.id_rutina ?? 0,
      }))

      const encontrado = clientesMapeados.find((c: any) => c.id === id)

      setClient(encontrado || null)
      setFormData(encontrado || null)
    } catch (error) {
      console.error("Error cliente:", error)
    }
  }

  const fetchObjetivos = async () => {
    try {
      const res = await fetch(`${url}/api/Sesion/SObjetivoSesion`)
      const data = await res.json()
      setObjetivos(data || [])
    } catch (error) {
      console.error("Error objetivos:", error)
    }
  }

  const cargarTodo = async () => {
    await fetchCliente()
    await fetchObjetivos()
    setLoading(false)
  }

  cargarTodo()
}, [id])



const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value } = e.target

  setFormData((prev: any) => ({
    ...prev,
    [name]: value,
  }))
}

const guardarCambios = async () => {
  try {
    const res = await fetch(`${url}/api/Clientes/IClientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sentencia: "M",
        id_cliente: formData.id,
        nombre: formData.name,
        email: formData.email,
        telefono: formData.phone,
        edad: Number(formData.age),
        peso: Number(formData.weight),
        altura: Number(formData.height),
        objetivo: formData.objective,
        nivel: formData.level,
        lesiones: formData.injuries,
        notas: formData.notes,
      }),
    })

    const json = await res.json()

    setMensaje("Cliente modificado de manera exitosa")

    
    setEditando(false)

    
    setTimeout(() => {
      router.back()
    }, 2000)

    console.log(json)

    setClient(formData)
    setEditando(false)
  } catch (error) {
    console.error("Error guardando:", error)
  }
}
  

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Cargando cliente...</div>
      </DashboardLayout>
    )
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium text-foreground">Cliente no encontrado</p>
          <Button asChild className="mt-4">
            <Link href="/clientes">Volver a clientes</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // 🔥 AÚN SIN API DE ESTO
  const clientRoutines: any[] = []
  const clientProgress: any[] = []

  const progressChartData = clientProgress.map((p: any) => ({
    date: new Date(p.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    peso: p.weight,
    grasa: p.bodyFat,
  }))

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={levelColors[client.level]}>
                      {levelLabels[client.level]}
                    </Badge>
                    <Badge variant="secondary" className={statusColors[client.status]}>
                      {client.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => (editando ? guardarCambios() : setEditando(true))}>
  <Edit className="mr-2 h-4 w-4" />
  {editando ? "Guardar" : "Modificar"}
</Button>
{mensaje && (
  <div className="mt-3 rounded-md bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-600">
    {mensaje}
  </div>
)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="info">Informacion</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Contacto */}
          <Card>
  <CardHeader>
    <CardTitle>Informacion de Contacto</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    
    <div className="flex items-center gap-3">
      <Mail className="h-4 w-4" />
      <input
        type="email"
        name="email"
        value={formData?.email || ""}
        onChange={handleChange}
        disabled={!editando}
        className="w-full rounded-md border px-3 py-2 disabled:bg-muted disabled:cursor-not-allowed"
      />
    </div>

    <div className="flex items-center gap-3">
      <Phone className="h-4 w-4" />
      <input
        type="text"
        name="phone"
        value={formData?.phone || ""}
        onChange={handleChange}
        disabled={!editando}
        className="w-full rounded-md border px-3 py-2 disabled:bg-muted disabled:cursor-not-allowed"
      />
    </div>

    <div className="flex items-center gap-3">
      <Calendar className="h-4 w-4" />
      <span>
        {new Date(client.joinDate).toLocaleDateString("es-ES")}
      </span>
    </div>

  </CardContent>
</Card>

            {/* Datos */}
           {/* Datos Fisicos */}
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-lg">Datos Fisicos</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    <div className="grid grid-cols-3 gap-4">

      <div className="text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-chart-1/10">
          <Calendar className="h-6 w-6 text-chart-1" />
        </div>

        <input
          type="number"
          name="age"
          value={formData?.age || ""}
          onChange={handleChange}
          disabled={!editando}
          className="w-full mt-2 text-center border rounded px-2 py-1 disabled:bg-muted"
        />

        <p className="text-xs text-muted-foreground">Años</p>
      </div>

      <div className="text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-chart-2/10">
          <Scale className="h-6 w-6 text-chart-2" />
        </div>

        <input
          type="number"
          name="weight"
          value={formData?.weight || ""}
          onChange={handleChange}
          disabled={!editando}
          className="w-full mt-2 text-center border rounded px-2 py-1 disabled:bg-muted"
        />

        <p className="text-xs text-muted-foreground">Kg</p>
      </div>

      <div className="text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-chart-3/10">
          <Ruler className="h-6 w-6 text-chart-3" />
        </div>

        <input
          type="number"
          step="0.01"
          name="height"
          value={formData?.height || ""}
          onChange={handleChange}
          disabled={!editando}
          className="w-full mt-2 text-center border rounded px-2 py-1 disabled:bg-muted"
        />

        <p className="text-xs text-muted-foreground">m</p>
      </div>

    </div>
  </CardContent>
</Card>

            {/* Entrenamiento */}
           <Card>
  <CardHeader>
    <CardTitle>Entrenamiento</CardTitle>
  </CardHeader>

  <CardContent>
    <select
      name="objective"
      value={formData?.objective || ""}
      onChange={handleChange}
      disabled={!editando}
      className="w-full border rounded px-3 py-2 disabled:bg-muted"
    >
      <option value="">Seleccione objetivo</option>

      {objetivos.map((obj) => (
        <option key={obj.id_objetivo} value={obj.nombre}>
          {obj.nombre}
        </option>
      ))}
    </select>
  </CardContent>
</Card>

            {/* Notas */}
            <Card>
  <CardHeader>
    <CardTitle>Notas e Informacion Medica</CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">
    <textarea
      name="notes"
      value={formData?.notes || ""}
      onChange={handleChange}
      disabled={!editando}
      rows={4}
      className="w-full border rounded-md p-3 disabled:bg-muted"
    />

    <textarea
      name="injuries"
      value={formData?.injuries || ""}
      onChange={handleChange}
      disabled={!editando}
      rows={3}
      placeholder="Lesiones"
      className="w-full border rounded-md p-3 disabled:bg-muted"
    />
  </CardContent>
</Card>

          </div>
        </TabsContent>

        {/* RUTINAS */}
        <TabsContent value="routines">
          <p>No hay rutinas aún</p>
        </TabsContent>

        {/* PROGRESO */}
        <TabsContent value="progress">
          {progressChartData.length === 0 ? (
            <p>No hay datos de progreso</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="peso" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        {/* HISTORIAL */}
        <TabsContent value="history">
          <p>Historial próximamente</p>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}