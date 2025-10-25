import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time formatting utilities
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Get current date in Indian timezone (IST)
export function getIndianDate(): string {
  const now = new Date()
  // Create a new date object in Indian timezone
  const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
  // Format as YYYY-MM-DD
  const year = indianTime.getFullYear()
  const month = String(indianTime.getMonth() + 1).padStart(2, '0')
  const day = String(indianTime.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get current Indian time as Date object
export function getIndianDateTime(): Date {
  const now = new Date()
  return new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
}

export function formatTimeAgo(date: Date | string): string {
  // Prevent hydration mismatch by returning static text on server
  if (typeof window === 'undefined') {
    return 'Recently'
  }
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

// Streak utilities
export function getStreakEmoji(type: string | number): string {
  if (typeof type === 'number') {
    // Return emoji based on streak count
    if (type >= 30) return '🔥'
    if (type >= 7) return '⭐'
    if (type >= 3) return '💪'
    return '🌱'
  }
  
  const emojiMap: Record<string, string> = {
    coding: '💻',
    learning: '📚',
    commits: '🔥',
    problems: '🧩',
    default: '⭐'
  }
  return emojiMap[type] || emojiMap.default
}

// Task utilities
export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200',
    default: 'text-gray-600 bg-gray-50 border-gray-200'
  }
  return colorMap[priority.toLowerCase()] || colorMap.default
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    completed: 'text-green-600 bg-green-50 border-green-200',
    'in-progress': 'text-blue-600 bg-blue-50 border-blue-200',
    pending: 'text-gray-600 bg-gray-50 border-gray-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    default: 'text-gray-600 bg-gray-50 border-gray-200'
  }
  return colorMap[status.toLowerCase()] || colorMap.default
}