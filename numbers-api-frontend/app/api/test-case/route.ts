import { NextResponse } from "next/server"

export async function GET() {
  // Return a simulated test case response
  return NextResponse.json({
    windowPrevState: [],
    windowCurrState: [2, 4, 6, 8],
    numbers: [2, 4, 6, 8],
    avg: 5.0,
  })
}

