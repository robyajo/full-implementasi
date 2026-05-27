import { Metadata } from "next"
import { SigninForm } from "../_components/signin-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "...",
}

export default function SigninPage() {
  return <SigninForm />
}
