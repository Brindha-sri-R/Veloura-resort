import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Veloura Resort — A quieter kind of coast",
  description:
    "A considered coastal escape shaped by sea air, slow mornings, and the warmth of the Mediterranean.",
  applicationName: "Veloura Resort",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e9",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
