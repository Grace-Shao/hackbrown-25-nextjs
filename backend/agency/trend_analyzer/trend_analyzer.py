from agency_swarm import Agent

class TrendAnalyzer(Agent):
    def __init__(self):
        super().__init__(
            name="Trending Music Analyzer",
            description="Responsible for analyzing current music trends and identifying the most viral music using web search and trend analysis tools.",
            instructions="./music_instructions.md",
            tools_folder="./music_tools",
            temperature=0.5,
            max_prompt_tokens=4000
        )