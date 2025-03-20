import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Media Analytics | AffordMed",
  description: "A React based Social Media Analytics Frontend Web Application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
            <footer className="border-t py-4">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="text-primary text-2xl font-bold">
                      AFFORDMED<span className="text-xs align-top">®</span>
                    </div>
                    <div className="ml-2 text-secondary italic text-sm">Technology, Innovation & Affordability</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA.</p>
                    <p>Phone: 91-40-27117068/27116133, Web: www.affordmed.com</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'