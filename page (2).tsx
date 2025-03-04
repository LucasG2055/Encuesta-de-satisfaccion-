import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-[#763eac]" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#763eac]">Thank You!</h1>
        <p className="text-muted-foreground mb-8">
          Your feedback has been submitted successfully. We appreciate your time and input.
        </p>
        <Link href="/">
          <Button className="bg-[#763eac] hover:bg-[#662e9c]">Submit Another Response</Button>
        </Link>
      </div>
    </main>
  )
}

