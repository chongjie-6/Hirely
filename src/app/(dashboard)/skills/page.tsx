'use client'

import { useState } from 'react'
import { useSkills } from '@/hooks/use-skills'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'

export default function SkillsPage() {
  const { skills, loading, addSkill, deleteSkill } = useSkills()
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
      toast.success('Skill added')
    } catch {
      toast.error('Failed to add skill')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id)
    } catch {
      toast.error('Failed to remove skill')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>

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
              <SelectTrigger className="w-[140px]">
                <SelectValue />
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
              <p className="text-sm text-muted-foreground">No technical skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map(skill => (
                  <Badge key={skill.id} variant="secondary" className="gap-1 pr-1">
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
              <p className="text-sm text-muted-foreground">No soft skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => (
                  <Badge key={skill.id} variant="outline" className="gap-1 pr-1">
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
