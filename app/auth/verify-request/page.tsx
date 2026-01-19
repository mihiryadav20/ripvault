export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-muted-foreground">
          A sign in link has been sent to your email address.
          Click the link in the email to sign in to your account.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          The link expires in 24 hours.
        </p>
      </div>
    </div>
  )
}
