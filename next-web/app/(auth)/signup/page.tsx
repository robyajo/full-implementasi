import { Metadata } from "next"
import { SignupForm } from "../_components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "...",
}

export default function SignupPage() {
  return <SignupForm />
}
