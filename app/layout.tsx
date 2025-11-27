import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ConditionalLayout } from '@/components/conditional-layout'
import { GamificationProvider } from '@/components/gamification/gamification-provider'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'გონი - ინტერაქტიული სწავლების პლატფორმა',
  description: 'დაეუფლე რთულ კონცეფციებს ინტერაქტიული ამოცანების გადაჭრისა და მართული აღმოჩენის გზით',
  keywords: ['სწავლა', 'განათლება', 'მათემატიკა', 'მეცნიერება', 'ინტერაქტიული'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        {/* KaTeX CSS for math rendering */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <GamificationProvider>
          <div className="relative flex min-h-screen flex-col">
            {/* Conditional Layout - hides header/footer on quiz pages */}
            <ConditionalLayout>{children}</ConditionalLayout>
          </div>
        </GamificationProvider>
      </body>
    </html>
  )
}
