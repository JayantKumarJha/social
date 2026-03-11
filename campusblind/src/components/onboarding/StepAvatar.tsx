'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { generateAvatarName } from '@/lib/avatar'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function StepAvatar() {
  const router = useRouter()
  const store = useOnboardingStore()
  const [saving, setSaving] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const avatar = store.avatarName
    ? { name: store.avatarName, emoji: store.avatarEmoji }
    : null

  useEffect(() => {
    async function generate() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const generated = generateAvatarName(user.id)
      store.setAvatar(generated.name, generated.emoji)
      setTimeout(() => setRevealed(true), 400)
    }
    generate()
  }, [])

  async function handleFinish() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upsert profile in Supabase
      const { error } = await supabase.from('profiles').upsert({
        id:           user.id,
        email:        store.email,
        user_type:    store.userType,
        institution:  store.institution,
        field:        store.field,
        year:         store.year || null,
        role:         store.role || null,
        interests:    store.interests,
        avatar_name:  store.avatarName,
        avatar_emoji: store.avatarEmoji,
        // Seed initial vector (simple 0-1 scores per interest)
        vector_seed:  JSON.stringify(
          store.interests.reduce((acc, i) => ({ ...acc, [i]: 0.7 }), {})
        ),
        onboarded_at: new Date().toISOString(),
      })
      if (error) throw error

      toast.success('Profile created! Welcome to CampusBlind 🎉')
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
        This is your avatar — a persistent, pseudonymous identity tied to your account but never to your name. You'll use it to post anonymously.
      </StepSubtitle>

      {/* Avatar reveal */}
      <div className="flex flex-col items-center py-6 mb-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={revealed ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="relative mb-6"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', transform: 'scale(1.5)' }} />

          <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl relative z-10"
            style={{
              background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
              boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)',
            }}>
            {avatar?.emoji ?? '🎭'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center"
        >
          <div className="font-syne font-bold text-2xl text-[#f0f2ff] mb-1 tracking-tight">
            {avatar?.name ?? '…'}
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
          ['🔒', 'Your avatar is cryptographically linked to your verified email — but never publicly.'],
          ['♻️', 'Same avatar, every time — you build reputation without revealing identity.'],
          ['🌐', 'Switch between your public profile and avatar with one tap.'],
        ].map(([icon, text]) => (
          <div key={text} className="flex gap-3 items-start">
            <span className="text-base mt-0.5">{icon}</span>
            <p className="text-xs text-[#8892b0] leading-relaxed">{text}</p>
          </div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="rounded-xl p-4 mb-6 grid grid-cols-2 gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {[
          ['🎓', store.userType === 'professional' ? '💼' : '🎓', store.institution],
          ['📚', '📚', store.field],
        ].map(([_, icon, val]) => val ? (
          <div key={val} className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <span className="text-xs text-[#8892b0] truncate">{val}</span>
          </div>
        ) : null)}
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
