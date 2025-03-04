"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const [surveyData, setSurveyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data, error } = await supabase.from("encuestas").select("*").order("fecha", { ascending: false })

        if (error) throw error
        setSurveyData(data || [])
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        setError(err.message || "Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular calificaciones promedio por doctora
  const doctorRatings: Record<string, { total: number; count: number }> = {}

  surveyData.forEach((entry) => {
    const doctor = entry.doctora
    const rating = Number(entry.calificacion)

    if (!doctorRatings[doctor]) {
      doctorRatings[doctor] = { total: 0, count: 0 }
    }

    doctorRatings[doctor].total += rating
    doctorRatings[doctor].count += 1
  })

  // Función para exportar a CSV
  const exportToCSV = () => {
    const headers = ["Fecha", "Doctora", "Calificación", "Tiempo de Espera", "Comentarios"]

    const csvRows = [
      headers.join(","),
      ...surveyData.map((entry) =>
        [
          new Date(entry.fecha).toLocaleString(),
          entry.doctora,
          entry.calificacion,
          entry.tiempo_espera,
          `"${(entry.comentarios || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "resultados-encuesta.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p>Cargando datos...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#763eac]">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Lansfem-szRuYiZmi6gtJ36ABK4ktL6yQCxdeX.png"
            alt="Lansfem Logo"
            width={150}
            height={60}
            className="mb-6"
            priority
          />
          <h1 className="text-3xl font-bold text-[#763eac]">Panel de Resultados de Encuestas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="border-b border-[#763eac]/20">
              <CardTitle>Total de Respuestas</CardTitle>
              <CardDescription>Todas las encuestas enviadas</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-[#763eac]">{surveyData.length}</p>
            </CardContent>
          </Card>

          {Object.entries(doctorRatings).map(([doctor, data]) => (
            <Card key={doctor}>
              <CardHeader className="border-b border-[#763eac]/20">
                <CardTitle>{doctor}</CardTitle>
                <CardDescription>Calificación promedio</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-[#763eac]">
                  {(data.total / data.count).toFixed(1)}
                  <span className="text-lg text-muted-foreground"> / 5</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Basado en {data.count} {data.count === 1 ? "respuesta" : "respuestas"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <Button className="bg-[#763eac] hover:bg-[#662e9c]" onClick={exportToCSV}>
            Descargar CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#763eac]/10">
                <th className="p-2 text-left">Fecha y Hora</th>
                <th className="p-2 text-left">Doctora</th>
                <th className="p-2 text-left">Calificación</th>
                <th className="p-2 text-left">Tiempo de Espera</th>
                <th className="p-2 text-left">Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {surveyData.map((entry, index) => (
                <tr key={index} className="border-b border-[#763eac]/10">
                  <td className="p-2">{new Date(entry.fecha).toLocaleString()}</td>
                  <td className="p-2">{entry.doctora}</td>
                  <td className="p-2">{entry.calificacion} / 5</td>
                  <td className="p-2">{entry.tiempo_espera}</td>
                  <td className="p-2">{entry.comentarios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

