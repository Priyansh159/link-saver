"use client"

import { useState, useEffect } from "react"
import { getBookmarks } from "@/lib/services/bookmark-service"
import BookmarkForm from "@/components/bookmarks/bookmark-form"
import BookmarkGrid from "@/components/bookmarks/bookmark-grid"
import TagFilter from "@/components/bookmarks/tag-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true)
      try {
        const { bookmarks: fetchedBookmarks } = await getBookmarks()
        setBookmarks(fetchedBookmarks)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Link Saver + Auto-Summary</h1>

      <Tabs defaultValue="bookmarks" className="mb-6">
        <TabsList>
          <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>
        <TabsContent value="bookmarks" className="space-y-4">
          <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading bookmarks...</p>
            </div>
          ) : (
            <BookmarkGrid bookmarks={bookmarks} selectedTag={selectedTag} />
          )}
        </TabsContent>
        <TabsContent value="add">
          <BookmarkForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
