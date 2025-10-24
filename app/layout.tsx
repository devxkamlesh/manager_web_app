import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/settings/theme-provider'
import { Toaster } from '@/components/ui/feedback/toaster'
import { SupabaseAuthProvider } from '@/components/auth/supabase-auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevFlow - Developer Productivity Suite',
  description: 'A productivity suite designed specifically for developers and students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('devflow-theme-storage');
                if (stored) {
                  const { state } = JSON.parse(stored);
                  const color = state?.color || 'default';
                  document.documentElement.classList.add('theme-' + color);
                } else {
                  // Default to white theme and light mode
                  document.documentElement.classList.add('theme-default');
                }
              } catch (e) {
                document.documentElement.classList.add('theme-default');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            {children}
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}