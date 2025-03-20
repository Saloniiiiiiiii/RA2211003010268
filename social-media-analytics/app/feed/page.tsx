"use client"

import { useEffect, useState } from "react"
import type { Post } from "@/lib/types"
import { fetchFeed } from "@/lib/api-service-optimized"
import PostCard from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import FallbackMessage from "@/components/fallback-message"

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingFallback(false)
      const feedPosts = await fetchFeed()
      setPosts(feedPosts)
      setLastUpdated(new Date())

      // Check if we're using fallback data
      if (feedPosts.some((post) => post.content === "Post about technology")) {
        setUsingFallback(true)
      }
    } catch (err) {
      setError("Failed to load feed. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const refreshFeed = async () => {
    try {
      setRefreshing(true)
      setError(null)
      setUsingFallback(false)
      const feedPosts = await fetchFeed()
      setPosts(feedPosts)
      setLastUpdated(new Date())

      // Check if we're using fallback data
      if (feedPosts.some((post) => post.content === "Post about technology")) {
        setUsingFallback(true)
      }
    } catch (err) {
      setError("Failed to refresh feed. Please try again later.")
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadFeed()

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      refreshFeed()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-muted-foreground">
            Latest posts from the platform, updated in real-time
            {lastUpdated && <span className="block text-xs">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <Button
          onClick={refreshFeed}
          disabled={refreshing || loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
        <div className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      )}
    </div>
  )
}

