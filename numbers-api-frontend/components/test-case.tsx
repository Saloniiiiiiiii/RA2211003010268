"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TestResponse {
  windowPrevState: number[]
  windowCurrState: number[]
  numbers: number[]
  avg: number
}

export function TestCase() {
  const [response, setResponse] = useState<TestResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/test-case")
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      console.error("Test case error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Test Case</CardTitle>
            <CardDescription>
              Assuming the window size to be set as 10 and your server running on localhost port 9876.
            </CardDescription>
          </div>
          <Button onClick={runTest} disabled={loading}>
            Run Test
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Request</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
              http://localhost:9876/numbers/e
            </pre>
          </div>

          {response ? (
            <div>
              <h3 className="text-sm font-medium mb-2">1st Response</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
                {`{
  "windowPrevState": ${JSON.stringify(response.windowPrevState)},
  "windowCurrState": ${JSON.stringify(response.windowCurrState)},
  "numbers": ${JSON.stringify(response.numbers)}, // response received from 3rd party server
  "avg": ${response.avg.toFixed(2)}
}`}
              </pre>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium mb-2">1st Response</h3>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
                {`{
  "windowPrevState": [],
  "windowCurrState": [2, 4, 6, 8],
  "numbers": [2, 4, 6, 8], // response received from 3rd party server
  "avg": 5.00
}`}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

