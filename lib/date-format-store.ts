import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type DateFormat = 'us' | 'indian' | 'uk' | 'iso'
export type TimeZone = 'UTC' | 'Asia/Kolkata' | 'America/New_York' | 'Europe/London'
export type DateStyle = 'full' | 'short' | 'medium'

interface DateFormatState {
  format: DateFormat
  timezone: TimeZone
  defaultStyle: DateStyle
  setFormat: (format: DateFormat) => void
  setTimezone: (timezone: TimeZone) => void
  setDefaultStyle: (style: DateStyle) => void
  formatDate: (date: Date, style?: DateStyle) => string
  getCurrentDate: () => Date
}

export const useDateFormatStore = create<DateFormatState>()(
  persist(
    (set, get) => ({
      format: 'indian',
      timezone: 'Asia/Kolkata',
      defaultStyle: 'full',
      
      setFormat: (format) => set({ format }),
      setTimezone: (timezone) => set({ timezone }),
      setDefaultStyle: (style) => set({ defaultStyle: style }),
      
      getCurrentDate: () => {
        const { timezone } = get()
        // Get current date in the user's timezone
        const now = new Date()
        return new Date(now.toLocaleString("en-US", { timeZone: timezone }))
      },
      
      formatDate: (date: Date, style?: DateStyle) => {
        const { format, timezone, defaultStyle } = get()
        const actualStyle = style || defaultStyle
        
        const formatOptions: Record<DateFormat, Record<string, Intl.DateTimeFormatOptions>> = {
          indian: {
            full: {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: timezone
            },
            medium: {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: timezone
            },
            short: {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              timeZone: timezone
            }
          },
          us: {
            full: {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: timezone
            },
            medium: {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              timeZone: timezone
            },
            short: {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: timezone
            }
          },
          uk: {
            full: {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: timezone
            },
            medium: {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: timezone
            },
            short: {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              timeZone: timezone
            }
          },
          iso: {
            full: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: timezone
            },
            medium: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: timezone
            },
            short: {
              month: '2-digit',
              day: '2-digit',
              timeZone: timezone
            }
          }
        }
        
        const locale = format === 'indian' ? 'en-IN' : format === 'uk' ? 'en-GB' : 'en-US'
        const options = formatOptions[format][actualStyle]
        
        try {
          return date.toLocaleDateString(locale, options)
        } catch (error) {
          // Fallback to simple format if there's an error
          return date.toLocaleDateString('en-US', { 
            weekday: actualStyle === 'short' ? 'short' : 'long',
            day: 'numeric',
            month: actualStyle === 'short' ? 'short' : 'long',
            year: actualStyle === 'short' ? undefined : 'numeric',
            timeZone: timezone
          })
        }
      }
    }),
    {
      name: 'devflow-date-format-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Helper function to get current date in user's preferred format
export const getCurrentDateFormatted = (style: 'full' | 'short' | 'medium' = 'medium') => {
  const store = useDateFormatStore.getState()
  return store.formatDate(new Date(), style)
}

// Date format examples for settings UI
export const getDateFormatExamples = () => {
  const now = new Date()
  
  return {
    indian: {
      name: 'Indian (DD/MM/YYYY)',
      example: now.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      }),
      short: now.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        timeZone: 'Asia/Kolkata'
      })
    },
    us: {
      name: 'US (MM/DD/YYYY)',
      example: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        timeZone: 'America/New_York'
      }),
      short: now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        timeZone: 'America/New_York'
      })
    },
    uk: {
      name: 'UK (DD/MM/YYYY)',
      example: now.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Europe/London'
      }),
      short: now.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        timeZone: 'Europe/London'
      })
    },
    iso: {
      name: 'ISO (YYYY-MM-DD)',
      example: now.toISOString().split('T')[0],
      short: now.toLocaleDateString('en-CA', { 
        month: '2-digit', 
        day: '2-digit'
      })
    }
  }
}