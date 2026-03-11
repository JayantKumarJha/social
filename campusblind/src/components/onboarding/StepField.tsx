'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import { FIELDS, YEARS } from '@/lib/avatar'
import toast from 'react-hot-toast'

const ROLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Designer',
  'Marketing Manager', 'Sales', 'Finance Analyst', 'HR', 'Founder / CXO',
  'Consultant', 'Researcher', 'Other',
]

export function StepField() {
  const { userType, field, year, role, setField, setYear, setRole, nextStep, prevStep } = useOnboardingStore()
  const isStudent = userType !== 'professional'

  function handleContinue() {
    if (!field) { toast.error('Pick your field'); return }
    if (isStudent && !year) { toast.error('Select your year'); return }
    if (!isStudent && !role) { toast.error('Select your role'); return }
    nextStep()
  }

  return (
    <StepCard>
      <StepTitle>Tell us about yourself.</StepTitle>
      <StepSubtitle>
        This seeds your initial interest vector — the more accurate, the smarter your feed on day 1.
      </StepSubtitle>

      {/* Field grid */}
      <p className="text-xs text-[#4a5272] font-medium tracking-wide uppercase mb-3">Your field</p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {FIELDS.map(f => (
          <button
            key={f.value}
            onClick={() => setField(f.value)}
            className="rounded-xl p-3 text-left transition-all duration-200 flex flex-col gap-1.5"
            style={{
              background: field === f.value ? 'rgba(37,99,255,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${field === f.value ? 'rgba(37,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span className="text-lg">{f.icon}</span>
            <span className="text-xs font-medium leading-tight"
              style={{ color: field === f.value ? '#7eb3ff' : '#8892b0' }}>
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {/* Year (students) or Role (professionals) */}
      {isStudent ? (
        <>
          <p className="text-xs text-[#4a5272] font-medium tracking-wide uppercase mb-3">Year of study</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {YEARS.map(y => (
              <button key={y.value} onClick={() => setYear(y.value)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: year === y.value ? 'rgba(37,99,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${year === y.value ? 'rgba(37,99,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  color: year === y.value ? '#7eb3ff' : '#8892b0',
                }}>
                {y.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-[#4a5272] font-medium tracking-wide uppercase mb-3">Your role</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ROLES.map(r => (
              <button key={r} onClick={() => setRole(r)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  background: role === r ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${role === r ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  color: role === r ? '#c084fc' : '#8892b0',
                }}>
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button onClick={prevStep}
          className="px-5 py-3.5 rounded-xl text-sm text-[#8892b0] transition-all duration-200 hover:text-[#f0f2ff] hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>←</button>
        <button onClick={handleContinue}
          disabled={!field || (isStudent ? !year : !role)}
          className="flex-1 py-3.5 rounded-xl font-syne font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #2563ff, #1a44cc)', boxShadow: '0 8px 30px rgba(37,99,255,0.25)' }}>
          Continue →
        </button>
      </div>
    </StepCard>
  )
}
