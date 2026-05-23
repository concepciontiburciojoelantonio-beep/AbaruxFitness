export interface Client {
  id: string
  name: string
  email: string
  phone: string
  age: number
  weight: number
  height: number
  objective: "perder-grasa" | "ganar-musculo" | "tonificar" | "resistencia" | "salud-general"
  level: "principiante" | "intermedio" | "avanzado"
  status: "active" | "inactive"
  injuries?: string
  notes?: string
  joinDate: string
  lastActivity: string
  photoUrl?: string
  id_rutina: number
}

export interface Routine {
  id: string
  name: string
  clientId: string
  clientName: string
  type: "fuerza" | "cardio" | "mixto" | "flexibilidad"
  days: RoutineDay[]
  createdAt: string
  updatedAt: string
}

export interface RoutineDay {
  id: string
  id_dia?: number
  name: string
  exercises: Exercise[]
  year?: string
  month?: string
  day?: string
  hour?: string
  minute?: string
  period?: string
  selectedDate?: Date
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weight?: string
  notes?: string
  status: string
  completed?: boolean
}

export interface ProgressEntry {
  id: string
  clientId: string
  date: string
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  notes?: string
  photoUrl?: string
}

export interface CalendarEvent {
  id: string
  clientId: string
  clientName: string
  routineId: string
  routineName: string
  date: string
  time: string
  status: "pendiente" | "en-progreso" | "completado" | "cancelado"
}

export const objectiveLabels: Record<Client["objective"], string> = {
  "perder-grasa": "Perder Grasa",
  "ganar-musculo": "Ganar Musculo",
  "tonificar": "Tonificar",
  "resistencia": "Resistencia",
  "salud-general": "Salud General",
}

export const levelLabels: Record<Client["level"], string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
}
