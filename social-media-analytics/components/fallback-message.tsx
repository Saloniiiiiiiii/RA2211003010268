import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FallbackMessageProps {
  title: string
  message: string
  type?: "error" | "warning" | "info"
}

export default function FallbackMessage({ title, message, type = "info" }: FallbackMessageProps) {
  const icons = {
    error: <AlertCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  }

  const variants = {
    error: "destructive",
    warning: "default",
    info: "default",
  }

  return (
    <Alert variant={variants[type] as any}>
      {icons[type]}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

