'use client'

import { useOnboardingStore } from '@/store/onboarding'
import { StepEmail }       from '@/components/onboarding/StepEmail'
import { StepVerify }      from '@/components/onboarding/StepVerify'
import { StepInstitution } from '@/components/onboarding/StepInstitution'
import { StepField }       from '@/components/onboarding/StepField'
import { StepInterests }   from '@/components/onboarding/StepInterests'
import { StepAvatar }      from '@/components/onboarding/StepAvatar'
import { ProgressBar }     from '@/components/onboarding/ProgressBar'

export default function OnboardingPage() {
  const { step, totalSteps } = useOnboardingStore()

  const steps: Record<number, React.ReactNode> = {
    1: <StepEmail />,
    2: <StepVerify />,
    3: <StepInstitution />,
    4: <StepField />,
    5: <StepInterests />,
    6: <StepAvatar />,
  }

  return (
    <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Grid bg */}
      <div className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }} />

      {/* Logo */}
      <div className="relative z-10 mb-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, #2563ff, #7c3aed)' }}>
          🎭
        </div>
        <span className="font-syne font-bold text-xl tracking-tight text-[#f0f2ff]">CampusBlind</span>
      </div>

      {/* Progress */}
      <div className="relative z-10 w-full max-w-md mb-8">
        <ProgressBar current={step} total={totalSteps} />
      </div>

      {/* Step card */}
      <div className="relative z-10 w-full max-w-md">
        {steps[step]}
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-10 text-xs text-[#4a5272] text-center">
        By continuing you agree to our{' '}
        <a href="#" className="text-[#8892b0] hover:text-[#f0f2ff] transition-colors">Terms</a>
        {' & '}
        <a href="#" className="text-[#8892b0] hover:text-[#f0f2ff] transition-colors">Privacy Policy</a>
      </p>
    </div>
  )
}
