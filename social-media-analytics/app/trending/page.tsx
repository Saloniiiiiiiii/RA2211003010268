"use client"

import { useEffect, useState } from "react"
import type { Post } from "@/lib/types"
import { fetchTrendingPosts } from "@/lib/api-service-optimized"
import PostCard from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import FallbackMessage from "@/components/fallback-message"

export default function TrendingPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const getTrendingPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsingFallback(false)
        const trendingPosts = await fetchTrendingPosts()
        setPosts(trendingPosts)

        // Check if we're using fallback data
        if (trendingPosts.some((post) => post.content === "Post about technology")) {
          setUsingFallback(true)
        }
      } catch (err) {
        setError("Failed to fetch trending posts. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getTrendingPosts()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Trending Posts</h1>
        <p className="text-muted-foreground">Posts with the highest number of comments</p>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isTrending={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No trending posts found</p>
        </div>
      )}
    </div>
  )
}

