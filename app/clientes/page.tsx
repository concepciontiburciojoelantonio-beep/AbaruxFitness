"use client"

import { url } from "@/lib/url"
import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"

import { objectiveLabels, levelLabels } from "@/lib/types"
import type { Client } from "@/lib/types"

const levelColors: Record<Client["level"], string> = {
  principiante: "bg-chart-2/20 text-chart-2",
  intermedio: "bg-chart-3/20 text-chart-3",
  avanzado: "bg-chart-1/20 text-chart-1",
}

const statusColors: Record<Client["status"], string> = {
  active: "bg-primary/20 text-primary",
  inactive: "bg-muted text-muted-foreground",
}

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState<Client["level"] | "all">("all")
  const [filterStatus, setFilterStatus] = useState<Client["status"] | "all">("all")
   const [clients, setClients] = useState<Client[]>([])


   // 🔥 CARGAR DESDE API
  useEffect(() => {
  const fetchClientes = async () => {
    try {
      let urll = `${url}/api/Clientes/SClientes`;

      // 👉 si hay texto, se lo mandas al backend
      if (searchQuery.trim() !== "") {
        urll += `?nombre=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(urll);
      const json = await res.json();

      console.log("API:", json);

      const clientesMapeados = (json.data || []).map((c: any) => ({
        id: c.id?.toString() ?? "",
        name: c.nombre ?? "",
        email: c.email ?? "",
        phone: c.telefono ?? "",
        age: 0,
        weight: c.peso ?? 0,
        height: c.altura ?? 0,
        
        objective: c.objetivo ?? "",

        level: c.nivel ?? "principiante",
        status: c.estado === "activo" ? "active" : "inactive",
        notes: c.notas ?? "",
        joinDate: c.creado_en ?? "",
        lastActivity: c.creado_en ?? "",
      }));

      setClients(clientesMapeados);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchClientes();
}, [searchQuery]); // 👈 CLAVE


// 🔎 FILTRO
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLevel = filterLevel === "all" || client.level === filterLevel
      const matchesStatus = filterStatus === "all" || client.status === filterStatus

      return matchesSearch && matchesLevel && matchesStatus
    })
  }, [clients, searchQuery, filterLevel, filterStatus])

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tu lista de clientes
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/clientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Nivel
                {filterLevel !== "all" && (
                  <Badge variant="secondary" className="ml-1">
                    {levelLabels[filterLevel]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterLevel("all")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("principiante")}>
                Principiante
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("intermedio")}>
                Intermedio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("avanzado")}>
                Avanzado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Estado
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="ml-1">
                    {filterStatus === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Activos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactivos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/clientes/${client.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/clientes/${client.id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                      Objetivo: <span className="text-foreground">{client.objective}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-secondary/30 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Ultima actividad:{" "}
                    {new Date(client.lastActivity).toLocaleDateString("es-ES")}
                  </span>
                  <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-primary">
                    <Link href={`/clientes/${client.id}`}>Ver perfil</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-foreground">No se encontraron clientes</p>
          <p className="text-muted-foreground mt-1">
            Intenta ajustar los filtros o crear un nuevo cliente
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
