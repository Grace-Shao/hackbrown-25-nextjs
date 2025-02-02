from flask import Flask, request, jsonify
import boto3
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
from flask_cors import CORS

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

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

client = OpenAI(api_key=openai_api_key)


def analyze_image_with_rekognition(image_bytes):
    logger.info("Analyzing image with AWS Rekognition")
    response = rekognition_client.detect_labels(
        Image={"Bytes": image_bytes}, MaxLabels=10, MinConfidence=70
    )
    logger.info(f"Rekognition response: {response}")
    return response["Labels"]


def generate_prompt(labels):
    logger.info("Generating prompt from labels")
    label_descriptions = [
        f"{label['Name']} ({label['Confidence']:.2f}%)" for label in labels
    ]
    label_names = ", ".join(label["Name"].lower() for label in labels)

    prompt = (
        f"The following labels were detected in an image: {', '.join(label_descriptions)}. "
        "Based on these labels, describe the image without mention label statistics, describe the setting, time of day, season, "
        "any activities or events, and emotions conveyed. Be striaghtforward. If you see night, or nightlife label. Describe this is a party and EDMs"
    )
    logger.info(f"Generated prompt: {prompt}")
    return prompt


def generate_image_description(prompt):
    logger.info("Generating image description")
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that generates image descriptions.",
            },
            {"role": "user", "content": prompt},
        ],
    )
    logger.info(f"OpenAI response: {response}")
    return response.choices[0].message.content


def generate_music_keywords(image_description):
    logger.info("Generating music keywords")
    keyword_prompt = (
        f"The following is a detailed description of an image: {image_description}. "
        "Based on this description, 1 music genre and 1 keyword suitable for a Spotify search. "
        "Output only the keywords separated by spaces, without any extra text or punctuation."
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that suggests music genres and keywords.",
            },
            {"role": "user", "content": keyword_prompt},
        ],
    )

    if not response.choices[0].message.content:
        logger.info("No keywords generated")
        return "no keywords generated"

    logger.info(f"Generated keywords: {response.choices[0].message.content.strip()}")
    return response.choices[0].message.content.strip()


@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    try:
        logger.info("Received analyze-image request")
        if "file" not in request.files:
            logger.error("No file provided in request")
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        logger.info(f"Processing file: {file.filename}")

        image_bytes = file.read()

        labels = analyze_image_with_rekognition(image_bytes)
        prompt = generate_prompt(labels)
        image_description = generate_image_description(prompt)
        music_keywords = generate_music_keywords(image_description)

        logger.info("Successfully processed image and generated keywords")
        return jsonify({"music_keywords": music_keywords}), 200

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
