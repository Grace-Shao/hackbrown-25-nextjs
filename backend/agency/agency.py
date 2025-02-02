from agency_swarm import Agency
from trend_analyzer.trend_analyzer import TrendAnalyzer
from agency_swarm.util import set_openai_key
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set OpenAI key for agent communication
set_openai_key(os.getenv("OPENAI_API_KEY"))

trend_analyzer = TrendAnalyzer()

# Create agency with communication flows
agency = Agency(
    [
        trend_analyzer 
    ],
    shared_instructions="agency_manifesto.md",
    temperature=0.7,
    max_prompt_tokens=4000
)

if __name__ == "__main__":
    agency.run_demo() 