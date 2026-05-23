"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, UserX, CreditCard } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Alert {
  id: string
  type: "inactivity" | "payment" | "missed"
  message: string
  time: string
  icon: LucideIcon
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "inactivity",
    message: "Laura Sanchez no ha entrenado en 5 dias",
    time: "Hace 2 horas",
    icon: UserX,
  },
  {
    id: "2",
    type: "payment",
    message: "Pago pendiente de Miguel Rodriguez",
    time: "Hace 1 dia",
    icon: CreditCard,
  },
  {
    id: "3",
    type: "missed",
    message: "Pedro Gomez no asistio a su sesion",
    time: "Ayer",
    icon: Clock,
  },
]

const typeColors = {
  inactivity: "text-warning bg-warning/10",
  payment: "text-destructive bg-destructive/10",
  missed: "text-chart-2 bg-chart-2/10",
}

export function AlertsCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertas
        </CardTitle>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
          {alerts.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-lg border border-border p-3"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[alert.type]}`}
            >
              <alert.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
            <Button variant="ghost" size="sm" className="shrink-0 text-primary">
              Ver
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
