"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new login page
    router.replace("/auth/login")
  }, [router])

  return null
}