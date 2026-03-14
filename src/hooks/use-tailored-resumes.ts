'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TailoredResume } from '@/types/database'

export function useTailoredResumes() {
  const [resumes, setResumes] = useState<TailoredResume[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchResumes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('tailored_resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setResumes(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const getResume = async (id: string) => {
    const { data, error } = await supabase
      .from('tailored_resumes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as TailoredResume
  }

  const deleteResume = async (id: string) => {
    const { error } = await supabase.from('tailored_resumes').delete().eq('id', id)
    if (error) throw error
    setResumes(prev => prev.filter(r => r.id !== id))
  }

  return { resumes, loading, getResume, deleteResume, refetch: fetchResumes }
}
