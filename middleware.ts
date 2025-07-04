import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not signed in and the current path is not / or /login or /signup
  // redirect the user to /login
  if (
    !session &&
    !req.nextUrl.pathname.startsWith("/login") &&
    !req.nextUrl.pathname.startsWith("/signup") &&
    !req.nextUrl.pathname.startsWith("/auth/") &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
