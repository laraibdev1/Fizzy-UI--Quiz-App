import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Interactive Quiz App",
  description: "Test your knowledge with our interactive quizzes!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

