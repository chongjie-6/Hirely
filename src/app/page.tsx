import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            Hirely
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="h-10 px-4 text-base">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="h-10 px-5 text-base">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/4 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="block opacity-0 animate-slide-up">
                Tailor your resume to{" "}
              </span>
              <span
                style={{ animationDelay: "300ms" }}
                className="block text-primary opacity-0 animate-slide-up"
              >
                any job in seconds.
              </span>
            </h1>

            <p
              style={{ animationDelay: "500ms" }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-slide-up"
            >
              Paste a job description. Get a resume that highlights your most
              relevant skills and experience. Land more interviews.
            </p>

            <div
              style={{ animationDelay: "500ms" }}
              className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5 opacity-0 animate-slide-up"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 gap-2 overflow-hidden"
                >
                  Get Started Free
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover/button:translate-x-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <ScrollReveal
            className="mt-20 relative mx-auto max-w-5xl"
            threshold={0.4}
          >
            <div className="scroll-slide-up">
              <div className="absolute -inset-4 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="rounded-xl border border-border/50 shadow-2xl shadow-black/50 overflow-hidden bg-card">
              <Image
                src="/hirely-dashboard.png"
                alt="Hirely Dashboard"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm text-muted-foreground text-center uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Three steps to a better resume
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Add your experience",
                desc: "Enter your work history, education, skills, and projects. Do it once, reuse it forever.",
              },
              {
                step: "02",
                title: "Paste a job description",
                desc: "Copy any job posting and our AI analyzes what the employer is looking for.",
              },
              {
                step: "03",
                title: "Get your tailored resume",
                desc: "Download a perfectly tailored PDF that highlights your most relevant qualifications.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.step} threshold={0.4}>
                <div
                  className="relative scroll-slide-up"
                  style={{ animationDelay: `${350 * index}ms` }}
                >
                  <span className="text-6xl font-bold text-foreground/30 absolute -top-8 -left-2">
                    {item.step}
                  </span>
                  <div className="relative pt-10">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm text-muted-foreground text-center uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Hirely?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "AI-Powered Tailoring",
                desc: "Claude AI rewrites your bullet points to match job requirements without fabricating experience.",
              },
              {
                title: "ATS-Friendly PDF",
                desc: "Download real vector PDFs with selectable text that pass through applicant tracking systems.",
              },
              {
                title: "Match Score",
                desc: "See how well your background aligns with each job before you apply.",
              },
              {
                title: "Actionable Suggestions",
                desc: "Get specific tips on how to strengthen your application for each role.",
              },
            ].map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-colors duration-200"
                >
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to land your next role?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Stop sending the same generic resume. Start tailoring in seconds.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="text-base px-10 gap-2 py-5 overflow-hidden"
            >
              Get Started Free
              <ArrowRight className="size-4 transition-transform duration-500 group-hover/button:translate-x-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Built with Next.js, Supabase, and Claude AI
        </div>
      </footer>
    </div>
  );
}
