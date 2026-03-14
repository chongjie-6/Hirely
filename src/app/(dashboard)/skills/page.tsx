'use client'

import { useState } from 'react'
import { useSkills } from '@/hooks/use-skills'
import { useToast } from '@/components/ui/toast'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import Badge from '@/components/ui/badge'

export default function SkillsPage() {
  const { skills, loading, addSkill, deleteSkill } = useSkills()
  const { addToast } = useToast()
  const [newSkill, setNewSkill] = useState('')
  const [category, setCategory] = useState<'technical' | 'soft'>('technical')

  const technicalSkills = skills.filter(s => s.category === 'technical')
  const softSkills = skills.filter(s => s.category === 'soft')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    try {
      await addSkill({ name: newSkill.trim(), category })
      setNewSkill('')
      addToast('Skill added', 'success')
    } catch {
      addToast('Failed to add skill', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id)
    } catch {
      addToast('Failed to remove skill', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>

      <Card>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                id="new-skill"
                label="Add a skill"
                placeholder="e.g. React, Python, Leadership..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as 'technical' | 'soft')}
              className="h-[42px] rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft Skill</option>
            </select>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-medium">Technical Skills</h3>
            <p className="text-xs text-gray-400">{technicalSkills.length} skills</p>
          </CardHeader>
          <CardContent>
            {technicalSkills.length === 0 ? (
              <p className="text-sm text-gray-400">No technical skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map(skill => (
                  <Badge key={skill.id} onRemove={() => handleDelete(skill.id)}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-medium">Soft Skills</h3>
            <p className="text-xs text-gray-400">{softSkills.length} skills</p>
          </CardHeader>
          <CardContent>
            {softSkills.length === 0 ? (
              <p className="text-sm text-gray-400">No soft skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => (
                  <Badge key={skill.id} variant="success" onRemove={() => handleDelete(skill.id)}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
