"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimePickerModalProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
)

const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]

export function TimePickerModal({
  value,
  onChange,
  label = "Seleccionar hora",
}: TimePickerModalProps) {
  const [open, setOpen] = useState(false)

  const parseTime = (time: string) => {
    if (!time) {
      return {
        hour: "09",
        minute: "30",
        period: "AM",
      }
    }

    const [h, m] = time.split(":")
    let hour = Number(h)
    let period = "AM"

    if (hour >= 12) period = "PM"
    if (hour === 0) hour = 12
    if (hour > 12) hour -= 12

    return {
      hour: String(hour).padStart(2, "0"),
      minute: m,
      period,
    }
  }

  const current = parseTime(value)

  const [selectedHour, setSelectedHour] = useState(current.hour)
  const [selectedMinute, setSelectedMinute] = useState(current.minute)
  const [selectedPeriod, setSelectedPeriod] = useState(current.period)

  const formatDisplay = (time: string) => {
    if (!time) return ""

    const [h, m] = time.split(":")
    let hour = Number(h)
    const period = hour >= 12 ? "PM" : "AM"

    if (hour === 0) hour = 12
    if (hour > 12) hour -= 12

    return `${String(hour).padStart(2, "0")}:${m} ${period}`
  }

  const handleConfirm = () => {
    let hour24 = Number(selectedHour)

    if (selectedPeriod === "AM") {
      if (hour24 === 12) hour24 = 0
    } else {
      if (hour24 !== 12) hour24 += 12
    }

    const finalTime =
      `${String(hour24).padStart(2, "0")}:${selectedMinute}`

    onChange(finalTime)
    setOpen(false)
  }

  const TimeButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
    >
      {children}
    </button>
  )

  return (
    <>
      {/* Input */}
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium">{label}</label>
        )}

        <div className="relative">
          <Input
            readOnly
            value={formatDisplay(value)}
            placeholder="Seleccionar hora"
            onClick={() => setOpen(true)}
            className="h-11 cursor-pointer rounded-xl pr-10"
          />

          <Clock
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hora y Minutos</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vista previa */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Selecciona la hora
              </p>
              <p className="mt-2 text-4xl font-bold">
                {selectedHour}:{selectedMinute} {selectedPeriod}
              </p>
            </div>

            {/* Selectores */}
            <div className="grid grid-cols-3 gap-6">
              {/* Horas */}
              <div>
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  HORAS
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {hours.map((hour) => (
                    <TimeButton
                      key={hour}
                      active={selectedHour === hour}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {hour}
                    </TimeButton>
                  ))}
                </div>
              </div>

              {/* Minutos */}
              <div>
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  MINUTOS
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {minutes.map((minute) => (
                    <TimeButton
                      key={minute}
                      active={selectedMinute === minute}
                      onClick={() => setSelectedMinute(minute)}
                    >
                      {minute}
                    </TimeButton>
                  ))}
                </div>
              </div>

              {/* Periodo */}
              <div>
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  PERIODO
                </p>
                <div className="space-y-2">
                  {["AM", "PM"].map((period) => (
                    <Button
                      key={period}
                      type="button"
                      variant={
                        selectedPeriod === period
                          ? "default"
                          : "outline"
                      }
                      className="w-full"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}