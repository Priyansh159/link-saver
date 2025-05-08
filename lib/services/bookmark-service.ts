"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkSaverBot/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }

    const html = await response.text()
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1].trim() : url

    // Try to find favicon
    let favicon = null

    // Check for favicon in link tags
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    if (faviconMatch) {
      favicon = new URL(faviconMatch[1], url).href
    } else {
      // Try the default favicon location
      favicon = new URL("/favicon.ico", url).href
    }

    return { title, favicon }
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return { title: url, favicon: null }
  }
}

export async function generateSummary(url: string) {
  try {
    const response = await fetch("https://r.jina.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: [
          {
            type: "url",
            data: url,
          },
        ],
        parameters: {
          mode: "short", // could also be "long" if you prefer detailed summary
        },
      }),
    })

    if (!response.ok) {
      console.error(`Jina AI API error: ${response.statusText}`)
      throw new Error("Failed to fetch summary from Jina AI")
    }

    const data = await response.json()
    return data.outputs?.[0]?.data || "No summary available"
  } catch (error) {
    console.error("Error generating summary:", error)
    return `This is a summary of the content at ${url}.`
  }
}

export async function saveBookmark(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const url = formData.get("url") as string

  if (!url) {
    throw new Error("URL is required")
  }

  try {
    // Fetch metadata
    const { title, favicon } = await fetchMetadata(url)

    // Generate summary
    const summary = await generateSummary(url)

    // Save to database
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: user.id,
        url,
        title,
        favicon,
        summary,
      })
      .select()

    if (error) {
      throw error
    }

    // Handle tags if provided
    const tagsString = formData.get("tags") as string
    if (tagsString) {
      const tagNames = tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      for (const tagName of tagNames) {
        // Check if tag exists
        let { data: existingTag, error: fetchTagError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .eq("user_id", user.id)
          .maybeSingle()

        if (fetchTagError) {
          console.error("Error checking for existing tag:", fetchTagError);
          continue;
        }

        // Create tag if it doesn't exist
        if (!existingTag) {
          const { data: newTag, error: tagError } = await supabase
            .from("tags")
            .insert({
              name: tagName,
              user_id: user.id,
            })
            .select()
            .single()

          if (tagError) {
            console.error("Error creating tag:", tagError)
            continue
          }

          existingTag = newTag
        }

        // Associate tag with bookmark
        await supabase.from("bookmark_tags").insert({
          bookmark_id: data[0].id,
          tag_id: existingTag.id,
        })
      }
    }

    revalidatePath("/dashboard")
    return { success: true, bookmark: data[0] }
  } catch (error) {
    console.error("Error saving bookmark:", error)
    return { success: false, error: "Failed to save bookmark" }
  }
}

export async function deleteBookmark(id: string) {
  const supabase = createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  try {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      throw error
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return { success: false, error: "Failed to delete bookmark" }
  }
}

export async function getBookmarks() {
  const supabase = createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { bookmarks: [] }
  }

  try {
    const { data: bookmarks, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    // Get tags for each bookmark
    const bookmarksWithTags = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const { data: bookmarkTags, error: tagsError } = await supabase
          .from("bookmark_tags")
          .select("tags(id, name)")
          .eq("bookmark_id", bookmark.id)

        if (tagsError) {
          console.error("Error fetching tags:", tagsError)
          return { ...bookmark, tags: [] }
        }

        const tags = bookmarkTags.map((bt: any) => bt.tags)
        return { ...bookmark, tags }
      }),
    )

    return { bookmarks: bookmarksWithTags }
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return { bookmarks: [] }
  }
}

export async function getTags() {
  const supabase = createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { tags: [] }
  }

  try {
    const { data: tags, error } = await supabase.from("tags").select("*").eq("user_id", user.id).order("name")

    if (error) {
      throw error
    }

    return { tags }
  } catch (error) {
    console.error("Error fetching tags:", error)
    return { tags: [] }
  }
}
