"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Eye, EyeOff } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { sAdminloginAction } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { loginFormSchema, LoginFormValues } from "@/schema"

export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit"
    })

    const { executeAsync } = useAction(sAdminloginAction, {
        onError: ({ error }) => {
            if (error.validationErrors?._errors?.[0]) {
                form.setError("email", {
                    type: "manual",
                    message: error.validationErrors?._errors?.[0]
                })
                form.setError("password", {
                    type: "manual",
                    message: error.validationErrors?._errors?.[0]
                })
            }
        },
        onSuccess: ({ data }) => {
            console.log("data", data.redirectUrl);
            router.push(data.redirectUrl);
        }
    })
    
    return (
        <Form {...form}>
            <form
                // action={}
                onSubmit={(e) => form.handleSubmit((values: LoginFormValues) => executeAsync(values))(e)}
                className="space-y-6"
            >
                {/* Email Field */}
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
                                    name="email" // important for server action
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
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
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <CardFooter className="flex-col gap-2 mt-6 p-0">
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </CardFooter>
            </form>
        </Form>
    )
}
