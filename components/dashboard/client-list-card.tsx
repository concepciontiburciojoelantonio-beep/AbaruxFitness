"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  name: string
  objective: string
  lastActivity: string
  status: "active" | "inactive" | "warning"
  level: "principiante" | "intermedio" | "avanzado"
}

const clients: Client[] = [
  {
    id: "1",
    name: "Carlos Martinez",
    objective: "Ganar musculo",
    lastActivity: "Hace 2 horas",
    status: "active",
    level: "intermedio",
  },
  {
    id: "2",
    name: "Ana Garcia",
    objective: "Perder grasa",
    lastActivity: "Hace 1 dia",
    status: "active",
    level: "principiante",
  },
  {
    id: "3",
    name: "Miguel Rodriguez",
    objective: "Tonificar",
    lastActivity: "Hace 3 dias",
    status: "warning",
    level: "avanzado",
  },
  {
    id: "4",
    name: "Laura Sanchez",
    objective: "Resistencia",
    lastActivity: "Hace 5 dias",
    status: "inactive",
    level: "intermedio",
  },
]

const statusColors = {
  active: "bg-primary/20 text-primary",
  inactive: "bg-muted text-muted-foreground",
  warning: "bg-warning/20 text-warning",
}

const levelColors = {
  principiante: "bg-chart-2/20 text-chart-2",
  intermedio: "bg-chart-3/20 text-chart-3",
  avanzado: "bg-chart-1/20 text-chart-1",
}

export function ClientListCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Clientes Recientes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clientes" className="flex items-center gap-1 text-primary">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/clientes/${client.id}`}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {client.name}
                </p>
                <Badge
                  variant="secondary"
                  className={levelColors[client.level]}
                >
                  {client.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {client.objective}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{client.lastActivity}</span>
            </div>
            <div
              className={`h-2 w-2 rounded-full ${
                client.status === "active"
                  ? "bg-primary"
                  : client.status === "warning"
                  ? "bg-warning"
                  : "bg-muted-foreground"
              }`}
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
