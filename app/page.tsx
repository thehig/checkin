import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/dashboard')
}
