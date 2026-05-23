"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getDashboardRoutines, DashboardRoutine } from "@/lib/dashboard-api"

const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"]

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [routines, setRoutines] = useState<DashboardRoutine[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    loadRoutines()
  }, [])

  async function loadRoutines() {
    try {
      const data = await getDashboardRoutines()
      setRoutines(data)
    } catch (error) {
      console.log(error)
    }
  }
const router = useRouter()
  
const groupedByDate = routines.reduce((acc, item) => {
  const rawDate = new Date(item.fecha)

  if (isNaN(rawDate.getTime())) return acc

  const year = rawDate.getFullYear()
  const month = String(rawDate.getMonth() + 1).padStart(2, "0")
  const day = String(rawDate.getDate()).padStart(2, "0")

  const date = `${year}-${month}-${day}`

  if (!acc[date]) acc[date] = []
  acc[date].push(item)

  return acc
}, {} as Record<string, DashboardRoutine[]>)


  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay < 0) startDay = 6

  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year
  const currentDay = today.getDate()

  const days: (number | null)[] = []

  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  function getDateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold capitalize">
            {monthName}
          </CardTitle>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const dateKey = day ? getDateKey(day) : ""
              const events = day ? groupedByDate[dateKey] || [] : []

              return (
                <div
                  key={index}
                  onClick={() => day && events.length > 0 && setSelectedDate(dateKey)}
                  style={
    events.length > 0
      ? {
          backgroundColor: "var(--warning)",
          color: "#000",
          fontWeight: "600",
        }
      : {}
  }
  className={cn(
    "relative flex h-8 items-center justify-center text-sm rounded-md transition-all",

    day === null && "text-transparent",

    day !== null && "cursor-pointer hover:bg-muted",

    isCurrentMonth &&
      day === currentDay &&
      "bg-primary text-primary-foreground font-medium"
  )}
>
                  {day}

              
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

 {selectedDate && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.85)",
      padding: "20px",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "320px",
        maxHeight: "80vh",
        backgroundColor: "#09090b",
        borderRadius: "18px",
        padding: "20px",
        overflow: "hidden",
        border: "1px solid #27272a",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
      }}
    >
      <button
        onClick={() => setSelectedDate(null)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "34px",
          height: "34px",
          border: "none",
          borderRadius: "50%",
          backgroundColor: "#dc2626",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={18} />
      </button>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
          Rutinas del día
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "14px" }}>
          {selectedDate}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "60vh",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {groupedByDate[selectedDate]?.map((item, index) => (
          <div
            key={index}
            onClick={() => {
            router.push(`/rutinas/${item.id_rutina}?cliente=${item.id_cliente}`)
            }}
            style={{
                       border: "1px solid #27272a",
  borderRadius: "14px",
  padding: "14px",
  backgroundColor: "#18181b",
  cursor: "pointer",
  transition: "0.2s",
}}
onMouseEnter={(e) =>
  (e.currentTarget.style.backgroundColor = "#27272a")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.backgroundColor = "#18181b")
}
          >
            <h3
              style={{
                color: "#22c55e",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {item.nombre_rutina}
            </h3>

            <div style={{ fontSize: "14px", lineHeight: 1.8 }}>
              <p><strong>Cliente:</strong> {item.nombre}</p>
              <p><strong>Teléfono:</strong> {item.telefono}</p>
              <p><strong>Altura:</strong> {item.altura}</p>
              <p><strong>Peso:</strong> {item.peso}</p>
              <p><strong>Objetivo:</strong> {item.objetivo}</p>
              <p><strong>Nivel:</strong> {item.nivel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </>
  )
}