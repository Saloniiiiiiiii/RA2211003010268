import { NextResponse } from "next/server"

// Mock data for posts
const posts = Array.from({ length: 20 }, (_, i) => {
  const id = `post-${i + 1}`
  const userId = `user-${(i % 5) + 1}`
  const username = `user${(i % 5) + 1}`
  const date = new Date()
  date.setHours(date.getHours() - i)

  const commentCount = Math.floor(Math.random() * 10)
  const comments = Array.from({ length: commentCount }, (_, j) => {
    const commentId = `comment-${i}-${j}`
    const commentUserId = `user-${Math.floor(Math.random() * 10) + 1}`
    const commentUsername = `user${Math.floor(Math.random() * 10) + 1}`
    const commentDate = new Date(date)
    commentDate.setMinutes(commentDate.getMinutes() + j)

    return {
      id: commentId,
      postId: id,
      userId: commentUserId,
      username: commentUsername,
      content: `This is comment ${j + 1} on post ${i + 1}`,
      createdAt: commentDate.toISOString(),
    }
  })

  return {
    id,
    userId,
    username,
    content: `This is post ${i + 1} with some content that might be interesting to read.`,
    createdAt: date.toISOString(),
    comments,
    commentCount,
  }
})

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(posts)
}

