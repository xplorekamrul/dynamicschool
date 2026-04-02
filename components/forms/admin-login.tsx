"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { useAction } from "next-safe-action/hooks"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"

import { loginFormSchema, type LoginFormValues } from "@/schema"
import { adminLoginAction } from "@/actions/auth-admin"

export function AdminLoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  })

  const { executeAsync, status } = useAction(adminLoginAction, {
    onError: ({ error }) => {
      // Spread a single top-level error to both fields for convenience
      const msg = error.validationErrors?._errors?.[0] ?? "Invalid credentials"
      form.setError("email", { type: "manual", message: msg })
      form.setError("password", { type: "manual", message: msg })
    },
    onSuccess: ({ data }) => {
      router.push(data.redirectUrl)
    },
  })

  const isSubmitting = status === "executing"

  return (
    <Form {...form}>
      <form
        onSubmit={(e) =>
          form.handleSubmit((values) => executeAsync(values))(e)
        }
        className="space-y-6"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...field}
                  name="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    {...field}
                    name="password"
                    placeholder="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="cursor-pointer absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CardFooter className="flex-col gap-2 mt-6 p-0">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
