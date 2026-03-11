'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
}

export function StepCard({ children, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-2xl p-8 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </motion.div>
  )
}

export function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-syne font-bold text-2xl text-[#f0f2ff] mb-2 tracking-tight leading-tight">
      {children}
    </h1>
  )
}

export function StepSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#8892b0] text-sm mb-8 leading-relaxed font-dm">
      {children}
    </p>
  )
}
