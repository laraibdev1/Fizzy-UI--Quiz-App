import { Progress } from "@/components/ui/progress"

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100

  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <p className="text-center mt-1 text-sm text-gray-500">
        Progress: {current}/{total}
      </p>
    </div>
  )
}

