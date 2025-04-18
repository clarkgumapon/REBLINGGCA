import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#151c2c]">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
          <Dumbbell className="h-6 w-6" />
          <span className="font-bold">Niel's Fitness</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="mt-6 text-center text-white">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}
