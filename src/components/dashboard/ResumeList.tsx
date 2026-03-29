'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteResume } from '@/services/resumes/action'
import type { TailoredResume } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Sparkles, Trash2, FileText } from 'lucide-react'

export default function ResumeList({ resumes: initialResumes }: { resumes: TailoredResume[] }) {
  const [resumes, setResumes] = useState(initialResumes)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tailored resume?')) return
    try {
      await deleteResume(id)
      setResumes(prev => prev.filter(r => r.id !== id))
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const getScoreVariant = (score: number | null) => {
    if (!score) return 'secondary' as const
    if (score >= 80) return 'default' as const
    if (score >= 60) return 'secondary' as const
    return 'destructive' as const
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Tailored Resumes</h2>
          <p className="text-base text-muted-foreground">{resumes.length} resumes generated</p>
        </div>
        <Link href="/tailor">
          <Button>
            <Sparkles className="size-4 mr-1" /> Tailor New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-muted mb-5">
              <FileText className="size-6 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-medium">No tailored resumes yet</h3>
            <p className="text-muted-foreground mt-1.5 mb-7 max-w-xs mx-auto text-sm leading-relaxed">
              Paste a job description and let AI tailor your resume in seconds.
            </p>
            <Link href="/tailor">
              <Button>
                <Sparkles className="size-4 mr-1" /> Tailor Your First Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:ring-2 hover:ring-primary/15 hover:border-primary/20 transition-all duration-200">
              <CardContent>
                <div className="flex items-start justify-between">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      {resume.job_title || 'Untitled Position'}
                    </h3>
                    {resume.company_name && (
                      <p className="text-base text-muted-foreground">{resume.company_name}</p>
                    )}
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      {new Date(resume.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {resume.match_score !== null && (
                      <div className="mt-2">
                        <Badge variant={getScoreVariant(resume.match_score)}>
                          {resume.match_score}% match
                        </Badge>
                      </div>
                    )}
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
