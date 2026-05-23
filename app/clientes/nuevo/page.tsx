"use client"

import { url } from "@/lib/url"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ArrowLeft, ChevronDown, Save, User, Target, FileText } from "lucide-react"
import Link from "next/link"

export default function NuevoClientePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [physicalInfoOpen, setPhysicalInfoOpen] = useState(true)
  const [trainingInfoOpen, setTrainingInfoOpen] = useState(true)

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  age: "",
  weight: "",
  height: "",
  objective: "",
  level: "",
  injuries: "",
  notes: "",
})

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    // 🔥 Validación
    if (!formData.objective || !formData.level) {
      alert("Debes seleccionar objetivo y nivel")
      setIsLoading(false)
      return
    }

    const response = await fetch(`${url}/api/Clientes/IClientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: formData.name,
        email: formData.email,
        telefono: formData.phone || null,
        edad: formData.age ? Number(formData.age) : null,
        peso: formData.weight ? Number(formData.weight) : null,
        altura: formData.height ? Number(formData.height) : null,
        objetivo: formData.objective,
        nivel: formData.level,
        lesiones: formData.injuries || null,
        notas: formData.notes || null,
      }),
    })

    if (!response.ok) {
      let errorMsg = "Error al guardar cliente"

      try {
        const err = await response.json()
        errorMsg = err.mensaje || errorMsg
      } catch {}

      throw new Error(errorMsg)
    }

    // 🔥 evitar crash si no hay JSON
    let data = null
    try {
      data = await response.json()
    } catch {}

    console.log("Respuesta API:", data)

    router.push("/clientes")
  } catch (error: any) {
    console.error(error)
    alert(error.message || "Hubo un error al guardar el cliente")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Nuevo Cliente</h1>
            <p className="text-muted-foreground mt-1">
              Completa la informacion del nuevo cliente
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <Collapsible open={basicInfoOpen} onOpenChange={setBasicInfoOpen}>
          <Card className="bg-card border-border">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Informacion Basica
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      basicInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Carlos Martinez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 612 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Physical Information */}
        <Collapsible open={physicalInfoOpen} onOpenChange={setPhysicalInfoOpen}>
          <Card className="bg-card border-border">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    Datos Fisicos
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      physicalInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="28"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="75.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Training Information */}
        <Collapsible open={trainingInfoOpen} onOpenChange={setTrainingInfoOpen}>
          <Card className="bg-card border-border">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Informacion de Entrenamiento
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      trainingInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="objective">Objetivo *</Label>
                    <Select
                      value={formData.objective}
                      onValueChange={(value) =>
  setFormData({ ...formData, objective: value })
}
                    >
                      <SelectTrigger id="objective">
                        <SelectValue placeholder="Seleccionar objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perder-grasa">Perder Grasa</SelectItem>
                        <SelectItem value="ganar-musculo">Ganar Musculo</SelectItem>
                        <SelectItem value="tonificar">Tonificar</SelectItem>
                        <SelectItem value="resistencia">Resistencia</SelectItem>
                        <SelectItem value="salud-general">Salud General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel *</Label>
                    <Select
                      value={formData.level}
                     onValueChange={(value) =>
  setFormData({ ...formData, level: value })
}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="principiante">Principiante</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="injuries">Lesiones o condiciones medicas</Label>
                  <Textarea
                    id="injuries"
                    placeholder="Describe cualquier lesion o condicion medica relevante..."
                    value={formData.injuries}
                    onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Cualquier informacion adicional sobre el cliente..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
            <Link href="/clientes">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
