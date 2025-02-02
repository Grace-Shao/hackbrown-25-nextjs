from agency_swarm import Agent
from AWSimageCaption import AWSImageCaption  # Assuming AWSimageCaption.py is in the same directory

class AWSImageCaptionAgent(Agent):
    def __init__(self):
        super().__init__(
            name="AWS Image Caption Agent",
            description="Responsible for generating captions for images using AWS services.",
            instructions="./aws_image_caption_instructions.md",
            tools_folder="./aws_image_caption_tools",
            temperature=0.5,
            max_prompt_tokens=4000
        )
        self.caption_tool = AWSImageCaption()

    def run(self, image_path):
        return self.caption_tool.generate_caption(image_path)