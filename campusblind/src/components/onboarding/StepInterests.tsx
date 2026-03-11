'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { INTERESTS } from '@/lib/avatar'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export function StepInterests() {
  const { interests, toggleInterest, nextStep, prevStep } = useOnboardingStore()

  function handleContinue() {
    if (interests.length < 2) { toast.error('Pick at least 2 interests'); return }
    nextStep()
  }

  return (
    <StepCard>
      <StepTitle>What matters to you?</StepTitle>
      <StepSubtitle>
        Pick up to 5 interests. These seed your N-dimensional vector — your feed gets smarter from day 1.
      </StepSubtitle>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {INTERESTS.map((item, i) => {
          const selected = interests.includes(item.value)
          return (
            <motion.button
              key={item.value}
              onClick={() => toggleInterest(item.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl p-3.5 text-left flex items-center gap-3 transition-all duration-200"
              style={{
                background: selected ? 'rgba(37,99,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected ? 'rgba(37,99,255,0.45)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium"
                style={{ color: selected ? '#7eb3ff' : '#8892b0' }}>
                {item.label}
              </span>
              {selected && (
                <span className="ml-auto text-xs text-blue-400">✓</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Count indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-6 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i < interests.length ? '#2563ff' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <span className="text-xs text-[#4a5272]">{interests.length}/5 selected</span>
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep}
          className="px-5 py-3.5 rounded-xl text-sm text-[#8892b0] transition-all duration-200 hover:text-[#f0f2ff] hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>←</button>
        <button onClick={handleContinue}
          disabled={interests.length < 2}
          className="flex-1 py-3.5 rounded-xl font-syne font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #2563ff, #1a44cc)', boxShadow: '0 8px 30px rgba(37,99,255,0.25)' }}>
          Continue →
        </button>
      </div>
    </StepCard>
  )
}
