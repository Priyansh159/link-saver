import BookmarkCard from "./bookmark-card"

interface Tag {
  id: string
  name: string
}

interface Bookmark {
  id: string
  url: string
  title: string
  favicon: string | null
  summary: string | null
  tags: Tag[]
}

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  selectedTag: string | null
}

export default function BookmarkGrid({ bookmarks, selectedTag }: BookmarkGridProps) {
  // Filter bookmarks by selected tag if any
  const filteredBookmarks = selectedTag
    ? bookmarks.filter((bookmark) => bookmark.tags.some((tag) => tag.id === selectedTag))
    : bookmarks

  if (filteredBookmarks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {bookmarks.length === 0 ? "You haven't saved any bookmarks yet." : "No bookmarks match the selected tag."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredBookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          id={bookmark.id}
          url={bookmark.url}
          title={bookmark.title}
          favicon={bookmark.favicon}
          summary={bookmark.summary}
          tags={bookmark.tags}
        />
      ))}
    </div>
  )
}
