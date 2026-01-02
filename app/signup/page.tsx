import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
          <p className="mt-2 text-muted-foreground">Create an account to access your dashboard</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
