import Image from "next/image"
import { MessageSquare } from "lucide-react"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  post: Post
  isTrending?: boolean
}

export default function PostCard({ post, isTrending = false }: PostCardProps) {
  // Extract the first letter of each word for the avatar fallback
  const avatarFallback = post.username
    ? post.username
        .split(" ")
        .map((word) => word[0])
        .join("")
    : `U${post.userid}`

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage
            src={`/placeholder.svg?height=40&width=40&text=User${post.userid}`}
            alt={post.username || `User ${post.userid}`}
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.username || `User ${post.userid}`}</p>
          <p className="text-xs text-muted-foreground">Post ID: {post.id}</p>
        </div>
        {isTrending && <Badge className="ml-auto bg-primary hover:bg-primary">Trending</Badge>}
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4">{post.content}</p>
        <div className="relative aspect-video overflow-hidden rounded-md">
          <Image
            src={post.imageUrl || `/placeholder.svg?height=300&width=600&text=Post${post.id}`}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-2 text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm">{post.commentCount || 0} comments</span>
      </CardFooter>
    </Card>
  )
}

