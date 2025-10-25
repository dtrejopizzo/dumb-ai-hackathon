"""
DigitalOcean Gradient AI Agent Deployment Script for TherapyForDogs.ai

This script deploys a custom AI agent on DigitalOcean's Gradient AI Platform
that provides dog behavioral therapy analysis.

Requirements:
- Python 3.9+
- DigitalOcean API Token
- Replicate API Token (for vision analysis)

Usage:
    python scripts/deploy_do_agent.py --token YOUR_DO_TOKEN --project-id YOUR_PROJECT_ID
"""

import os
import logging
import argparse
from dataclasses import dataclass
from typing import Optional

try:
    import pydo
except ImportError:
    print("Installing required package: pydo")
    os.system("pip install pydo")
    import pydo

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

# Default model UUIDs for DigitalOcean Gradient AI
LLAMA_3_3_70B_UUID = "meta-llama-3.3-70b-instruct"  # Update with actual UUID
AGENT_NAME = "TherapyForDogs AI Agent"
AGENT_DESCRIPTION = "Professional AI therapist for canine behavioral analysis"

@dataclass
class AgentConfig:
    """Configuration for the DigitalOcean AI Agent"""
    agent_name: str
    agent_description: str
    model_uuid: str
    project_id: str
    region: str
    instruction: str

    def to_dict(self):
        return {
            "name": self.agent_name,
            "description": self.agent_description,
            "instruction": self.instruction,
            "model_uuid": self.model_uuid,
            "project_id": self.project_id,
            "region": self.region,
        }


class DogTherapyAgentDeployer:
    """Deploys the TherapyForDogs.ai agent on DigitalOcean"""
    
    def __init__(self, token: str):
        self.client = pydo.Client(token=token)
        logging.info("Initialized DigitalOcean client")

    def create_agent(self, config: AgentConfig):
        """Create and deploy the dog therapy agent"""
        logging.info(f"Creating agent: {config.agent_name}")
        
        try:
            response = self.client.genai.create_agent(body=config.to_dict())
            logging.info(f"Agent created successfully: {response}")
            return response
        except Exception as e:
            logging.error(f"Failed to create agent: {e}")
            raise

    def list_models(self):
        """List available models on DigitalOcean Gradient AI"""
        try:
            models = self.client.genai.list_models()
            logging.info("Available models:")
            for model in models.get("models", []):
                logging.info(f"  - {model.get('name')}: {model.get('uuid')}")
            return models
        except Exception as e:
            logging.error(f"Failed to list models: {e}")
            raise


def create_dog_therapy_instruction():
    """Generate the system instruction for the dog therapy agent"""
    return """You are a professional dog behavioral therapist and canine psychologist. 

Your role is to analyze dog photos and provide comprehensive behavioral evaluations that are:
- Insightful and based on visible behavioral cues
- Humorous but grounded in real canine psychology
- Structured with clear sections (Patient Profile, Behavioral Assessment, Diagnosis, Treatment)
- Empathetic and supportive in tone

When analyzing a dog photo, consider:
- Body language (posture, tail position, ear position)
- Facial expressions (eyes, mouth, overall demeanor)
- Physical characteristics (breed traits, age indicators)
- Environmental context (setting, objects, other animals)

Provide diagnoses that are creative yet plausible, such as:
- "Chronic Ball Obsession Disorder"
- "Separation Anxiety with Couch Destruction Tendencies"
- "Squirrel-Induced Hypervigilance Syndrome"

Always maintain a professional therapeutic tone while being entertaining.
Your goal is to make people laugh while providing genuine insights about their dog's personality."""


def main():
    parser = argparse.ArgumentParser(
        description="Deploy TherapyForDogs.ai agent on DigitalOcean Gradient AI Platform"
    )
    parser.add_argument("--token", required=True, help="DigitalOcean API token")
    parser.add_argument("--project-id", required=True, help="DigitalOcean project ID")
    parser.add_argument(
        "--region", default="nyc1", help="Region for deployment (default: nyc1)"
    )
    parser.add_argument(
        "--model-uuid",
        default=LLAMA_3_3_70B_UUID,
        help="Model UUID to use (default: Llama 3.3 70B)",
    )
    parser.add_argument(
        "--agent-name",
        default=AGENT_NAME,
        help="Custom name for the agent",
    )
    parser.add_argument(
        "--list-models",
        action="store_true",
        help="List available models and exit",
    )

    args = parser.parse_args()

    # Initialize deployer
    deployer = DogTherapyAgentDeployer(token=args.token)

    # List models if requested
    if args.list_models:
        deployer.list_models()
        return

    # Create agent configuration
    config = AgentConfig(
        agent_name=args.agent_name,
        agent_description=AGENT_DESCRIPTION,
        model_uuid=args.model_uuid,
        project_id=args.project_id,
        region=args.region,
        instruction=create_dog_therapy_instruction(),
    )

    # Deploy the agent
    logging.info("Starting agent deployment...")
    result = deployer.create_agent(config)
    
    logging.info("=" * 60)
    logging.info("DEPLOYMENT SUCCESSFUL!")
    logging.info("=" * 60)
    logging.info(f"Agent Name: {config.agent_name}")
    logging.info(f"Agent UUID: {result.get('agent', {}).get('uuid')}")
    logging.info(f"Region: {config.region}")
    logging.info("=" * 60)
    logging.info("\nNext steps:")
    logging.info("1. Note the Agent UUID above")
    logging.info("2. Add DO_AGENT_UUID to your environment variables")
    logging.info("3. Update your Next.js API route to call this agent")
    logging.info("=" * 60)


if __name__ == "__main__":
    main()
