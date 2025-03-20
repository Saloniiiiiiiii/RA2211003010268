"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RefreshCw } from "lucide-react"

interface CalculatorResponse {
  windowPrevState: number[]
  windowCurrState: number[]
  numbers: number[]
  avg: number
}

export function AverageCalculator() {
  const [numberType, setNumberType] = useState<string>("e")
  const [windowSize, setWindowSize] = useState<number>(10)
  const [response, setResponse] = useState<CalculatorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>(() => Math.random().toString(36).substring(2, 15))

  const fetchAverage = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use our internal API endpoint with proper parameters
      const response = await fetch(`/api/calculator?type=${numberType}&windowSize=${windowSize}&sessionId=${sessionId}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: CalculatorResponse = await response.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getNumberTypeName = (type: string) => {
    switch (type) {
      case "f":
        return "Fibonacci"
      case "e":
        return "Even"
      case "r":
        return "Random"
      case "p":
        return "Prime"
      default:
        return "Unknown"
    }
  }

  // Reset window state when number type changes
  useEffect(() => {
    setResponse(null)
    setSessionId(Math.random().toString(36).substring(2, 15))
  }, [numberType])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Average Calculator HTTP Microservice</CardTitle>
        <CardDescription>Calculate the average of different number sequences with a sliding window</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="window-size">Window Size</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="window-size"
                  type="number"
                  min="1"
                  max="100"
                  value={windowSize}
                  onChange={(e) => setWindowSize(Number.parseInt(e.target.value) || 10)}
                  className="w-24"
                />
                <span className="text-sm text-slate-500">Maximum numbers to store</span>
              </div>
            </div>

            <div>
              <Label>Number Type</Label>
              <RadioGroup value={numberType} onValueChange={setNumberType} className="flex flex-wrap gap-4 mt-1.5">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="f" id="fibonacci" />
                  <Label htmlFor="fibonacci">Fibonacci (f)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="e" id="even" />
                  <Label htmlFor="even">Even (e)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="r" id="random" />
                  <Label htmlFor="random">Random (r)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="p" id="prime" />
                  <Label htmlFor="prime">Prime (p)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={fetchAverage} disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Average"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSessionId(Math.random().toString(36).substring(2, 15))
                  setResponse(null)
                }}
                className="w-full sm:w-auto"
              >
                Reset Window
              </Button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">{error}</div>
          ) : (
            response && (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Response:</h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
                  {`{
  "windowPrevState": ${JSON.stringify(response.windowPrevState)},
  "windowCurrState": ${JSON.stringify(response.windowCurrState)},
  "numbers": ${JSON.stringify(response.numbers)}, // response received from 3rd party server
  "avg": ${response.avg.toFixed(2)}
}`}
                </pre>

                <div className="grid gap-4 mt-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Previous Window State:</h3>
                    <div className="flex flex-wrap gap-2">
                      {response.windowPrevState.length > 0 ? (
                        response.windowPrevState.map((number, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-sm"
                          >
                            {number}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">[ ]</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Window State:</h3>
                    <div className="flex flex-wrap gap-2">
                      {response.windowCurrState.length > 0 ? (
                        response.windowCurrState.map((number, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-sm"
                          >
                            {number}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">[ ]</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Average of {getNumberTypeName(numberType)} Numbers:</h3>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 text-xl font-bold">
                      {response.avg.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}

