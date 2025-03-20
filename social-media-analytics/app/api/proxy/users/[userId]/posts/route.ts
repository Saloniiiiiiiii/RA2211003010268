import { NextResponse } from "next/server"

const API_URL = "http://20.244.56.144/test"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    // Make the request server-side to avoid CORS issues
    const response = await fetch(`${API_URL}/users/${userId}/posts`, {
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
    console.error(`Error fetching posts for user ${params.userId}:`, error)
    // Return a more informative error
    return NextResponse.json(
      {
        error: `Failed to fetch posts for user ${params.userId}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

