"use client"

import { useState } from "react"
import { deleteBookmark } from "@/lib/services/bookmark-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"

interface Tag {
  id: string
  name: string
}

interface BookmarkCardProps {
  id: string
  url: string
  title: string
  favicon: string | null
  summary: string | null
  tags: Tag[]
}

export default function BookmarkCard({ id, url, title, favicon, summary, tags }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteBookmark(id)

      if (!result.success) {
        setError(result.error || "Failed to delete bookmark")
      }
    } catch (err: any) {
      console.error("Error deleting bookmark:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const domain = new URL(url).hostname.replace("www.", "")

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {favicon ? (
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src={favicon || "/placeholder.svg"}
                  alt={`${domain} favicon`}
                  width={24}
                  height={24}
                  className="object-contain"
                  onError={(e) => {
                    // If favicon fails to load, replace with a default
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=24&width=24"
                  }}
                />
              </div>
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
            )}
            <CardTitle className="text-lg truncate">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs">{domain}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {summary ? (
          <p className="text-sm text-gray-600 line-clamp-4">{summary}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No summary available</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit
          </a>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
        </Button>
      </CardFooter>
      {error && <p className="text-xs text-red-500 px-4 pb-2">{error}</p>}
    </Card>
  )
}
