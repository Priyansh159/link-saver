"use client"

import { useState, useEffect } from "react"
import { getTags } from "@/lib/services/bookmark-service"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Tag {
  id: string
  name: string
}

interface TagFilterProps {
  selectedTag: string | null
  onSelectTag: (tagId: string | null) => void
}

export default function TagFilter({ selectedTag, onSelectTag }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      try {
        const { tags: fetchedTags } = await getTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  if (loading) {
    return <div className="py-2">Loading tags...</div>
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Filter by tag</h3>
      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex gap-2">
          <Button variant={selectedTag === null ? "default" : "outline"} size="sm" onClick={() => onSelectTag(null)}>
            All
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTag === tag.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectTag(tag.id)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
