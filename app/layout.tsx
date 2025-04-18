import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import LoadingSpinner from "@/components/loading-spinner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Niel's Fitness Gym",
  description: "Your premier fitness destination",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
