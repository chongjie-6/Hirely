import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Sparkles, Download } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">Hirely</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold leading-tight">
          Tailor your resume to
          <br />
          <span className="text-primary">any job in seconds</span>
        </h1>
        <p className="mt-6 text-2xl text-muted-foreground max-w-2xl mx-auto">
          Paste a job description and let AI customize your resume to highlight
          the most relevant skills and experience. Stand out to recruiters.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">Get Started Free</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">Log In</Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Add your experience</h3>
              <p className="text-muted-foreground">
                Enter your work history, education, skills, and projects. Do it once, reuse it forever.
              </p>
            </div>
            <div className="text-center">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Paste a job description</h3>
              <p className="text-muted-foreground">
                Copy any job posting and our AI analyzes what the employer is looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get your tailored resume</h3>
              <p className="text-muted-foreground">
                Download a perfectly tailored PDF resume that highlights your most relevant qualifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Hirely?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'AI-Powered Tailoring', desc: 'Claude AI rewrites your bullet points to match job requirements without fabricating experience.' },
              { title: 'ATS-Friendly PDF', desc: 'Download real vector PDFs with selectable text that pass through applicant tracking systems.' },
              { title: 'Match Score', desc: 'See how well your background aligns with each job before you apply.' },
              { title: 'Actionable Suggestions', desc: 'Get specific tips on how to strengthen your application for each role.' },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-base text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-base text-muted-foreground">
          Built with Next.js, Supabase, and Claude AI
        </div>
      </footer>
    </div>
  )
}
