import { UploadSection } from "@/components/upload-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Now accepting new canine patients
            </div>

            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Professional Therapy for Your Dog
            </h1>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Evidence-based psychological counseling for canine companions. Our AI-powered therapists provide
              comprehensive behavioral analysis and emotional support for dogs of all breeds and sizes.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#upload"
                className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Start Session
              </a>
              <a
                href="#how-it-works"
                className="rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-card-foreground shadow-sm transition-colors hover:bg-accent"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="border-b border-border bg-card">
        <UploadSection />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-border">
        <HowItWorks />
      </section>

      {/* Testimonials */}
      <section className="bg-card">
        <Testimonials />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              TherapyForDogs.ai - Professional psychological services for canine companions since 2025
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Disclaimer: Not a substitute for actual veterinary or behavioral therapy. Built for Dumb Things 2.0
              Hackathon using DigitalOcean.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
