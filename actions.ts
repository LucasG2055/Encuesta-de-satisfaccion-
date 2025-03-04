"use server"

import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

const surveySchema = z.object({
  doctorName: z.string(),
  rating: z.number(),
  waitTime: z.string().optional(),
  comments: z.string().optional(),
})

// Función para guardar en Supabase
async function saveToSupabase(data: any) {
  try {
    // Crear cliente de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Traducir los valores para la base de datos
    const waitTimeTranslations: Record<string, string> = {
      "menos-de-15": "Menos de 15 minutos",
      "15-30": "15-30 minutos",
      "30-45": "30-45 minutos",
      "45-60": "45-60 minutos",
      "mas-de-60": "Más de 60 minutos",
    }

    const doctorNameTranslations: Record<string, string> = {
      "dra-daniela-sasiain": "Dra. Daniela Sasiain",
      "dra-juliana-accion": "Dra. Juliana Accion",
      "dra-laura-gil": "Dra. Laura Gil",
      "dra-carolina-costa": "Dra. Carolina Costa",
    }

    // Insertar datos en la tabla 'encuestas'
    const { error } = await supabase.from("encuestas").insert({
      fecha: new Date().toISOString(),
      doctora: doctorNameTranslations[data.doctorName] || data.doctorName,
      calificacion: data.rating,
      tiempo_espera: waitTimeTranslations[data.waitTime || ""] || data.waitTime,
      comentarios: data.comments || "",
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error al guardar en Supabase:", error)
    throw new Error("No se pudo guardar en la base de datos")
  }
}

export async function submitSurvey(data: z.infer<typeof surveySchema>) {
  const validatedData = surveySchema.parse(data)

  try {
    await saveToSupabase(validatedData)
    return { success: true }
  } catch (error) {
    console.error("Error al enviar la encuesta:", error)
    throw new Error("No se pudo guardar los datos de la encuesta")
  }
}

