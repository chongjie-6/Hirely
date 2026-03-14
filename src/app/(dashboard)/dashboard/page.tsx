'use client'

import Link from 'next/link'
import { useTailoredResumes } from '@/hooks/use-tailored-resumes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Sparkles, Trash2, FileText, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { resumes, loading, deleteResume } = useTailoredResumes()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tailored resume?')) return
    try {
      await deleteResume(id)
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

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Tailored Resumes</h2>
          <p className="text-sm text-muted-foreground">{resumes.length} resumes generated</p>
        </div>
        <Link href="/tailor">
          <Button>
            <Sparkles className="size-4 mr-1" /> Tailor New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="size-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No tailored resumes yet</h3>
            <p className="text-muted-foreground mt-1 mb-6">
              Paste a job description and let AI tailor your resume.
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
            <Card key={resume.id} className="hover:ring-2 hover:ring-ring/20 transition-all">
              <CardContent>
                <div className="flex items-start justify-between">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      {resume.job_title || 'Untitled Position'}
                    </h3>
                    {resume.company_name && (
                      <p className="text-sm text-muted-foreground">{resume.company_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
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
