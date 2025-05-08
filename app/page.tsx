import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookmarkIcon className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl">LinkSaver</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Save and Summarize Your Links</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bookmark important websites and get AI-powered summaries automatically. Never lose track of valuable
                content again.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg" className="mr-4">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookmarkIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Save Links</h3>
                <p className="text-gray-600">
                  Quickly save any URL with a single click. We'll automatically fetch the title and favicon.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Auto-Summarize</h3>
                <p className="text-gray-600">
                  Our AI automatically generates concise summaries of the content so you know what's inside.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Organize with Tags</h3>
                <p className="text-gray-600">
                  Add tags to your bookmarks for easy filtering and organization of your saved content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Link Saver + Auto-Summary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
