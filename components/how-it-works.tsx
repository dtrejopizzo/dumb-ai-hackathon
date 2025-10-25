import { Brain, FileText, Heart } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: "AI Vision Analysis",
      description:
        "Our advanced AI examines your dog's physical appearance, body language, and facial expressions to assess their emotional state and temperament.",
    },
    {
      icon: FileText,
      title: "Comprehensive Evaluation",
      description:
        "Receive a detailed behavioral report including personality analysis, anxiety indicators, and temperament assessment.",
    },
    {
      icon: Heart,
      title: "Treatment Plan",
      description:
        "Get personalized training recommendations, behavioral strategies, and ongoing care instructions for your dog's wellbeing.",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Professional-grade behavioral evaluation in three simple steps
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
