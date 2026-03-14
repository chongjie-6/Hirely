'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Skill } from '@/types/database'

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchSkills = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    setSkills(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const addSkill = async (skill: { name: string; category: 'technical' | 'soft' }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('skills')
      .insert({ ...skill, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    setSkills(prev => [...prev, data])
    return data
  }

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) throw error
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return { skills, loading, addSkill, deleteSkill, refetch: fetchSkills }
}
