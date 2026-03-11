'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      // Exchange the code in the URL for a session
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        // Try to exchange code from URL hash/params
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )
        if (exchangeError) {
          console.error('Auth error:', exchangeError)
          router.push('/onboarding')
          return
        }
      }

      // Check if user has already completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/onboarding'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, onboarded_at')
        .eq('id', user.id)
        .single()

      if (profile?.onboarded_at) {
        // Already onboarded — go to feed
        router.push('/feed')
      } else {
        // New user — continue onboarding from step 3
        // (email verified, skip steps 1 & 2)
        router.push('/onboarding?step=3')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center gap-4">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,255,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(37,99,255,0.3)', borderTopColor: '#2563ff' }} />

        <div>
          <p className="font-syne font-bold text-lg text-[#f0f2ff] mb-1">Verifying your email…</p>
          <p className="text-sm text-[#4a5272]">Just a second, setting up your account</p>
        </div>
      </div>
    </div>
  )
}
