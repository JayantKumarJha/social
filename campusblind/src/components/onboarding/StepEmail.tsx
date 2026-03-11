'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function StepEmail() {
  const { email, userType, setEmail, setUserType, setOtpSent, nextStep } = useOnboardingStore()
  const [loading, setLoading] = useState(false)
  const [localEmail, setLocalEmail] = useState(email)

  const detectedType = localEmail.includes('.edu') || localEmail.includes('ac.in')
    ? 'student'
    : localEmail.includes('@') && !localEmail.includes('.edu')
      ? 'professional'
      : null

  async function handleContinue() {
    if (!localEmail || !localEmail.includes('@')) {
      toast.error('Enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: localEmail,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      setEmail(localEmail)
      setUserType(userType ?? detectedType ?? 'student')
      setOtpSent(true)
      nextStep()
      toast.success('OTP sent — check your inbox!')
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepCard>
      <StepTitle>Welcome to CampusBlind.</StepTitle>
      <StepSubtitle>
        Enter your institutional or work email. We'll verify it to build your trusted identity.
      </StepSubtitle>

      {/* User type selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { type: 'student',      label: 'Student',      icon: '🎓', hint: '.edu / ac.in' },
          { type: 'professional', label: 'Professional',  icon: '💼', hint: '.com / .org' },
        ].map(({ type, label, icon, hint }) => (
          <button
            key={type}
            onClick={() => setUserType(type as any)}
            className="rounded-xl p-4 text-left transition-all duration-200 relative overflow-hidden"
            style={{
              background: userType === type
                ? type === 'student'
                  ? 'rgba(37,99,255,0.12)'
                  : 'rgba(124,58,237,0.12)'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${userType === type
                ? type === 'student' ? 'rgba(37,99,255,0.4)' : 'rgba(124,58,237,0.4)'
                : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            {userType === type && (
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: type === 'student'
                  ? 'linear-gradient(90deg, transparent, #2563ff, transparent)'
                  : 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
            )}
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-syne font-bold text-sm text-[#f0f2ff]">{label}</div>
            <div className="text-xs text-[#4a5272] mt-1">{hint}</div>
          </button>
        ))}
      </div>

      {/* Email input */}
      <div className="relative mb-6">
        <input
          type="email"
          value={localEmail}
          onChange={(e) => {
            setLocalEmail(e.target.value)
            if (e.target.value.includes('.edu') || e.target.value.includes('ac.in')) {
              setUserType('student')
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder={userType === 'professional' ? 'you@company.com' : 'you@college.edu'}
          className="w-full rounded-xl px-4 py-3.5 text-sm text-[#f0f2ff] placeholder-[#4a5272] outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(37,99,255,0.5)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          autoComplete="email"
          autoFocus
        />
        {detectedType && localEmail.includes('@') && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
            ✓ {detectedType}
          </span>
        )}
      </div>

      {/* Info note */}
      <div className="rounded-xl p-3 mb-6 flex gap-3 items-start"
        style={{ background: 'rgba(37,99,255,0.08)', border: '1px solid rgba(37,99,255,0.15)' }}>
        <span className="text-lg mt-0.5">🔒</span>
        <p className="text-xs text-[#8892b0] leading-relaxed">
          Your email is only used for verification. It's never shown publicly and is stored encrypted. You'll post as <span className="text-[#f0f2ff]">yourself</span> or as your <span className="text-[#c084fc]">anonymous avatar</span> — never as your email.
        </p>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading || !localEmail.includes('@')}
        className="w-full py-3.5 rounded-xl font-syne font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #2563ff, #1a44cc)',
          boxShadow: '0 8px 30px rgba(37,99,255,0.3)',
        }}
      >
        {loading ? 'Sending OTP…' : 'Continue →'}
      </button>
    </StepCard>
  )
}
