from flask import Flask, request, jsonify
import boto3
import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# AWS and OpenAI credentials
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize AWS Rekognition client
rekognition_client = boto3.client(
    'rekognition',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_access_key,
    region_name=aws_region
)

# Set OpenAI API key
openai.api_key = openai_api_key

# Function to analyze the image with AWS Rekognition
def analyze_image_with_rekognition(image_bytes):
    # Call AWS Rekognition to detect labels
    response = rekognition_client.detect_labels(
        Image={'Bytes': image_bytes},
        MaxLabels=10,
        MinConfidence=70
    )
    return response['Labels']

# Function to generate a prompt for OpenAI based on Rekognition labels
def generate_prompt(labels):
    label_descriptions = [f"{label['Name']} ({label['Confidence']:.2f}%)" for label in labels]
    label_names = ", ".join(label['Name'].lower() for label in labels)
    
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
            {"role": "system", "content": "You are a helpful assistant that generates image descriptions."},
            {"role": "user", "content": prompt}
        ]
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
            {"role": "system", "content": "You are a helpful assistant that suggests music genres and keywords."},
            {"role": "user", "content": keyword_prompt}
        ]
    )
    
    # Return only the keywords from the response
    return response.choices[0].message["content"].strip()

# API endpoint to handle image upload and return music keywords
@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        # Read the file as bytes
        image_bytes = file.read()

        # Analyze the image with AWS Rekognition
        labels = analyze_image_with_rekognition(image_bytes)

        # Generate a prompt for OpenAI
        prompt = generate_prompt(labels)

        # Generate an image description using OpenAI
        image_description = generate_image_description(prompt)

        # Generate music keywords based on the image description
        music_keywords = generate_music_keywords(image_description)

        # Return the music keywords as the API response
        return jsonify({"music_keywords": music_keywords}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)