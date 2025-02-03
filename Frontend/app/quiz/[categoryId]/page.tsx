import QuizComponent from "@/components/QuizComponent"

export default function QuizPage({ params }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QuizComponent categoryId={params.categoryId} />
    </main>
  )
}

