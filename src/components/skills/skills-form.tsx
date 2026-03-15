'use client'

import { useState } from 'react'
import { addSkill, deleteSkill } from '@/services/actions'
import type { Skill } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { X } from 'lucide-react'

export default function SkillsList({ skills: initialSkills }: { skills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [newSkill, setNewSkill] = useState('')
  const [category, setCategory] = useState<'technical' | 'soft'>('technical')

  const technicalSkills = skills.filter(s => s.category === 'technical')
  const softSkills = skills.filter(s => s.category === 'soft')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    try {
      const added = await addSkill({ name: newSkill.trim(), category })
      setSkills(prev => [...prev, added])
      setNewSkill('')
      toast.success('Skill added')
    } catch {
      toast.error('Failed to add skill')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id)
      setSkills(prev => prev.filter(s => s.id !== id))
    } catch {
      toast.error('Failed to remove skill')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-xl font-semibold">Skills</h2>

      <Card>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="new-skill">Add a skill</Label>
              <Input
                id="new-skill"
                placeholder="e.g. React, Python, Leadership..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as 'technical' | 'soft')}>
              <SelectTrigger className="w-35">
                <SelectValue>
                  {category === 'technical' ? 'Technical' : 'Soft Skill'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="soft">Soft Skill</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>{technicalSkills.length} skills</CardDescription>
          </CardHeader>
          <CardContent>
            {technicalSkills.length === 0 ? (
              <p className="text-base text-muted-foreground">No technical skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map(skill => (
                  <Badge key={skill.id} variant="secondary" className="gap-1 pr-1 capitalize">
                    {skill.name}
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-foreground/10 size-4"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soft Skills</CardTitle>
            <CardDescription>{softSkills.length} skills</CardDescription>
          </CardHeader>
          <CardContent>
            {softSkills.length === 0 ? (
              <p className="text-base text-muted-foreground">No soft skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => (
                  <Badge key={skill.id} variant="outline" className="gap-1 pr-1 capitalize">
                    {skill.name}
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-foreground/10 size-4"
                    >
                      <X className="size-3" />
                    </button>
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
