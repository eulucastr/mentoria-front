import { LoginForm } from "@/components/molecules/login-form"
import Logo from '@/assets/logo.svg?react'

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          Mentoria
          <div className="flex size-6 items-center justify-center rounded-md">
            <Logo className="size-7!" />
          </div>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
