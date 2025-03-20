"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface NumbersDisplayProps {
  title: string
  description: string
  endpoint: string
  apiUrl: string
  type: string
}

interface NumbersResponse {
  numbers: number[]
}

export function NumbersDisplay({ title, description, endpoint, apiUrl, type }: NumbersDisplayProps) {
  const [numbers, setNumbers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNumbers = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use our internal API endpoint instead of trying to fetch directly from external API
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: NumbersResponse = await response.json()
      setNumbers(data.numbers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNumbers()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <CardDescription className="mt-2 text-xs font-mono">API: {apiUrl}</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchNumbers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">{error}</div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Response:</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify({ numbers }, null, 2)}
            </pre>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Numbers:</h3>
              <div className="flex flex-wrap gap-2">
                {numbers.map((number, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-sm"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

