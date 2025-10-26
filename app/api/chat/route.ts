import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, behavioralReport } = await request.json()

    // DigitalOcean Gradient AI Platform endpoint
    const DO_AGENT_ENDPOINT = process.env.DO_AGENT_ENDPOINT
    const DO_API_TOKEN = process.env.DO_API_TOKEN

    if (!DO_AGENT_ENDPOINT || !DO_API_TOKEN) {
      throw new Error("DigitalOcean credentials not configured")
    }

    // DigitalOcean agents require the /api/v1/ prefix for OpenAI-compatible endpoints
    const agentUrl = `${DO_AGENT_ENDPOINT}/api/v1/chat/completions`

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
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    console.log("[v0] Calling DigitalOcean agent at:", agentUrl)
    console.log("[v0] With", apiMessages.length, "messages")

    const response = await fetch(agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DO_API_TOKEN}`,
      },
      body: JSON.stringify({
        messages: apiMessages,
        model: "llama3.3-70b-instruct",
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] DigitalOcean API error:", response.status, errorText)
      throw new Error(`DigitalOcean API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Received response from DigitalOcean")

    return NextResponse.json({
      message: data.choices[0].message.content,
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 },
    )
  }
}
