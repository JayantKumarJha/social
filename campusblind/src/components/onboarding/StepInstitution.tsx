'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/store/onboarding'
import { StepCard, StepTitle, StepSubtitle } from './StepCard'
import toast from 'react-hot-toast'

// Sample colleges — in production pull from DB
const COLLEGES = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'Delhi University', 'Jadavpur University',
  'IIIT Hyderabad', 'Manipal University', 'Anna University', 'Pune University',
]
const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS', 'Wipro',
  'Razorpay', 'Zepto', 'Swiggy', 'Zomato', 'Paytm', 'HDFC Bank', 'Accenture',
]

export function StepInstitution() {
  const { userType, institution, setInstitution, nextStep, prevStep } = useOnboardingStore()
  const [query, setQuery] = useState(institution)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const list   = userType === 'professional' ? COMPANIES : COLLEGES
  const filtered = query.length > 1
    ? list.filter(n => n.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  function select(name: string) {
    setQuery(name)
    setInstitution(name, userType === 'professional' ? 'company' : 'college')
    setShowSuggestions(false)
  }

  function handleContinue() {
    if (!query.trim()) { toast.error('Enter your institution name'); return }
    setInstitution(query.trim(), userType === 'professional' ? 'company' : 'college')
    nextStep()
  }

  const isStudent = userType !== 'professional'

  return (
    <StepCard>
      <StepTitle>{isStudent ? 'Which college are you from?' : 'Where do you work?'}</StepTitle>
      <StepSubtitle>
        {isStudent
          ? 'Your college is used to connect you with peers and auto-group your content.'
          : 'Your company helps us route professional content to the right industry clusters.'}
      </StepSubtitle>

      {/* Search */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        >
          <span className="text-lg">{isStudent ? '🎓' : '🏢'}</span>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
            placeholder={isStudent ? 'Search your college…' : 'Search your company…'}
            className="flex-1 bg-transparent text-sm text-[#f0f2ff] placeholder-[#4a5272] outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowSuggestions(false) }}
              className="text-[#4a5272] hover:text-[#8892b0] text-xs">✕</button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-hidden z-20"
            style={{ background: '#111527', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {filtered.map(name => (
              <button
                key={name}
                onMouseDown={() => select(name)}
                className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors hover:bg-white/5"
                style={{ color: '#f0f2ff' }}
              >
                <span>{isStudent ? '🎓' : '🏢'}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick picks */}
      <div className="mb-6">
        <p className="text-xs text-[#4a5272] mb-3 font-medium tracking-wide uppercase">Popular</p>
        <div className="flex flex-wrap gap-2">
          {list.slice(0, 6).map(name => (
            <button
              key={name}
              onClick={() => select(name)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: query === name ? 'rgba(37,99,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${query === name ? 'rgba(37,99,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: query === name ? '#7eb3ff' : '#8892b0',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Not listed note */}
      <div className="rounded-xl p-3 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-[#8892b0] leading-relaxed">
          🔍 Not seeing your {isStudent ? 'college' : 'company'}? Type the full name — it'll be added to our database and verified.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep}
          className="px-5 py-3.5 rounded-xl text-sm text-[#8892b0] transition-all duration-200 hover:text-[#f0f2ff] hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          ←
        </button>
        <button onClick={handleContinue}
          disabled={!query.trim()}
          className="flex-1 py-3.5 rounded-xl font-syne font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #2563ff, #1a44cc)', boxShadow: '0 8px 30px rgba(37,99,255,0.25)' }}>
          Continue →
        </button>
      </div>
    </StepCard>
  )
}
