'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Education } from '@/types/database'

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchEducation = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })

    setEducation(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchEducation()
  }, [fetchEducation])

  const addEducation = async (edu: Record<string, unknown>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('education')
      .insert({ ...edu, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    setEducation(prev => [...prev, data])
    return data
  }

  const updateEducation = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('education')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setEducation(prev => prev.map(e => e.id === id ? data : e))
    return data
  }

  const deleteEducation = async (id: string) => {
    const { error } = await supabase.from('education').delete().eq('id', id)
    if (error) throw error
    setEducation(prev => prev.filter(e => e.id !== id))
  }

  return { education, loading, addEducation, updateEducation, deleteEducation, refetch: fetchEducation }
}
