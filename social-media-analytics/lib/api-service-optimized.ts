import type { User, Post, Comment, UsersResponse, PostsResponse, CommentsResponse } from "./types"
import { Cache } from "./cache-utils"

// Use relative URLs to our proxy API routes
const API_URL = "/api/proxy"

// Create caches for different data types
const usersCache = new Cache<Record<string, User>>(300) // 5 minutes
const postsCache = new Cache<Post[]>(60) // 1 minute
const commentsCache = new Cache<Comment[]>(60) // 1 minute
const userPostsCache = new Cache<Post[]>(120) // 2 minutes
const postCommentsCache = new Cache<Comment[]>(120) // 2 minutes

// Mock data for fallback when API fails
const mockUsers: Record<string, User> = {
  "1": {
    id: "1",
    name: "John Doe",
    username: "john.doe",
    postCount: 10,
    avatarUrl: "/placeholder.svg?height=200&width=200&text=John%20Doe",
  },
  "2": {
    id: "2",
    name: "Jane Doe",
    username: "jane.doe",
    postCount: 8,
    avatarUrl: "/placeholder.svg?height=200&width=200&text=Jane%20Doe",
  },
  "3": {
    id: "3",
    name: "Alice Smith",
    username: "alice.smith",
    postCount: 7,
    avatarUrl: "/placeholder.svg?height=200&width=200&text=Alice%20Smith",
  },
  "4": {
    id: "4",
    name: "Bob Johnson",
    username: "bob.johnson",
    postCount: 6,
    avatarUrl: "/placeholder.svg?height=200&width=200&text=Bob%20Johnson",
  },
  "5": {
    id: "5",
    name: "Charlie Brown",
    username: "charlie.brown",
    postCount: 5,
    avatarUrl: "/placeholder.svg?height=200&width=200&text=Charlie%20Brown",
  },
}

const mockPosts: Post[] = [
  {
    id: 1,
    userid: 1,
    content: "Post about technology",
    commentCount: 5,
    username: "John Doe",
    imageUrl: "/placeholder.svg?height=400&width=600&text=technology",
  },
  {
    id: 2,
    userid: 2,
    content: "Post about nature",
    commentCount: 3,
    username: "Jane Doe",
    imageUrl: "/placeholder.svg?height=400&width=600&text=nature",
  },
  {
    id: 3,
    userid: 3,
    content: "Post about art",
    commentCount: 7,
    username: "Alice Smith",
    imageUrl: "/placeholder.svg?height=400&width=600&text=art",
  },
  {
    id: 4,
    userid: 4,
    content: "Post about science",
    commentCount: 2,
    username: "Bob Johnson",
    imageUrl: "/placeholder.svg?height=400&width=600&text=science",
  },
  {
    id: 5,
    userid: 5,
    content: "Post about music",
    commentCount: 4,
    username: "Charlie Brown",
    imageUrl: "/placeholder.svg?height=400&width=600&text=music",
  },
]

// Helper function to generate random image URLs based on content
export const getRandomImageUrl = (content: string, width = 400, height = 300): string => {
  // Extract the subject from the content (e.g., "Post about elephant" -> "elephant")
  const subject = content.toLowerCase().includes("about") ? content.split("about")[1].trim() : content

  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(subject)}`
}

// Fetch all users with caching and fallback
export const fetchUsers = async (): Promise<Record<string, User>> => {
  try {
    // Check cache first
    const cachedUsers = usersCache.get("users")
    if (cachedUsers) {
      return cachedUsers
    }

    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("API error:", errorData)
      throw new Error(`API error: ${errorData.error || response.statusText}`)
    }

    const data: UsersResponse = await response.json()

    // Process the data to match our User type
    const users: Record<string, User> = {}

    for (const [id, name] of Object.entries(data.users)) {
      users[id] = {
        id,
        name,
        username: name.toLowerCase().replace(/\s+/g, "."),
        avatarUrl: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name)}`,
        postCount: 0, // Will be updated when fetching posts
      }
    }

    // Store in cache
    usersCache.set("users", users)
    return users
  } catch (error) {
    console.error("Error fetching users:", error)

    // Use mock data as fallback
    console.log("Using mock user data as fallback")
    usersCache.set("users", mockUsers)
    return mockUsers
  }
}

// Fetch posts by user ID with caching and fallback
export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
  try {
    // Check cache first
    const cacheKey = `user-posts-${userId}`
    const cachedPosts = userPostsCache.get(cacheKey)
    if (cachedPosts) {
      return cachedPosts
    }

    const response = await fetch(`${API_URL}/users/${userId}/posts`)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("API error:", errorData)
      throw new Error(`API error: ${errorData.error || response.statusText}`)
    }

    const data: PostsResponse = await response.json()
    const users = await fetchUsers()

    // Process the data to add additional properties
    const posts = data.posts.map((post) => ({
      ...post,
      imageUrl: getRandomImageUrl(post.content, 600, 400),
      username: users[post.userid.toString()]?.name || `User ${post.userid}`,
      commentCount: 0, // Will be updated when fetching comments
    }))

    // Store in cache
    userPostsCache.set(cacheKey, posts)
    return posts
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)

    // Use mock data as fallback, filtered for this user
    const userMockPosts = mockPosts.filter((post) => post.userid.toString() === userId)
    userPostsCache.set(`user-posts-${userId}`, userMockPosts)
    return userMockPosts
  }
}

// Fetch comments by post ID with caching and fallback
export const fetchCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    // Check cache first
    const cacheKey = `post-comments-${postId}`
    const cachedComments = postCommentsCache.get(cacheKey)
    if (cachedComments) {
      return cachedComments
    }

    const response = await fetch(`${API_URL}/posts/${postId}/comments`)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("API error:", errorData)
      throw new Error(`API error: ${errorData.error || response.statusText}`)
    }

    const data: CommentsResponse = await response.json()

    // Store in cache
    postCommentsCache.set(cacheKey, data.comments)
    return data.comments
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)

    // Use mock data as fallback - generate some mock comments
    const mockComments: Comment[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: i + 1,
      postid: postId,
      content: `Mock comment ${i + 1} for post ${postId}`,
    }))

    postCommentsCache.set(`post-comments-${postId}`, mockComments)
    return mockComments
  }
}

// Fetch all posts (for all users) with efficient caching and fallback
export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    // Check cache first
    const cachedPosts = postsCache.get("all-posts")
    if (cachedPosts) {
      return cachedPosts
    }

    const users = await fetchUsers()
    const userIds = Object.keys(users)

    // Fetch posts for each user in parallel
    const postsPromises = userIds.map((userId) => fetchPostsByUser(userId))
    const postsArrays = await Promise.all(postsPromises)

    // Flatten the array of arrays
    const allPosts = postsArrays.flat()

    // Update post counts for users
    userIds.forEach((userId, index) => {
      if (users[userId]) {
        users[userId].postCount = postsArrays[index].length
      }
    })

    // Update the users cache with post counts
    usersCache.set("users", users)

    // Fetch comments for each post to get comment counts (in batches to avoid too many parallel requests)
    const batchSize = 5
    const batches = []

    for (let i = 0; i < allPosts.length; i += batchSize) {
      batches.push(allPosts.slice(i, i + batchSize))
    }

    const processedPosts: Post[] = []

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (post) => {
          const comments = await fetchCommentsByPost(post.id)
          return {
            ...post,
            commentCount: comments.length,
          }
        }),
      )

      processedPosts.push(...batchResults)
    }

    // Store in cache
    postsCache.set("all-posts", processedPosts)
    return processedPosts
  } catch (error) {
    console.error("Error fetching all posts:", error)

    // Use mock data as fallback
    console.log("Using mock post data as fallback")
    postsCache.set("all-posts", mockPosts)
    return mockPosts
  }
}

// Fetch top users by post count with fallback
export const fetchTopUsers = async (limit = 5): Promise<User[]> => {
  try {
    const users = await fetchUsers()

    // Ensure post counts are updated
    await fetchAllPosts()

    // Convert users object to array, sort by post count, and take the top N
    return Object.values(users)
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, limit)
  } catch (error) {
    console.error("Error fetching top users:", error)

    // Use mock data as fallback
    return Object.values(mockUsers)
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, limit)
  }
}

// Fetch trending posts (posts with the most comments) with fallback
export const fetchTrendingPosts = async (): Promise<Post[]> => {
  try {
    const allPosts = await fetchAllPosts()

    // Sort posts by comment count in descending order
    const sortedPosts = [...allPosts].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))

    // Find the maximum comment count
    const maxCommentCount = sortedPosts[0]?.commentCount || 0

    // Return all posts that have the maximum comment count
    return sortedPosts.filter((post) => post.commentCount === maxCommentCount)
  } catch (error) {
    console.error("Error fetching trending posts:", error)

    // Use mock data as fallback
    const sortedMockPosts = [...mockPosts].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))

    const maxCommentCount = sortedMockPosts[0]?.commentCount || 0
    return sortedMockPosts.filter((post) => post.commentCount === maxCommentCount)
  }
}

// Fetch real-time feed (newest posts first) with fallback
export const fetchFeed = async (): Promise<Post[]> => {
  try {
    const allPosts = await fetchAllPosts()

    // Sort posts by ID in descending order (assuming higher IDs are newer)
    return [...allPosts].sort((a, b) => b.id - a.id)
  } catch (error) {
    console.error("Error fetching feed:", error)

    // Use mock data as fallback
    return [...mockPosts].sort((a, b) => b.id - a.id)
  }
}

