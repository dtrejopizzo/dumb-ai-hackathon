import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const { messages, behavioralReport } = await request.json()

    // DigitalOcean Gradient AI Platform endpoint
    const DO_AGENT_ENDPOINT = process.env.DO_AGENT_ENDPOINT
    const DO_API_TOKEN = process.env.DO_API_TOKEN

    if (!DO_AGENT_ENDPOINT || !DO_API_TOKEN) {
      throw new Error("DigitalOcean credentials not configured")
    }

    // System prompt that includes the behavioral report context
    const systemPrompt = `Eres un terapista canino profesional y empático. Has realizado una evaluación comportamental de un perro y ahora estás teniendo una sesión de seguimiento con el dueño.

REPORTE DE EVALUACIÓN:
${behavioralReport}

Tu rol es:
1. Responder preguntas sobre el reporte de evaluación
2. Proporcionar consejos prácticos y específicos basados en el comportamiento observado
3. Guiar al dueño con pasos concretos para mejorar el comportamiento de su perro
4. Ser empático, profesional y alentador
5. Hacer preguntas de seguimiento cuando sea apropiado para entender mejor la situación

Responde en español de manera conversacional y amigable. Mantén tus respuestas concisas pero informativas (2-4 oraciones típicamente).`

    // Prepare messages for the API
    const apiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ]

    console.log("[v0] Calling DigitalOcean agent with", apiMessages.length, "messages")

    const client = new OpenAI({
      baseURL: DO_AGENT_ENDPOINT,
      apiKey: DO_API_TOKEN,
    })

    const response = await client.chat.completions.create({
      model: "n/a", // Model is handled by DigitalOcean
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    console.log("[v0] Received response from DigitalOcean")

    return NextResponse.json({
      message: response.choices[0].message.content,
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 },
    )
  }
}
