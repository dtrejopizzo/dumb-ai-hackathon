import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

// Initialize DigitalOcean Spaces client (S3-compatible)
const s3Client = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  region: process.env.DO_SPACES_REGION || "nyc3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || "",
  },
})

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "therapyfordogs"

export interface SessionData {
  analysis: string
  imageUrl: string
  timestamp: string
}

export async function storeSession(sessionId: string, data: SessionData): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `sessions/${sessionId}.json`,
    Body: JSON.stringify(data),
    ContentType: "application/json",
    ACL: "private",
  })

  await s3Client.send(command)
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `sessions/${sessionId}.json`,
    })

    const response = await s3Client.send(command)
    const body = await response.Body?.transformToString()

    if (!body) {
      return null
    }

    return JSON.parse(body) as SessionData
  } catch (error) {
    console.error("Failed to retrieve session:", error)
    return null
  }
}
