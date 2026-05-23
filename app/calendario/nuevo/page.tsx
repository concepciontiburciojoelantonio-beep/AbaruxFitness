"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Clock,
  MapPin,
  Dumbbell,
  Target,
  Bell,
  RefreshCw,
  Save,
} from "lucide-react"

import { url } from "@/lib/url"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TimePickerModal } from "@/components/ui/time-picker-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type Cliente = {
  id: number
  nombre: string
}

type TipoRutina = {
  id_tipo_rutina: number
  nombre: string
}


type TipoSesion = {
  id_tipo_sesion: number
  nombre?: string
  nombre_tipo_sesion?: string
}

type ObjetivoSesion = {
  id_objetivo: number
  nombre?: string
  nombre_objetivo?: string
}



export default function NuevaSesionPage() {
  const [recordatorio, setRecordatorio] = useState(true)
  const [permitirReagendar, setPermitirReagendar] = useState(true)
  const [notas, setNotas] = useState("")
  const [estado, setEstado] = useState("Pendiente");


const searchParams = useSearchParams()
const idSesion = searchParams.get("id_sesion")

const [modoEdicion, setModoEdicion] = useState(false)
const [idSesionActual, setIdSesionActual] = useState(0)


const [fecha, setFecha] = useState("2026-05-13")
const [horaInicio, setHoraInicio] = useState("07:00 AM")
const [horaFin, setHoraFin] = useState("08:00 AM")

const [clientes, setClientes] = useState<Cliente[]>([])
const [clienteSeleccionado, setClienteSeleccionado] = 
  useState<Cliente | null>(null)
const [clienteOpen, setClienteOpen] = useState(false)
const [loadingClientes, setLoadingClientes] = useState(false)

const [tiposRutina, setTiposRutina] = useState<TipoRutina[]>([])
const [tipoRutinaSeleccionado, setTipoRutinaSeleccionado] = useState("")



const [tiposSesion, setTiposSesion] = useState<TipoSesion[]>([])
const [tipoSesionSeleccionado, setTipoSesionSeleccionado] = useState("")

const [objetivosSesion, setObjetivosSesion] = useState<ObjetivoSesion[]>([])
const [objetivoSeleccionado, setObjetivoSeleccionado] = useState("")




const guardarSesion = async () => {
  try {
    // Validaciones
    if (!clienteSeleccionado) {
      alert("Debe seleccionar un cliente.")
      return
    }

    if (!tipoRutinaSeleccionado) {
      alert("Debe seleccionar una rutina.")
      return
    }
  

 const sentencia = modoEdicion ? "M" : "I"
    const idSesionEnviar = modoEdicion ? idSesionActual : 0



    const body = {
      sentencia,
      id_sesion: idSesionEnviar,

      nota: notas,
      estado: estado || "PROGRAMADA",

      id_cliente: clienteSeleccionado.id,
      id_tipo_rutina: parseInt(tipoRutinaSeleccionado, 10),

      id_tipo_sesion: tipoSesionSeleccionado
        ? parseInt(tipoSesionSeleccionado, 10)
        : null,

      id_objetivo: objetivoSeleccionado
        ? parseInt(objetivoSeleccionado, 10)
        : null,

        fecha: fecha,
      fecha_inicio: horaInicio,
      fecha_fin: horaFin,
    }




 const response = await fetch(
      `${url}/api/Sesion/Usesion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    
   const text = await response.text()

  console.log("RESPUESTA RAW:", text)

  const result = JSON.parse(text)


console.log("Respuesta del servidor:", result)

  if (!response.ok || !result.ok) {
      throw new Error(result.mensaje || "Error al guardar la sesión.")
    }

    alert(result.mensaje)

    // Regresar al calendario
    window.location.href = "/calendario"
  } catch (error) {
    console.error("Error al guardar sesión:", error)

    alert(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al guardar."
    )
  }
}

const formatHour12 = (hour24: number, minute: number) => {
  const period = hour24 >= 12 ? "PM" : "AM"
  const hour12 = hour24 % 12 || 12

  return `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`

}


// Cargar clientes desde API
useEffect(() => {
  const cargarClientes = async () => {
    try {
      setLoadingClientes(true)

      const response = await fetch(
        `${url}/api/Sesion/SClientes`
      )

      if (!response.ok) {
        throw new Error("Error al cargar clientes")
      }

      const data: Cliente[] = await response.json()
      setClientes(data)
    } catch (error) {
      console.error("Error cargando clientes:", error)
    } finally {
      setLoadingClientes(false)
    }
  }

  cargarClientes()
}, [])
  

// =========================
// 3. CARGAR TIPOS DE SESIÓN
// =========================
useEffect(() => {
  const cargarTiposSesion = async () => {
    try {
      const response = await fetch(
        `${url}/api/Sesion/STipoSesion`
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Error al cargar tipos de sesión")
      }

      const data = await response.json()

      // Asegurar que siempre sea array
      const lista: TipoSesion[] = Array.isArray(data) ? data : []

      console.log("Tipos de sesión:", lista)
      setTiposSesion(lista)
    } catch (error) {
      console.error("Error cargando tipos de sesión:", error)
      setTiposSesion([])
    }
  }

  cargarTiposSesion()
}, [])




// =========================
// 4. CARGAR OBJETIVOS
// =========================
useEffect(() => {
  const cargarObjetivosSesion = async () => {
    try {
      const response = await fetch(
        `${url}/api/Sesion/SObjetivoSesion`
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Error al cargar objetivos")
      }

      const data = await response.json()

      // Asegurar que siempre sea array
      const lista: ObjetivoSesion[] = Array.isArray(data) ? data : []

      console.log("Objetivos:", lista)
      setObjetivosSesion(lista)
    } catch (error) {
      console.error("Error cargando objetivos:", error)
      setObjetivosSesion([])
    }
  }

  cargarObjetivosSesion()
}, [])


useEffect(() => {
  const cargarTiposRutina = async () => {
    try {
      const response = await fetch(
        `${url}/api/Rutinas/StipoRutina`
      )

      if (!response.ok) {
        throw new Error("Error al cargar tipos de rutina")
      }

      const data: TipoRutina[] = await response.json()
      setTiposRutina(data)
    } catch (error) {
      console.error("Error cargando tipos de rutina:", error)
    }
  }

  cargarTiposRutina()
}, [])


useEffect(() => {
  // Esperar a que las listas estén cargadas
  if (tiposSesion.length === 0 || objetivosSesion.length === 0) {
    return
  }

  const cargarSesion = async () => {
    if (!idSesion) {
      setModoEdicion(false)
      setIdSesionActual(0)
      return
    }

    try {
      const response = await fetch(
        `${url}/api/Sesion/SSesionPorId/${idSesion}`
      )

      if (!response.ok) {
        throw new Error("Error al cargar la sesión")
      }

      const lista = await response.json()

      if (!Array.isArray(lista) || lista.length === 0) {
        return
      }

      const sesion = lista[0]

      setModoEdicion(true)
      setIdSesionActual(Number(sesion.id_sesion) || 0)

      // Cliente
      setClienteSeleccionado({
        id: Number(sesion.id_cliente) || 0,
        nombre: String(sesion.nombre_cliente ?? ""),
      })

      // Rutina
      setTipoRutinaSeleccionado(
        sesion.id_tipo_rutina != null
          ? String(sesion.id_tipo_rutina)
          : ""
      )

      // Tipo de sesión
      const idTipoSesion =
        sesion.id_tipo_sesion != null
          ? String(sesion.id_tipo_sesion)
          : ""

      // Objetivo
      const idObjetivo =
        sesion.id_objetivo != null
          ? String(sesion.id_objetivo)
          : ""

      // Verificar que existan en las listas
      const existeTipoSesion = tiposSesion.some(
        (t) => String(t.id_tipo_sesion) === idTipoSesion
      )

      const existeObjetivo = objetivosSesion.some(
        (o) => String(o.id_objetivo) === idObjetivo
      )

      setTipoSesionSeleccionado(
        existeTipoSesion ? idTipoSesion : ""
      )

      setObjetivoSeleccionado(
        existeObjetivo ? idObjetivo : ""
      )

      // Nota
      setNotas(String(sesion.nota ?? ""))

      // Estado
      setEstado(
        sesion.estado != null &&
        String(sesion.estado).trim() !== ""
          ? String(sesion.estado)
          : "Pendiente"
      )

      // Fecha inicio
      if (sesion.fecha_inicio) {
        const inicio = new Date(sesion.fecha_inicio)

        setFecha(inicio.toISOString().split("T")[0])

        setHoraInicio(
          formatHour12(
            inicio.getHours(),
            inicio.getMinutes()
          )
        )
      }

      // Fecha fin
      if (sesion.fecha_fin) {
        const fin = new Date(sesion.fecha_fin)

        setHoraFin(
          formatHour12(
            fin.getHours(),
            fin.getMinutes()
          )
        )
      }

      console.log("Sesión cargada:", sesion)
      console.log("Tipo sesión seleccionado:", idTipoSesion)
      console.log("Objetivo seleccionado:", idObjetivo)
    } catch (error) {
      console.error("Error cargando sesión:", error)
    }
  }

  cargarSesion()
}, [idSesion, tiposSesion, objetivosSesion])

  const horarios = [
    { hora: "06:00", disponible: true },
    { hora: "07:00", disponible: true },
    { hora: "08:00", disponible: true },
    { hora: "09:00", disponible: false, cliente: "Carlos M." },
    { hora: "10:00", disponible: false, cliente: "María L." },
    { hora: "11:00", disponible: true },
    { hora: "12:00", disponible: true },
    { hora: "13:00", disponible: false, cliente: "Juan P." },
    { hora: "14:00", disponible: true },
    { hora: "15:00", disponible: true },
    { hora: "16:00", disponible: false, cliente: "Ana R." },
    { hora: "17:00", disponible: true },
  ]


  

  return (
    <DashboardLayout>
      <div className="pb-28">
        {/* Header */}
        <div className="mb-8 pt-12 lg:pt-0">
          <div className="flex items-center gap-4">
            <Link href="/calendario">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Nueva Sesión
              </h1>
              <p className="mt-1 text-muted-foreground">
                Programa una nueva sesión de entrenamiento
              </p>
            </div>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          {/* Contenido Principal */}
          <div className="space-y-6">
            {/* Información básica */}
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">1. Información básica</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Completa los datos principales de la sesión.
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Cliente - Rutina - Fecha */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Cliente */}
                 

<div className="space-y-2">
  <label className="text-sm font-medium">
    Cliente <span className="text-destructive">*</span>
  </label>

  <Popover open={clienteOpen} onOpenChange={setClienteOpen}>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-between rounded-xl shadow-sm font-normal"
      >
        <span className="truncate">
          {clienteSeleccionado?.nombre || "Seleccionar cliente..."}
        </span>
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
      <Command>
        <CommandInput placeholder="Buscar cliente..." />

        <CommandList>
          {loadingClientes ? (
            <div className="p-4 text-sm text-muted-foreground">
              Cargando clientes...
            </div>
          ) : (
            <>
              <CommandEmpty>No se encontraron clientes.</CommandEmpty>

              <CommandGroup>
                {clientes.map((cliente) => (
                  <CommandItem
                    key={cliente.id}
                    value={cliente.nombre}
                    onSelect={() => {
                      setClienteSeleccionado(cliente)
                      setClienteOpen(false)
                    }}
                  >
                    {cliente.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>



                  {/* Rutina */}
        <div className="space-y-2">
  <label className="text-sm font-medium">
    Rutina <span className="text-destructive">*</span>
  </label>

  <Select
    value={tipoRutinaSeleccionado}
    onValueChange={(value) => {
      // Guardar únicamente el ID de la rutina seleccionada
      setTipoRutinaSeleccionado(value)
      console.log("Rutina seleccionada:", value)
    }}
  >
    <SelectTrigger className="h-11 rounded-xl shadow-sm w-full">
      <SelectValue placeholder="Seleccionar rutina..." />
    </SelectTrigger>

    <SelectContent>
      {tiposRutina.map((rutina) => (
        <SelectItem
          key={rutina.id_tipo_rutina}
          value={rutina.id_tipo_rutina.toString()}   // SOLO el ID
        >
          {rutina.nombre}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


                 
              {/* Fecha */}
<div className="space-y-2">
  <label className="text-sm font-medium">
    Fecha <span className="text-destructive">*</span>
  </label>

  <Input
    type="date"
    value={fecha}
    onChange={(e) => setFecha(e.target.value)}
    className="h-11 rounded-xl shadow-sm"
  />
</div> 
                </div>

                {/* Hora Inicio - Hora Fin - Duración */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
<TimePickerModal
  label="Hora de inicio"
  value={horaInicio}
  onChange={(value) => {
    const [hour, minute] = value.split(":").map(Number)

    const period = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    setHoraInicio(
      `${hour12.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${period}`
    )
  }}
/>

<TimePickerModal
  label="Hora de fin"
  value={horaFin}
  onChange={(value) => {
    const [hour, minute] = value.split(":").map(Number)

    const period = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    setHoraFin(
      `${hour12.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${period}`
    )
  }}
/>



                  {/* Duración */}
                 <div className="space-y-2">
  <label className="text-sm font-medium">Estado</label>

  <Select value={estado} onValueChange={setEstado}>
    <SelectTrigger className="h-11 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Selecciona un estado" />
      </div>
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="Pendiente">Pendiente</SelectItem>
      <SelectItem value="Iniciada">Iniciada</SelectItem>
      <SelectItem value="Calentamiento">Calentamiento</SelectItem>
      <SelectItem value="Entrenamiento">Entrenamiento</SelectItem>
      <SelectItem value="Finalizada">Finalizada</SelectItem>
      <SelectItem value="Cancelada">Cancelada</SelectItem>
    </SelectContent>
  </Select>
</div>
                </div>

                {/* Ubicación */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicación</label>

                    <Select defaultValue="gimnasio">
                      <SelectTrigger className="h-11 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gimnasio">
                          Gimnasio Principal
                        </SelectItem>
                        <SelectItem value="sala-a">Sala A</SelectItem>
                        <SelectItem value="sala-b">Sala B</SelectItem>
                        <SelectItem value="exterior">Área Exterior</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}

                {/* Resumen */}
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    Resumen de la sesión
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-background px-4 py-3">
                      <p className="text-xs text-muted-foreground">Fecha</p>
                      <p className="text-sm font-medium">{fecha}</p>
                    </div>

                    <div className="rounded-xl bg-background px-4 py-3">
                      <p className="text-xs text-muted-foreground">Inicio</p>
                      <p className="text-sm font-medium">{horaInicio}</p>
                    </div>

                    <div className="rounded-xl bg-background px-4 py-3">
                      <p className="text-xs text-muted-foreground">Fin</p>
                      <p className="text-sm font-medium">{horaFin}</p>
                    </div>

                    <div className="rounded-xl bg-background px-4 py-3">
                      <p className="text-xs text-muted-foreground">Estado</p>
                      <p className="text-sm font-medium text-primary">
                        {estado}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Detalles adicionales */}
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">
                  2. Detalles adicionales
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">




<div className="space-y-2">
  <label className="text-sm font-medium">
    Tipo de sesión
  </label>

  <Select
    value={tipoSesionSeleccionado}
    onValueChange={setTipoSesionSeleccionado}
  >
    <SelectTrigger className="h-11 rounded-xl shadow-sm">
      <SelectValue>
        {tiposSesion.find(
          (t) =>
            String(t.id_tipo_sesion) ===
            String(tipoSesionSeleccionado)
        )?.nombre || "Seleccionar tipo de sesión..."}
      </SelectValue>
    </SelectTrigger>

    <SelectContent>
      {tiposSesion.map((tipo) => (
        <SelectItem
          key={tipo.id_tipo_sesion}
          value={String(tipo.id_tipo_sesion)}
        >
          {tipo.nombre}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


<div className="space-y-2">
  <label className="text-sm font-medium">
    Objetivo
  </label>

  <Select
    value={objetivoSeleccionado}
    onValueChange={setObjetivoSeleccionado}
  >
    <SelectTrigger className="h-11 rounded-xl shadow-sm">
      <SelectValue>
        {objetivosSesion.find(
          (o) =>
            String(o.id_objetivo) ===
            String(objetivoSeleccionado)
        )?.nombre || "Seleccionar objetivo..."}
      </SelectValue>
    </SelectTrigger>

    <SelectContent>
      {objetivosSesion.map((objetivo) => (
        <SelectItem
          key={objetivo.id_objetivo}
          value={String(objetivo.id_objetivo)}
        >
          {objetivo.nombre}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notas para el cliente
                  </label>

                  <Textarea
                    placeholder="Instrucciones o comentarios..."
                    className="min-h-[120px] resize-none rounded-xl"
                    value={notas}
                    onChange={(e) =>
                      setNotas(e.target.value.slice(0, 250))
                    }
                    maxLength={250}
                  />

                  <p className="text-right text-xs text-muted-foreground">
                    {notas.length}/250
                  </p>
                </div>
              </div>
            </section>

            {/* Configuración */}
            {/* <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">3. Configuración</h2>
              </div>

              <div className="p-6 space-y-6">


                
                <div className="rounded-xl border border-border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Recordatorio al cliente
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <Switch
                        checked={recordatorio}
                        onCheckedChange={setRecordatorio}
                      />

                      {recordatorio && (
                        <Select defaultValue="1hora">
                          <SelectTrigger className="w-full lg:w-[180px] rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30min">30 min antes</SelectItem>
                            <SelectItem value="1hora">1 hora antes</SelectItem>
                            <SelectItem value="2horas">2 horas antes</SelectItem>
                            <SelectItem value="1dia">1 día antes</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>




             
                <div className="rounded-xl border border-border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Permitir reagendar
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <Switch
                        checked={permitirReagendar}
                        onCheckedChange={setPermitirReagendar}
                      />

                      {permitirReagendar && (
                        <Select defaultValue="2horas">
                          <SelectTrigger className="w-full lg:w-[180px] rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1hora">1 hora antes</SelectItem>
                            <SelectItem value="2horas">2 horas antes</SelectItem>
                            <SelectItem value="6horas">6 horas antes</SelectItem>
                            <SelectItem value="1dia">1 día antes</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Horarios del día
              </h3>

              <div className="space-y-3">
                {horarios.map((item) => (
                  <div
                    key={item.hora}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.disponible
                            ? "bg-primary"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {item.hora}
                      </span>
                    </div>

                    {!item.disponible && (
                      <span className="text-xs text-muted-foreground">
                        {item.cliente}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl justify-end gap-3 px-6 py-4">
          <Link href="/calendario">
            <Button variant="outline" className="rounded-xl">
              Cancelar
            </Button>
          </Link>

       <Button
  onClick={guardarSesion}
  className="gap-2 rounded-xl px-6"
>
  <Save className="h-4 w-4" />
  Guardar Sesión
</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}