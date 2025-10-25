import { Card } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      object: "Max the Golden Retriever",
      quote:
        "After years of separation anxiety, I finally understand why I eat the couch when my humans leave. The therapy helped me find healthier coping mechanisms.",
      diagnosis: "Separation Anxiety Disorder",
    },
    {
      object: "Bella the Border Collie",
      quote:
        "I never realized how much my herding instincts were causing stress. Now I channel that energy into agility training instead of chasing the mailman.",
      diagnosis: "Obsessive Herding Disorder",
    },
    {
      object: "Charlie the Chihuahua",
      quote:
        "Being called a 'small dog' was causing serious Napoleon complex issues. Now I embrace my compact size and fierce personality.",
      diagnosis: "Small Dog Syndrome",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Success Stories</h2>
        <p className="mt-4 text-lg text-muted-foreground">Real testimonials from dogs who found healing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 bg-card">
            <div className="mb-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {testimonial.diagnosis}
              </div>
            </div>
            <blockquote className="text-base leading-relaxed text-muted-foreground">"{testimonial.quote}"</blockquote>
            <p className="mt-4 text-sm font-semibold text-foreground">— {testimonial.object}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
