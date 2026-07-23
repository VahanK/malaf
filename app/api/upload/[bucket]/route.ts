import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Generic owner-scoped upload for the portfolio/voice public buckets (migration 004).
// avatars keeps its own route (single-file, replace-on-upload semantics differ).
const BUCKET_RULES: Record<string, { types: string[]; maxSize: number }> = {
  portfolio: { types: ['image/jpeg', 'image/png', 'image/webp'], maxSize: 10 * 1024 * 1024 },
  voice: { types: ['audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/ogg'], maxSize: 2 * 1024 * 1024 },
}

export async function POST(request: Request, { params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = await params
  const rules = BUCKET_RULES[bucket]
  if (!rules) return NextResponse.json({ error: 'Unknown bucket' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!rules.types.includes(file.type)) {
    return NextResponse.json({ error: `Invalid file type for ${bucket}` }, { status: 400 })
  }
  if (file.size > rules.maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${user.id}/${bucket}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Return the BUCKET-QUALIFIED path (e.g. "portfolio/user/…") so mediaUrl builds
  // …/object/public/portfolio/user/… — the storage host needs the bucket segment.
  // Without it the public URL 400s and images render as a broken-image icon.
  return NextResponse.json({ path: `${bucket}/${fileName}` })
}
