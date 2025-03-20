import { type NextRequest, NextResponse } from "next/server"
import { mockApiResponses, windowStates } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "e"
    const windowSize = Number.parseInt(searchParams.get("windowSize") || "10")
    const sessionId = searchParams.get("sessionId") || "default"

    // Get the current window state
    const currentWindowState = windowStates[sessionId] || []

    // Determine which mock data to use based on type
    let newNumbers: number[] = []

    switch (type) {
      case "f":
        newNumbers = mockApiResponses.fibonacci.numbers
        break
      case "e":
        newNumbers = mockApiResponses.even.numbers
        break
      case "r":
        newNumbers = mockApiResponses.random.numbers
        break
      case "p":
        newNumbers = mockApiResponses.prime.numbers
        break
    }

    // Process according to requirements
    // 1. Ensure uniqueness
    const uniqueNewNumbers = newNumbers.filter((num) => !currentWindowState.includes(num))

    // 2. Apply window size constraints
    const updatedWindowState = [...currentWindowState]

    // Add new unique numbers
    for (const num of uniqueNewNumbers) {
      // If we've reached window size, remove the oldest number
      if (updatedWindowState.length >= windowSize) {
        updatedWindowState.shift() // Remove oldest (first) element
      }
      updatedWindowState.push(num) // Add new number
    }

    // Calculate average
    const avg =
      updatedWindowState.length > 0
        ? updatedWindowState.reduce((sum, num) => sum + num, 0) / updatedWindowState.length
        : 0

    // Update the window state for next request
    windowStates[sessionId] = updatedWindowState

    return NextResponse.json({
      windowPrevState: currentWindowState,
      windowCurrState: updatedWindowState,
      numbers: uniqueNewNumbers.slice(0, windowSize), // The numbers received from the 3rd party server
      avg,
    })
  } catch (error) {
    console.error("Calculator API error:", error)
    return NextResponse.json({ error: "Failed to calculate average" }, { status: 500 })
  }
}

