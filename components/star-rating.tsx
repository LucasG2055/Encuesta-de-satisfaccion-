"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <Star
            className={`h-8 w-8 cursor-pointer ${
              star <= (hoverValue || value) ? "fill-[#FFD700] text-[#FFF5CC]" : "text-muted-foreground"
            }`}
          />
          <span className="sr-only">{star} estrellas</span>
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value} estrella${value !== 1 ? "s" : ""}` : "Sin calificación"}
      </span>
    </div>
  )
}

