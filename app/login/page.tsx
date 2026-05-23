"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: any) => {
    e.preventDefault()

    // LOGIN DE PRUEBA
    if (email === "1" && password === "1") {
      router.push("/dashboard")
    } else {
      alert("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      
      <div className="w-full max-w-md">

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8"
        >

          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-green-500 flex items-center justify-center text-3xl shadow-lg mb-4">
              💪
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Abarux Fitness
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Sistema de control de clientes y rutinas
            </p>
          </div>

          {/* Usuario */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm font-medium">
              Usuario
            </label>

            <input
              type="text"
              placeholder="Ingrese su usuario"
              className="w-full mt-2 p-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-gray-300 text-sm font-medium">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full mt-2 p-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Demo info */}
          <div className="mb-5 rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-300">
            <p>
              Usuario de prueba:
              <span className="font-bold"> 1</span>
            </p>

            <p>
              Clave:
              <span className="font-bold"> 1</span>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all p-3 rounded-xl text-white font-semibold shadow-lg"
          >
            Iniciar sesión
          </button>

          {/* Extra */}
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <span className="text-green-400 cursor-pointer hover:underline">
              Crear cuenta
            </span>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Abarux Fitness
        </p>
      </div>
    </div>
  )
}