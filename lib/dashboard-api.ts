export interface DashboardRoutine {
  id_cliente: number
  nombre: string
  telefono: string
  altura: number
  peso: number
  objetivo: string
  estado: string
  nivel: string
  edad: number
  id_rutina: number
  nombre_rutina: string
  fecha: string
}

export async function getDashboardRoutines(): Promise<DashboardRoutine[]> {
  const response = await fetch(
    "http://localhost:5057/api/Dashboard/SClientesPendiente",
    {
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error("Error cargando dashboard")
  }

  return response.json()
}