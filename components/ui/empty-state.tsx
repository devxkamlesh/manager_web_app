"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("border-dashed border-2", className)} {...props}>
        <CardContent className="flex flex-col items-center justify-center p-16 text-center">
          {icon && (
            <div className="mb-6 text-6xl opacity-50">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-muted-foreground mb-6 max-w-md">
              {description}
            </p>
          )}
          {action && (
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }