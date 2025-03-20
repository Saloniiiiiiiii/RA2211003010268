"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { fetchTopUsers } from "@/lib/api-service-optimized"
import UserCard from "@/components/user-card"
import { Skeleton } from "@/components/ui/skeleton"
import FallbackMessage from "@/components/fallback-message"

export default function TopUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsingFallback(false)
        const topUsers = await fetchTopUsers(5)
        setUsers(topUsers)

        // Check if we're using fallback data
        if (topUsers.some((user) => user.id === "1" && user.name === "John Doe")) {
          setUsingFallback(true)
        }
      } catch (err) {
        setError("Failed to fetch top users. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getTopUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Top Users</h1>
        <p className="text-muted-foreground">Users with the highest number of posts on the platform</p>
      </div>

      {error && <FallbackMessage title="Error" message={error} type="error" />}

      {usingFallback && !error && (
        <FallbackMessage
          title="Using Demo Data"
          message="Unable to connect to the API server. Showing demo data instead."
          type="warning"
        />
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {users.map((user, index) => (
            <UserCard key={user.id} user={user} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

