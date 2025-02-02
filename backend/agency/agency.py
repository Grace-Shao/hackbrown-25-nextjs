from agency_swarm import Agency
from trend_analyzer.trend_analyzer import TrendAnalyzer
#from AWS_image_analyzer.AWS_image_analyzer import AWSImageCaptionAgent
from agency_swarm.util import set_openai_key
import os
from dotenv import load_dotenv

load_dotenv()
set_openai_key(os.getenv("OPENAI_API_KEY"))

trend_analyzer = TrendAnalyzer()
#AWSImageCapion_agent = AWSImageCaptionAgent()

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