import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'CampusBlind — One platform. Two identities.',
  description: 'The first dual-identity social network for students and professionals. Post publicly or anonymously — intelligently routed to the people who need to hear it.',
  openGraph: {
    title: 'CampusBlind',
    description: 'One platform. Two identities.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#111527',
              color: '#f0f2ff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#111527' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#111527' } },
          }}
        />
      </body>
    </html>
  )
}
