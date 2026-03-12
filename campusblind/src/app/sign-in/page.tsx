import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
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

      {/* Clerk SignIn component */}
      <div className="relative z-10">
        <SignIn
          afterSignInUrl="/onboarding"
          afterSignUpUrl="/onboarding"
          appearance={{
            variables: {
              colorPrimary: '#2563ff',
              colorBackground: '#0c0f1a',
              colorInputBackground: 'rgba(255,255,255,0.05)',
              colorInputText: '#f0f2ff',
              colorText: '#f0f2ff',
              colorTextSecondary: '#8892b0',
              colorNeutral: '#8892b0',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            elements: {
              card: {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                boxShadow: 'none',
              },
              headerTitle: {
                fontFamily: 'Syne, sans-serif',
                fontWeight: '800',
                fontSize: '22px',
                color: '#f0f2ff',
              },
              headerSubtitle: { color: '#8892b0' },
              formButtonPrimary: {
                background: 'linear-gradient(135deg, #2563ff, #1a44cc)',
                boxShadow: '0 8px 30px rgba(37,99,255,0.3)',
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
              },
              footerActionLink: { color: '#7eb3ff' },
              identityPreviewText: { color: '#f0f2ff' },
              formFieldLabel: { color: '#8892b0' },
            },
          }}
        />
      </div>

      <p className="relative z-10 mt-8 text-xs text-[#4a5272] text-center">
        By continuing you agree to our{' '}
        <a href="#" className="text-[#8892b0] hover:text-[#f0f2ff] transition-colors">Terms</a>
        {' & '}
        <a href="#" className="text-[#8892b0] hover:text-[#f0f2ff] transition-colors">Privacy Policy</a>
      </p>
    </div>
  )
}
