const ADJECTIVES = [
  'Blue', 'Red', 'Silver', 'Golden', 'Dark', 'Swift', 'Quiet', 'Bright',
  'Wild', 'Calm', 'Bold', 'Lunar', 'Solar', 'Cosmic', 'Neon', 'Amber',
  'Jade', 'Crimson', 'Ivory', 'Cobalt', 'Sage', 'Teal', 'Dusk', 'Dawn',
]

const ANIMALS = [
  'Fox', 'Panda', 'Owl', 'Wolf', 'Hawk', 'Bear', 'Lynx', 'Crane',
  'Raven', 'Deer', 'Seal', 'Mink', 'Kite', 'Hare', 'Viper', 'Finch',
  'Otter', 'Ibis', 'Moose', 'Gecko', 'Bison', 'Egret', 'Dingo', 'Stoat',
]

const EMOJIS: Record<string, string> = {
  Fox: '🦊', Panda: '🐼', Owl: '🦉', Wolf: '🐺', Hawk: '🦅',
  Bear: '🐻', Lynx: '🐈', Crane: '🦢', Raven: '🐦', Deer: '🦌',
  Seal: '🦭', Mink: '🦦', Kite: '🪁', Hare: '🐰', Viper: '🐍',
  Finch: '🐦', Otter: '🦦', Ibis: '🦤', Moose: '🫎', Gecko: '🦎',
  Bison: '🦬', Egret: '🕊️', Dingo: '🐕', Stoat: '🐾',
}

export function generateAvatarName(userId: string): { name: string; emoji: string; id: string } {
  // Deterministic from userId hash
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash |= 0
  }
  const absHash = Math.abs(hash)
  const adj    = ADJECTIVES[absHash % ADJECTIVES.length]
  const animal = ANIMALS[Math.floor(absHash / ADJECTIVES.length) % ANIMALS.length]
  const num    = String(absHash % 9000 + 1000)
  return {
    name:  `${adj} ${animal} #${num}`,
    emoji: EMOJIS[animal] ?? '🎭',
    id:    `${adj.toLowerCase()}-${animal.toLowerCase()}-${num}`,
  }
}

export const FIELDS = [
  { value: 'cs',       label: 'Computer Science',       icon: '💻' },
  { value: 'ee',       label: 'Electrical Engineering',  icon: '⚡' },
  { value: 'me',       label: 'Mechanical Engineering',  icon: '⚙️' },
  { value: 'ce',       label: 'Civil Engineering',       icon: '🏗️' },
  { value: 'mba',      label: 'MBA / Management',        icon: '📊' },
  { value: 'law',      label: 'Law',                     icon: '⚖️' },
  { value: 'medicine', label: 'Medicine',                icon: '🩺' },
  { value: 'design',   label: 'Design / Arts',           icon: '🎨' },
  { value: 'data',     label: 'Data Science / AI',       icon: '🧠' },
  { value: 'finance',  label: 'Finance / Economics',     icon: '💹' },
  { value: 'marketing',label: 'Marketing',               icon: '📣' },
  { value: 'other',    label: 'Other',                   icon: '✨' },
]

export const YEARS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
  { value: 'pg', label: 'Post Graduate' },
  { value: 'alumni', label: 'Alumni' },
]

export const INTERESTS = [
  { value: 'placements',   label: 'Placements & Jobs',     icon: '💼' },
  { value: 'startups',     label: 'Startups',               icon: '🚀' },
  { value: 'research',     label: 'Research & Academia',    icon: '🔬' },
  { value: 'mentorship',   label: 'Mentorship',             icon: '🤝' },
  { value: 'mental_health',label: 'Mental Health',          icon: '💚' },
  { value: 'competitive',  label: 'Competitive Coding',     icon: '🏆' },
  { value: 'networking',   label: 'Networking',             icon: '🌐' },
  { value: 'marketplace',  label: 'Marketplace',            icon: '🛍️' },
  { value: 'events',       label: 'Events & Fests',         icon: '🎉' },
  { value: 'salary',       label: 'Salary & Compensation',  icon: '💰' },
]
