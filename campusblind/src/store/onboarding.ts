import { create } from 'zustand'

export type UserType = 'student' | 'professional' | null

export interface OnboardingState {
  // Step tracking
  step: number
  totalSteps: number

  // Step 1 — email
  email: string
  userType: UserType

  // Step 2 — OTP
  otpSent: boolean

  // Step 3 — profile type & institution
  institution: string       // college or company name
  institutionType: 'college' | 'company' | null

  // Step 4 — field & role details
  field: string
  year: string              // students only
  role: string              // professionals only

  // Step 5 — interests
  interests: string[]

  // Step 6 — avatar reveal
  avatarName: string
  avatarEmoji: string

  // Actions
  setEmail: (email: string) => void
  setUserType: (t: UserType) => void
  setOtpSent: (v: boolean) => void
  setInstitution: (name: string, type: 'college' | 'company') => void
  setField: (f: string) => void
  setYear: (y: string) => void
  setRole: (r: string) => void
  toggleInterest: (i: string) => void
  setAvatar: (name: string, emoji: string) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (n: number) => void
  reset: () => void
}

const initialState = {
  step: 1,
  totalSteps: 6,
  email: '',
  userType: null as UserType,
  otpSent: false,
  institution: '',
  institutionType: null as 'college' | 'company' | null,
  field: '',
  year: '',
  role: '',
  interests: [] as string[],
  avatarName: '',
  avatarEmoji: '',
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setEmail:       (email)        => set({ email }),
  setUserType:    (userType)     => set({ userType }),
  setOtpSent:     (otpSent)      => set({ otpSent }),
  setInstitution: (institution, institutionType) => set({ institution, institutionType }),
  setField:       (field)        => set({ field }),
  setYear:        (year)         => set({ year }),
  setRole:        (role)         => set({ role }),
  setAvatar:      (avatarName, avatarEmoji) => set({ avatarName, avatarEmoji }),

  toggleInterest: (i) => set((s) => ({
    interests: s.interests.includes(i)
      ? s.interests.filter((x) => x !== i)
      : s.interests.length < 5 ? [...s.interests, i] : s.interests,
  })),

  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  goToStep: (step) => set({ step }),
  reset: () => set(initialState),
}))
