import Image from "next/image"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserCardProps {
  user: User
  rank?: number
}

export default function UserCard({ user, rank }: UserCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 to-secondary/20">
          {rank && <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">#{rank}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 -mt-16 text-center">
        <div className="mx-auto h-24 w-24 rounded-full border-4 border-background overflow-hidden">
          <Image
            src={user.avatarUrl || "/placeholder.svg?height=96&width=96"}
            alt={user.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="mt-2 font-semibold text-lg">{user.name}</h3>
        <p className="text-sm text-muted-foreground">
          @{user.username || user.name.toLowerCase().replace(/\s+/g, ".")}
        </p>
        <div className="mt-3 flex justify-center">
          <Badge variant="outline" className="px-3 py-1">
            {user.postCount || 0} Posts
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

