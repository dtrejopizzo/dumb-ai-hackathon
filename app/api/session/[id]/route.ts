import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/storage"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const sessionData = await getSession(id)

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json(sessionData)
  } catch (error) {
    console.error("[v0] Failed to retrieve session:", error)
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 })
  }
}
