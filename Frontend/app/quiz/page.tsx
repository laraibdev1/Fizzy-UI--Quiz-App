"use client"

import { useSearchParams } from "next/navigation"
import QuizComponent from "@/components/QuizComponent"

export default function QuizPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QuizComponent category={category} difficulty={difficulty} />
    </main>
  )
}

