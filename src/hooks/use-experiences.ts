'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Experience } from '@/types/database'

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchExperiences = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })

    setExperiences(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const addExperience = async (exp: Record<string, unknown>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('experiences')
      .insert({ ...exp, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    setExperiences(prev => [...prev, data])
    return data
  }

  const updateExperience = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('experiences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setExperiences(prev => prev.map(e => e.id === id ? data : e))
    return data
  }

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) throw error
    setExperiences(prev => prev.filter(e => e.id !== id))
  }

  return { experiences, loading, addExperience, updateExperience, deleteExperience, refetch: fetchExperiences }
}
