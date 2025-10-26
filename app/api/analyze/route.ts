import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { storeSession, isStorageConfigured } from "@/lib/storage"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Starting image analysis")

    // Parse the uploaded image from FormData
    const formData = await req.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Image received, converting to base64")

    // Convert image to base64 data URL
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const mimeType = image.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log("[v0] Calling Replicate API")

    // Use yorickvp/llava-13b which is a verified working vision model on Replicate
    const output = await replicate.run(
      "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      {
        input: {
          image: dataUrl,
          prompt: `You are a professional dog behavioral therapist and canine psychologist conducting a comprehensive psychological evaluation. 

Analyze this dog's emotional state, behavioral patterns, temperament, and psychological needs based on their appearance, body language, and visible characteristics. Be creative, humorous, insightful, and thorough.

Provide your analysis in the following structured format:

PATIENT PROFILE:
- Breed/Mix: [identify the breed or mix]
- Estimated Age: [puppy, young adult, adult, senior]
- Physical Characteristics: [notable features, coat condition, etc.]

BEHAVIORAL ASSESSMENT:
- Current Emotional State: [describe their mood, energy level, and demeanor]
- Body Language Analysis: [what their posture, ears, tail, eyes reveal]
- Temperament Indicators: [personality traits visible in the photo]
- Social Behavior Patterns: [how they likely interact with humans/other dogs]

PSYCHOLOGICAL EVALUATION:
- Anxiety Indicators: [any signs of stress, fear, or anxiety]
- Confidence Level: [self-assured, timid, bold, etc.]
- Attachment Style: [independent, clingy, secure, etc.]
- Coping Mechanisms: [how they handle stress or new situations]

DIAGNOSIS:
[Provide 1-3 humorous but insightful behavioral diagnoses, such as "Chronic Ball Obsession Disorder" or "Separation Anxiety with Couch Destruction Tendencies"]

TREATMENT RECOMMENDATIONS:
[List 3-5 specific therapy recommendations, training suggestions, or lifestyle changes]

PROGNOSIS:
[Overall outlook for their behavioral health and wellbeing, with humor]

Be creative, empathetic, and maintain a professional therapeutic tone while being entertaining. Remember, this is for fun but should feel like a real behavioral assessment.`,
          max_tokens: 1500,
          temperature: 0.8,
        },
      },
    )

    console.log("[v0] Replicate analysis complete")

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Store the analysis result
    const analysisText = Array.isArray(output) ? output.join("") : output

    if (isStorageConfigured()) {
      try {
        await storeSession(sessionId, {
          analysis: analysisText,
          imageUrl: dataUrl,
          timestamp: new Date().toISOString(),
        })
        console.log("[v0] Session stored successfully in DigitalOcean Spaces")
        return NextResponse.json({ sessionId })
      } catch (storageError) {
        console.error("[v0] Storage failed:", storageError)
        // Fall through to URL encoding
      }
    } else {
      console.warn("[v0] DigitalOcean Spaces not configured, using URL encoding fallback")
    }

    const sessionData = {
      analysis: analysisText,
      imageUrl: dataUrl.substring(0, 50000), // Limit image size to prevent URI_TOO_LONG
      timestamp: new Date().toISOString(),
    }
    const encodedData = Buffer.from(JSON.stringify(sessionData)).toString("base64")
    const fallbackSessionId = `${sessionId}_${encodedData}`

    return NextResponse.json({
      sessionId: fallbackSessionId,
      warning: "DigitalOcean Spaces not configured. Configure DO_SPACES_* environment variables for production use.",
    })
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json(
      { error: `Failed to analyze image: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
