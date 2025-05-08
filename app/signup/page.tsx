import SignUpForm from "@/components/auth/signup-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm />
    </div>
  )
}
