import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Lansfem-szRuYiZmi6gtJ36ABK4ktL6yQCxdeX.png"
            alt="Lansfem Logo"
            width={150}
            height={60}
            className="mb-8"
            priority
          />
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-[#763eac]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#763eac]">¡Gracias!</h1>
          <p className="text-muted-foreground mb-8">
            Su opinión ha sido enviada con éxito. Agradecemos su tiempo y comentarios.
          </p>
          <Link href="/">
            <Button className="bg-[#763eac] hover:bg-[#662e9c]">Enviar Otra Respuesta</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

