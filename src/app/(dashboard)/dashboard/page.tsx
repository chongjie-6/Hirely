'use client'

import Link from 'next/link'
import { useTailoredResumes } from '@/hooks/use-tailored-resumes'
import { useToast } from '@/components/ui/toast'
import Button from '@/components/ui/button'
import Card, { CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { Sparkles, Trash2, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { resumes, loading, deleteResume, refetch } = useTailoredResumes()
  const { addToast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tailored resume?')) return
    try {
      await deleteResume(id)
      addToast('Resume deleted', 'success')
    } catch {
      addToast('Failed to delete', 'error')
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'default'
    if (score >= 80) return 'success' as const
    if (score >= 60) return 'warning' as const
    return 'danger' as const
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Tailored Resumes</h2>
          <p className="text-sm text-gray-500">{resumes.length} resumes generated</p>
        </div>
        <Link href="/tailor">
          <Button>
            <Sparkles size={16} className="mr-1" /> Tailor New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No tailored resumes yet</h3>
            <p className="text-gray-500 mt-1 mb-6">
              Paste a job description and let AI tailor your resume.
            </p>
            <Link href="/tailor">
              <Button>
                <Sparkles size={16} className="mr-1" /> Tailor Your First Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-start justify-between">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {resume.job_title || 'Untitled Position'}
                    </h3>
                    {resume.company_name && (
                      <p className="text-sm text-gray-600">{resume.company_name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(resume.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {resume.match_score !== null && (
                      <div className="mt-2">
                        <Badge variant={getScoreColor(resume.match_score)}>
                          {resume.match_score}% match
                        </Badge>
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
