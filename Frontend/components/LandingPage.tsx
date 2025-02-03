"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Moon } from "lucide-react"

const categories = [
  { id: "general", name: "General Knowledge", icon: "🧠" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "history", name: "History", icon: "📜" },
  { id: "geography", name: "Geography", icon: "🌍" },
  { id: "entertainment", name: "Entertainment", icon: "🎭" },
]

const difficulties = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleStartQuiz = () => {
    if (selectedCategory && selectedDifficulty) {
      router.push(`/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}`)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">Dynamic Quiz App</h1>
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Start a New Quiz</CardTitle>
          <CardDescription>Choose a category and difficulty to begin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStartQuiz} className="w-full" disabled={!selectedCategory || !selectedDifficulty}>
            Start Quiz
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-3xl mr-2">{category.icon}</span>
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Test your knowledge in {category.name.toLowerCase()}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

