import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

// Check if DigitalOcean Spaces is configured
const isSpacesConfigured = Boolean(
  process.env.DO_SPACES_KEY &&
    process.env.DO_SPACES_SECRET &&
    process.env.DO_SPACES_BUCKET &&
    process.env.DO_SPACES_REGION,
)

// Initialize DigitalOcean Spaces client (S3-compatible) only if configured
let s3Client: S3Client | null = null

if (isSpacesConfigured) {
  s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
    region: process.env.DO_SPACES_REGION || "nyc3",
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY!,
      secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
  })
}

// In-memory session storage (fallback when Spaces is not configured)
const sessionStore = new Map<string, SessionData>()

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "therapyfordogs"

export interface SessionData {
  analysis: string
  imageUrl: string
  timestamp: string
}

export async function storeSession(sessionId: string, data: SessionData): Promise<void> {
  if (!s3Client) {
    console.warn("[v0] DigitalOcean Spaces not configured, using in-memory storage")
    sessionStore.set(sessionId, data)
    return
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `sessions/${sessionId}.json`,
      Body: JSON.stringify(data),
      ContentType: "application/json",
      ACL: "private",
    })

    await s3Client.send(command)
    console.log("[v0] Session stored successfully in DigitalOcean Spaces")
  } catch (error) {
    console.error("[v0] Failed to store session in Spaces, falling back to in-memory:", error)
    sessionStore.set(sessionId, data)
  }
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  if (!s3Client) {
    console.warn("[v0] DigitalOcean Spaces not configured, using in-memory storage")
    return sessionStore.get(sessionId) || null
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `sessions/${sessionId}.json`,
    })

    const response = await s3Client.send(command)
    const body = await response.Body?.transformToString()

    if (!body) {
      return sessionStore.get(sessionId) || null
    }

    return JSON.parse(body) as SessionData
  } catch (error) {
    console.error("[v0] Failed to retrieve session from Spaces, trying in-memory:", error)
    return sessionStore.get(sessionId) || null
  }
}

export function isStorageConfigured(): boolean {
  return isSpacesConfigured
}
