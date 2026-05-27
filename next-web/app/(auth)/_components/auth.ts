import { z } from "zod"

export const signinSchema = z.object({
  username: z
    .string()
    .min(1, "Email or username is required")
    .max(50, "Too long"),
  password: z.string().min(1, "Password is required").max(128, "Too long"),
})

export type SigninInput = z.infer<typeof signinSchema>

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    displayName: z
      .string()
      .max(100, "Display name must be at most 100 characters")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignupInput = z.infer<typeof signupSchema>
