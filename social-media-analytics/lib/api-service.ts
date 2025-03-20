import type { User, Post, Comment, UsersResponse, PostsResponse, CommentsResponse } from "./types"

const API_URL = "http://20.244.56.144/test"

// Helper function to generate random image URLs based on content
export const getRandomImageUrl = (content: string, width = 400, height = 300): string => {
  // Extract the subject from the content (e.g., "Post about elephant" -> "elephant")
  const subject = content.toLowerCase().includes("about") ? content.split("about")[1].trim() : content

  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(subject)}`
}

// Cache for users to minimize API calls
let usersCache: Record<string, User> = {}

// Fetch all users
export const fetchUsers = async (): Promise<Record<string, User>> => {
  try {
    // Return cached users if available
    if (Object.keys(usersCache).length > 0) {
      return usersCache
    }

    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) {
      throw new Error("Failed to fetch users")
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

    usersCache = users
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return {}
  }
}

// Fetch posts by user ID
export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/posts`)
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`)
    }

    const data: PostsResponse = await response.json()
    const users = await fetchUsers()

    // Process the data to add additional properties
    return data.posts.map((post) => ({
      ...post,
      imageUrl: getRandomImageUrl(post.content, 600, 400),
      username: users[post.userid.toString()]?.name || `User ${post.userid}`,
      commentCount: 0, // Will be updated when fetching comments
    }))
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

// Fetch comments by post ID
export const fetchCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`)
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`)
    }

    const data: CommentsResponse = await response.json()
    return data.comments
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

// Fetch all posts (for all users)
export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
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

    // Fetch comments for each post to get comment counts
    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const comments = await fetchCommentsByPost(post.id)
        return {
          ...post,
          commentCount: comments.length,
        }
      }),
    )

    return postsWithComments
  } catch (error) {
    console.error("Error fetching all posts:", error)
    return []
  }
}

// Fetch top users by post count
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
    return []
  }
}

// Fetch trending posts (posts with the most comments)
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
    return []
  }
}

// Fetch real-time feed (newest posts first)
export const fetchFeed = async (): Promise<Post[]> => {
  try {
    const allPosts = await fetchAllPosts()

    // Sort posts by ID in descending order (assuming higher IDs are newer)
    return [...allPosts].sort((a, b) => b.id - a.id)
  } catch (error) {
    console.error("Error fetching feed:", error)
    return []
  }
}

