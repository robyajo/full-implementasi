"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { SigninInput, signinSchema } from "./auth"
import { toast } from "sonner"
import Link from "next/link"
import ButtonGoogle from "./button-google"

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  })

  async function onSubmit(data: SigninInput) {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("root", { message: result.error })
        return
      }

      toast.success("Welcome back!")
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("root", { message: "An unexpected error occurred" })
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </FieldDescription>

            {errors.root && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 font-mono text-xs text-destructive">
                {errors.root.message}
              </div>
            )}
          </div>
          <Field>
            <FieldLabel htmlFor="username"> Email or Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="m@example.com"
              required
              {...register("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="font-mono text-[10px] text-destructive">
                {errors.username.message}
              </span>
            )}
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor="password"
                className="font-mono text-[10px] font-bold tracking-wider text-white/50 uppercase"
              >
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="font-mono text-[10px] text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="font-mono text-[10px] text-destructive">
                {errors.password.message}
              </span>
            )}
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4">
            <ButtonGoogle />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
