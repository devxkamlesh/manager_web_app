"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Skeleton } from "@/components/ui/feedback/skeleton"

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  rows?: number
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, title = "Loading...", description, rows = 3, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} {...props}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>{title}</span>
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
)
LoadingState.displayName = "LoadingState"

export { LoadingState }