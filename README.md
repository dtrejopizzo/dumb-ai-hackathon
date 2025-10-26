# TherapyForDogs.ai 🐕‍🦺🛋️

> Professional AI-powered therapy for your canine companions. Built for the Dumb Things 2.0 Hackathon.

## Overview

TherapyForDogs.ai is an absurdly professional AI therapist service that provides comprehensive psychological evaluations for dogs. Upload a photo of your dog and receive a detailed behavioral analysis complete with diagnoses like "Chronic Ball Obsession Disorder" and treatment recommendations.

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS v4
- **AI Vision**: Replicate (Meta Llama 3.2 Vision)
- **Deployment**: DigitalOcean Gradient AI Platform
- **UI Components**: shadcn/ui

## Features

- 📸 Drag-and-drop photo upload
- 🧠 AI-powered behavioral analysis using vision models
- 📋 Professional therapy report generation
- 🎨 Calming, therapy-office aesthetic design
- 😂 Humorous yet insightful diagnoses
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- Replicate API token
- DigitalOcean account (optional, for agent deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Add your Replicate API token to environment variables:
   - In v0: Go to sidebar → Vars → Add `REPLICATE_API_TOKEN`
   - Locally: Create `.env.local` and add `REPLICATE_API_TOKEN=your_token`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## DigitalOcean Agent Deployment

To deploy the AI agent on DigitalOcean's Gradient AI Platform:

1. Install Python dependencies:
   \`\`\`bash
   pip install pydo
   \`\`\`

2. Run the deployment script:
   \`\`\`bash
   python scripts/deploy_do_agent.py \
     --token YOUR_DO_TOKEN \
     --project-id YOUR_PROJECT_ID \
     --region nyc1
   \`\`\`

3. Note the Agent UUID and add it to your environment variables

## How It Works

1. **Upload**: User uploads a photo of their dog
2. **Analysis**: AI vision model analyzes the dog's appearance, body language, and characteristics
3. **Evaluation**: System generates a structured behavioral report with:
   - Patient Profile (breed, age, characteristics)
   - Behavioral Assessment (emotional state, body language)
   - Psychological Evaluation (anxiety, confidence, attachment style)
   - Diagnosis (humorous but insightful conditions)
   - Treatment Recommendations (training tips, lifestyle changes)
   - Prognosis (outlook for behavioral health)
4. **Results**: User receives a professional-looking therapy report

## Disclaimer

This is a parody project created for entertainment purposes. It is not a substitute for professional veterinary care or certified animal behaviorist consultation. If your dog has serious behavioral issues, please consult a licensed professional.

## License

MIT License - Built with ❤️ and 😂 for Dumb Things 2.0 Hackathon
