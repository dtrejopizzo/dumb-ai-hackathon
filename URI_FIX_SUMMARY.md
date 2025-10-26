# URI_TOO_LONG Error Fix

## Problem
The application was experiencing `URI_TOO_LONG` errors because session data (including the full behavioral analysis text and base64-encoded dog images) was being encoded directly into the URL. This created URLs that exceeded browser and server limits (typically 2048-8192 characters).

## Solution
Implemented server-side session storage with automatic fallback:

### 1. In-Memory Storage (Default)
- Sessions are stored in a Map on the server side
- Works immediately without any configuration
- Perfect for development and hackathon demos
- Sessions persist for the lifetime of the server process

### 2. DigitalOcean Spaces (Optional Production Storage)
- Can be configured for persistent storage across server restarts
- Uses S3-compatible API
- Automatically falls back to in-memory if not configured

## How It Works

### Upload Flow
1. User uploads dog photo
2. Replicate analyzes the image
3. Session data (analysis + image) is stored server-side with a short session ID
4. Only the short session ID is returned in the URL (e.g., `session_1761437553013_exmlw`)

### Retrieval Flow
1. User visits `/session/[id]`
2. Client-side page fetches session data from `/api/session/[id]`
3. Server retrieves data from storage (in-memory or Spaces)
4. Full analysis and image are displayed

## Files Modified
- `lib/storage.ts` - Added in-memory Map fallback
- `app/api/analyze/route.ts` - Simplified to always use storage
- `app/session/[id]/page.tsx` - Removed URL decoding fallback
- `app/api/session/[id]/route.ts` - Already existed, no changes needed

## Benefits
- URLs are now short and clean
- No more URI_TOO_LONG errors
- Works immediately without configuration
- Can be upgraded to persistent storage by adding DigitalOcean Spaces credentials

## Optional: Configure DigitalOcean Spaces
For production use with persistent storage, add these environment variables:
\`\`\`
DO_SPACES_KEY=your_spaces_access_key
DO_SPACES_SECRET=your_spaces_secret_key
DO_SPACES_BUCKET=therapyfordogs
DO_SPACES_REGION=nyc3
\`\`\`

See `DIGITALOCEAN_SETUP.md` for detailed instructions.
