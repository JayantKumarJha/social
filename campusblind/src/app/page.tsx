import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { sql } from '@vercel/postgres'

export default async function Home() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user has completed onboarding
  try {
    const result = await sql`
      SELECT onboarded_at FROM profiles WHERE id = ${userId} LIMIT 1
    `
    if (result.rows.length > 0 && result.rows[0].onboarded_at) {
      redirect('/feed')
    } else {
      redirect('/onboarding')
    }
  } catch {
    // DB not set up yet or first time — go to onboarding
    redirect('/onboarding')
  }
}
