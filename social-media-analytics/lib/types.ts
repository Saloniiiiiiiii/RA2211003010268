export interface User {
  id: string
  name: string
  username?: string // Added for UI purposes
  postCount?: number // Will be calculated
  avatarUrl?: string // Will be generated
}

export interface Comment {
  id: number
  postid: number
  content: string
}

export interface Post {
  id: number
  userid: number
  content: string
  imageUrl?: string // Will be generated
  commentCount?: number // Will be calculated
  username?: string // Will be added from user data
}

export interface UsersResponse {
  users: {
    [key: string]: string
  }
}

export interface PostsResponse {
  posts: Post[]
}

export interface CommentsResponse {
  comments: Comment[]
}

