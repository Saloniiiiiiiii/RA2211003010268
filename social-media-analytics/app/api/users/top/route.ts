import { NextResponse } from "next/server"

// Mock data for top users
const users = [
  { id: "user-1", username: "user1", name: "John Doe", postCount: 42 },
  { id: "user-2", username: "user2", name: "Jane Smith", postCount: 38 },
  { id: "user-3", username: "user3", name: "Bob Johnson", postCount: 35 },
  { id: "user-4", username: "user4", name: "Alice Williams", postCount: 29 },
  { id: "user-5", username: "user5", name: "Charlie Brown", postCount: 24 },
  { id: "user-6", username: "user6", name: "Diana Prince", postCount: 21 },
  { id: "user-7", username: "user7", name: "Edward Clark", postCount: 18 },
  { id: "user-8", username: "user8", name: "Fiona Green", postCount: 15 },
  { id: "user-9", username: "user9", name: "George Wilson", postCount: 12 },
  { id: "user-10", username: "user10", name: "Hannah Moore", postCount: 10 },
]

export async function GET(request: Request) {
  // Get the limit from query parameters
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "5", 10)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return the top users based on the limit
  return NextResponse.json(users.slice(0, limit))
}

