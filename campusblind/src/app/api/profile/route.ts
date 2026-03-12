import { auth } from '@clerk/nextjs/server'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      email, user_type, institution, field,
      year, role, interests, avatar_name, avatar_emoji,
    } = body

    await sql`
      INSERT INTO profiles (
        id, email, user_type, institution, field,
        year, role, interests, avatar_name, avatar_emoji,
        vector_seed, onboarded_at, created_at, updated_at
      ) VALUES (
        ${userId},
        ${email},
        ${user_type},
        ${institution},
        ${field},
        ${year ?? null},
        ${role ?? null},
        ${JSON.stringify(interests)},
        ${avatar_name},
        ${avatar_emoji},
        ${JSON.stringify(interests.reduce((a: any, i: string) => ({ ...a, [i]: 0.7 }), {}))},
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        institution  = EXCLUDED.institution,
        field        = EXCLUDED.field,
        year         = EXCLUDED.year,
        role         = EXCLUDED.role,
        interests    = EXCLUDED.interests,
        avatar_name  = EXCLUDED.avatar_name,
        avatar_emoji = EXCLUDED.avatar_emoji,
        onboarded_at = NOW(),
        updated_at   = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Profile save error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
