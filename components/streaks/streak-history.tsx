"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  TrendingUp,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakHistoryProps {
  streakId: string
  streakName: string
  completedDates: string[] // Array of ISO date strings
}

export function StreakHistory({ streakId, streakName, completedDates }: StreakHistoryProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return completedDates.includes(dateString)
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8 w-8" />
      )
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isCompleted = isDateCompleted(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isFuture = date > new Date()
      
      days.push(
        <div
          key={day}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
            isCompleted && "bg-green-500 text-white shadow-md",
            !isCompleted && !isFuture && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
            isFuture && "bg-muted text-muted-foreground",
            isToday && "ring-2 ring-primary ring-offset-2",
            !isCompleted && !isFuture && "hover:bg-red-200 dark:hover:bg-red-900/30"
          )}
        >
          {day}
        </div>
      )
    }
    
    return days
  }
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const completedThisMonth = completedDates.filter(dateString => {
    const date = new Date(dateString)
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear()
  }).length
  
  const daysInCurrentMonth = getDaysInMonth(currentDate)
  const completionRate = Math.round((completedThisMonth / daysInCurrentMonth) * 100)
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {streakName} History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 dark:bg-red-900/20 rounded-full"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <span>Future</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-xs font-medium text-muted-foreground text-center">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
        
        {/* Month Stats */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm">
            <span className="font-medium">{completedThisMonth}</span>
            <span className="text-muted-foreground"> / {daysInCurrentMonth} days completed</span>
          </div>
          <Badge variant={completionRate >= 80 ? "default" : completionRate >= 60 ? "secondary" : "destructive"}>
            {completionRate}% completion
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}