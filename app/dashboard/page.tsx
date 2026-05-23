"use client";
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ClientListCard } from "@/components/dashboard/client-list-card"
import { TodayRoutinesCard } from "@/components/dashboard/today-routines-card"
import { AlertsCard } from "@/components/dashboard/alerts-card"
import { MiniCalendar } from "@/components/dashboard/mini-calendar"
import { Users, UserPlus, Dumbbell, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"


interface DashboardData {
  clientesActivos: string;
  clientesCreadosEstaSemana: string;
  clientesConRutinaHoy: string;
  comparacionClientes: string;
  comparacionRutinas: string;
}



export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

 useEffect(() => {
  fetch("http://localhost:5057/api/Dashboard/SObtenerResumenClientes")
    .then((res) => res.json())
    .then((result) => {
      console.log("resultado", result);
      setData(result[0]);
    })
    .catch((error) => console.error(error));
}, []);
  const extraerPorcentaje = (texto: string) => {
    const numero = parseInt(texto);
    return isNaN(numero) ? 0 : Math.abs(numero);
  };

  const esPositivo = (texto: string) => texto.includes("+");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido de vuelta. Aqui tienes un resumen de tu actividad.
        </p>
      </div>

      {/* Stats Grid */}
     
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
  title="Clientes Activos"
  value={Number(data?.clientesActivos) || 0}
  icon={Users}
  trend={{
    value: extraerPorcentaje(data?.comparacionClientes || "0"),
    isPositive: esPositivo(data?.comparacionClientes || ""),
  }}
/>

<StatsCard
  title="Nuevos esta Semana"
  value={Number(data?.clientesCreadosEstaSemana) || 0}
  icon={UserPlus}
  trend={{
    value: extraerPorcentaje(data?.comparacionClientes || "0"),
    isPositive: esPositivo(data?.comparacionClientes || ""),
  }}
/>

<StatsCard
  title="Rutinas Hoy"
  value={Number(data?.clientesConRutinaHoy) || 0}
  icon={Dumbbell}
  description={data?.comparacionRutinas || "0% vs semana pasada"}
/>

       
        <StatsCard
          title="Tasa de Retencion"
          value="94%"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main content */}
        <div className="space-y-6 lg:col-span-2">
          <TodayRoutinesCard />
          <ClientListCard />
        </div>

        {/* Right Column - Sidebar content */}
        <div className="space-y-6">
          <MiniCalendar />
          <AlertsCard />
        </div>
      </div>
    </DashboardLayout>
  )
}
