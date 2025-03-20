import { NextResponse } from "next/server"

const API_URL = "http://20.244.56.144/test"

export async function GET() {
  try {
    // Make the request server-side to avoid CORS issues
    const response = await fetch(`${API_URL}/users`, {
      cache: "no-store", // Don't cache the response
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching users:", error)
    // Return a more informative error
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

