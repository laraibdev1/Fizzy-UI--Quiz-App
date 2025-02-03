"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export default function Timer({ duration, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeout])

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  return (
    <div className="w-24">
      <Progress value={(timeLeft / duration) * 100} className="w-full" />
      <p className="text-center mt-1">{timeLeft}s</p>
    </div>
  )
}

