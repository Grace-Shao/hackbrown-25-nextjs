import boto3
import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# AWS and OpenAI credentials
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")
openai_api_key = os.getenv("OPENAI_API_KEY")
rekognition_client = boto3.client(
    "rekognition",
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_access_key,
    region_name=aws_region,
)

openai.api_key = openai_api_key


# Function to analyze the image with AWS Rekognition
def analyze_image_with_rekognition(image_path):
    with open(image_path, "rb") as image_file:
        image_bytes = image_file.read()

    # Call AWS Rekognition to detect labels
    response = rekognition_client.detect_labels(
        Image={"Bytes": image_bytes}, MaxLabels=10, MinConfidence=70
    )

    return response["Labels"]


# Function to generate a prompt for OpenAI based on Rekognition labels
def generate_prompt(labels):
    label_descriptions = [
        f"{label['Name']} ({label['Confidence']:.2f}%)" for label in labels
    ]
    label_names = ", ".join(label["Name"].lower() for label in labels)

    prompt = (
        f"The following labels were detected in an image: {', '.join(label_descriptions)}. "
        "Based on these labels, describe the image without mention label statistics, describe the setting, time of day, season, "
        "any activities or events, and emotions conveyed. Be striaghtforward. If you see night, or nightlife label. Describe this is a party and EDMs"
    )
    return prompt


# Function to call OpenAI and generate a description
def generate_image_description(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that generates image descriptions.",
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message["content"]


# Function to generate music keywords for Spotify based on the image description
def generate_music_keywords(image_description):
    keyword_prompt = (
        f"The following is a detailed description of an image: {image_description}. "
        "Based on this description, 1 music genre and 1 keyword suitable for a Spotify search. "
        "Output only the keywords separated by spaces, without any extra text or punctuation."
    )

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that suggests music genres and keywords.",
            },
            {"role": "user", "content": keyword_prompt},
        ],
    )

    # Return only the keywords from the response
    return response.choices[0].message["content"].strip()


def AWSImageCaption():
    image_path = "../../image/download.jpg"
    labels = analyze_image_with_rekognition(image_path)
    prompt = generate_prompt(labels)
    image_description = generate_image_description(prompt)
    music_keywords = generate_music_keywords(image_description)

    # print("\nGenerated Image Description:")
    print(image_description)
    # print("\nGenerated Music Keywords for Spotify:")
    print(music_keywords)


if __name__ == "__main__":
    AWSImageCaption()
