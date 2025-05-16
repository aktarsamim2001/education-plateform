import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AppProviders from "@/providers/app-providers"
import RouteTransition from "@/components/route-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stock Market Education Platform",
  description: "Learn stock market trading and investing with our comprehensive courses and webinars.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppProviders>
            <RouteTransition />
            {children}
            <Toaster />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
