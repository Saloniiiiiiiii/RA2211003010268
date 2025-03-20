import { type NextRequest, NextResponse } from "next/server"
import { mockApiResponses } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const type = params.type

    // Return mock data based on the type
    switch (type) {
      case "fibonacci":
        return NextResponse.json(mockApiResponses.fibonacci)
      case "even":
        return NextResponse.json(mockApiResponses.even)
      case "random":
        return NextResponse.json(mockApiResponses.random)
      case "prime":
        return NextResponse.json(mockApiResponses.prime)
      default:
        return NextResponse.json({ error: "Invalid number type" }, { status: 400 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch numbers" }, { status: 500 })
  }
}

