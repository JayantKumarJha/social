'use client'

import { useState, useRef, useEffect } from 'react'
import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function StepVerify() {
  const { email, prevStep, nextStep } = useOnboardingStore()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
    const timer = setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
    if (next.every(d => d !== '') ) {
      verifyOtp(next.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  async function verifyOtp(code: string) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })
      if (error) throw error
      toast.success('Email verified!')
      nextStep()
    } catch (err: any) {
      toast.error('Invalid OTP — try again')
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function resend() {
    if (resendCooldown > 0) return
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) {
      setResendCooldown(30)
      toast.success('New OTP sent!')
    }
  }

  return (
    <StepCard>
      <StepTitle>Check your inbox.</StepTitle>
      <StepSubtitle>
        We sent a 6-digit code to <span className="text-[#f0f2ff] font-medium">{email}</span>. Enter it below to verify your identity.
      </StepSubtitle>

      {/* OTP inputs */}
      <div className="flex gap-3 justify-center mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={loading}
            className="w-12 h-14 text-center text-xl font-syne font-bold rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
            style={{
              background: digit ? 'rgba(37,99,255,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${digit ? 'rgba(37,99,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: '#f0f2ff',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(37,99,255,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = digit ? 'rgba(37,99,255,0.5)' : 'rgba(255,255,255,0.1)'}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-sm text-[#8892b0]">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(37,99,255,0.3)', borderTopColor: '#2563ff' }} />
            Verifying…
          </div>
        </div>
      )}

      {/* Resend */}
      <div className="text-center mb-6">
        <button
          onClick={resend}
          disabled={resendCooldown > 0}
          className="text-sm transition-colors disabled:cursor-not-allowed"
          style={{ color: resendCooldown > 0 ? '#4a5272' : '#8892b0' }}
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : 'Resend code'}
        </button>
      </div>

      <button
        onClick={prevStep}
        className="w-full py-3 rounded-xl text-sm text-[#8892b0] transition-all duration-200 hover:text-[#f0f2ff] hover:bg-white/5"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        ← Back
      </button>
    </StepCard>
  )
}
