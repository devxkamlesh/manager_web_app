"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

const errorMessages = {
    Configuration: "There is a problem with the server configuration. Please check your OAuth settings.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    OAuthCallback: "OAuth configuration error. The redirect URI may not be properly configured.",
    Default: "An error occurred during authentication.",
}

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error") as keyof typeof errorMessages

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
                    <CardDescription>
                        {errorMessages[error] || errorMessages.Default}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/auth/login">
                            Try Again
                        </Link>
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>If the problem persists, please contact support.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function AuthError() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    )
}