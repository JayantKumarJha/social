'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { generateAvatarName } from '@/lib/avatar'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function StepAvatar() {
  const router = useRouter()
  const { user } = useUser()
  const store = useOnboardingStore()
  const [saving, setSaving] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!user) return
    const generated = generateAvatarName(user.id)
    store.setAvatar(generated.name, generated.emoji)
    setTimeout(() => setRevealed(true), 400)
  }, [user])

  async function handleFinish() {
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:           user.id,
          email:        user.emailAddresses[0]?.emailAddress ?? '',
          user_type:    store.userType,
          institution:  store.institution,
          field:        store.field,
          year:         store.year || null,
          role:         store.role || null,
          interests:    store.interests,
          avatar_name:  store.avatarName,
          avatar_emoji: store.avatarEmoji,
        }),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      toast.success('Welcome to CampusBlind! 🎉')
      router.push('/feed')
    } catch (err: any) {
      toast.error(err.message ?? 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <StepCard>
      <StepTitle>Meet your anonymous self.</StepTitle>
      <StepSubtitle>
        Your avatar is a persistent pseudonymous identity — tied to your account but never to your name.
      </StepSubtitle>

      {/* Avatar reveal */}
      <div className="flex flex-col items-center py-6 mb-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={revealed ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', transform: 'scale(1.5)' }} />
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl relative z-10"
            style={{
              background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
              boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)',
            }}>
            {store.avatarEmoji ?? '🎭'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center"
        >
          <div className="font-syne font-bold text-2xl text-[#f0f2ff] mb-2 tracking-tight">
            {store.avatarName ?? '…'}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c084fc' }}>
            🎭 Anonymous Identity · Verified
          </div>
        </motion.div>
      </div>

      {/* What this means */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="rounded-xl p-4 mb-6 space-y-3"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        {[
          ['🔒', 'Your avatar is cryptographically linked to your verified account — but never publicly.'],
          ['♻️', 'Same avatar every time — build reputation without revealing identity.'],
          ['🌐', 'Switch between your public profile and avatar with one tap.'],
        ].map(([icon, text]) => (
          <div key={String(text)} className="flex gap-3 items-start">
            <span className="text-base mt-0.5">{icon}</span>
            <p className="text-xs text-[#8892b0] leading-relaxed">{text}</p>
          </div>
        ))}
      </motion.div>

      <button
        onClick={handleFinish}
        disabled={saving || !revealed}
        className="w-full py-4 rounded-xl font-syne font-bold text-base text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563ff)',
          boxShadow: '0 8px 30px rgba(124,58,237,0.3)',
        }}
      >
        {saving ? 'Setting up your space…' : 'Enter CampusBlind →'}
      </button>
    </StepCard>
  )
}
