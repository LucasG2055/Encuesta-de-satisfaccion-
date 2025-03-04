"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { StarRating } from "@/components/star-rating"
import { submitSurvey } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  doctorName: z.string({
    required_error: "Por favor seleccione una doctora",
  }),
  rating: z.number().min(1, {
    message: "Por favor proporcione una calificación",
  }),
  waitTime: z.string().optional(),
  comments: z.string().optional(),
})

export function SurveyForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comments: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await submitSurvey(values)
      toast({
        title: "Encuesta enviada",
        description: "¡Gracias por sus comentarios!",
      })
      form.reset()
      router.push("/gracias")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar su encuesta. Por favor intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctora</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una doctora" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dra-daniela-sasiain">Dra. Daniela Sasiain</SelectItem>
                  <SelectItem value="dra-juliana-accion">Dra. Juliana Accion</SelectItem>
                  <SelectItem value="dra-laura-gil">Dra. Laura Gil</SelectItem>
                  <SelectItem value="dra-carolina-costa">Dra. Carolina Costa</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Seleccione la doctora que desea calificar</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiencia General</FormLabel>
              <FormControl>
                <StarRating value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>¿Cómo calificaría su experiencia general?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waitTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiempo de Espera</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tiempo de espera" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="menos-de-15">Menos de 15 minutos</SelectItem>
                  <SelectItem value="15-30">15-30 minutos</SelectItem>
                  <SelectItem value="30-45">30-45 minutos</SelectItem>
                  <SelectItem value="45-60">45-60 minutos</SelectItem>
                  <SelectItem value="mas-de-60">Más de 60 minutos</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>¿Cuánto tiempo esperó antes de ver a la doctora?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios Adicionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Por favor comparta cualquier comentario adicional sobre su experiencia"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Sus comentarios nos ayudan a mejorar nuestros servicios</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#763eac] hover:bg-[#662e9c]" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Encuesta"}
        </Button>
      </form>
    </Form>
  )
}

