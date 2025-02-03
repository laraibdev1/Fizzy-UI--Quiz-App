"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Timer from "./Timer"
import ProgressBar from "./ProgressBar"

interface Question {
  question: string
  correct_answer: string
  options: string
  category: string
  difficulty: string
}

export default function QuizComponent({ category, difficulty }: { category: string; difficulty: string }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/questions?category=${category}&difficulty=${difficulty}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setQuestions(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching questions:", error)
        setError(`Failed to load questions. Please try again. Error: ${error.message}`)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [category, difficulty])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }, 1000)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setLoading(true)
    router.push("/")
  }

  if (loading) {
    return <div className="text-center">Loading questions...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (questions.length === 0) {
    return <div className="text-center">No questions available for this category and difficulty.</div>
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xl mb-4">
            Your score: {score} out of {questions.length}
          </p>
          <Button onClick={restartQuiz} className="mr-4">
            New Quiz
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            Choose Another Category
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestionData = questions[currentQuestion]
  const options = [currentQuestionData.correct_answer, ...currentQuestionData.options.split(",")].sort(
    () => Math.random() - 0.5,
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{currentQuestionData.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant={
                  selectedAnswer === option
                    ? option === currentQuestionData.correct_answer
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className="w-full text-left justify-start"
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <Timer duration={30} onTimeout={() => handleAnswer("")} />
      </div>
    </div>
  )
}

