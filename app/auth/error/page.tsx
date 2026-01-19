"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An error occurred during authentication.",
  }

  const message = errorMessages[error ?? "Default"] ?? errorMessages.Default

  return (
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-destructive">
        Authentication Error
      </h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button asChild>
        <Link href="/login">Try Again</Link>
      </Button>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
