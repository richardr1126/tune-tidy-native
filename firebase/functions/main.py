from firebase_functions import https_fn
from firebase_admin import initialize_app
from openai import OpenAI
import os
import base64
from io import BytesIO
from PIL import Image

client = OpenAI(
    organization="org-2BNSY7xwqH9NFydlFE8NAZtd",
    project=os.environ.get("OPENAI_PROJECT_ID"),
    api_key=os.environ.get("OPENAI_API_KEY"),
)

initialize_app()


def compress_image(base64_image: str, quality: int = 20) -> str:
    image_data = base64.b64decode(base64_image)
    image = Image.open(BytesIO(image_data))

    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    compressed_image_data = buffer.getvalue()
    compressed_base64_image = base64.b64encode(compressed_image_data).decode("utf-8")

    return compressed_base64_image


@https_fn.on_request()
def generate_image(req: https_fn.Request) -> https_fn.Response:
    try:
        # Extract prompt from the request
        req_json = req.get_json()
        model = req_json.get("model", "dall-e-3")  # Default model if not provided
        prompt = req_json.get(
            "prompt", "A cute baby sea otter"
        )  # Default prompt if not provided

        # Generate image using OpenAI API
        response = client.images.generate(
            model=model,
            prompt=prompt,
            n=1,
            size="1024x1024",
            response_format="b64_json",
        )

        # Extract the generated image base64 data
        base64_image = response.data[0].b64_json

        # Compress the image
        compressed_base64_image = compress_image(
            base64_image, quality=20
        )  # Adjust quality as needed

        # Return the compressed base64 image as JSON response
        return https_fn.Response(compressed_base64_image, status=200)

    except Exception as e:
        # Handle exceptions and return error message
        return https_fn.Response(str(e), status=500)


@https_fn.on_request()
def generate_prompt(req: https_fn.Request) -> https_fn.Response:
    try:
        # Extract artist names from the request
        req_json = req.get_json()
        model = req_json.get("model", "gpt-4o")  # Default model if not provided
        artists = req_json.get("artists", [])

        if not artists:
            return https_fn.Response("No artists provided", status=400)

        # Create a description of the playlist from the artists
        artist_descriptions = [artist for artist in artists]
        playlist_description = "Playlist featuring: " + ", ".join(artist_descriptions)

        # Generate a prompt using OpenAI API
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI playlist cover art prompt engineering assistant. Generated art should not contain text. Output in a json object with the key 'prompt' and the value as the generated prompt.",
                },
                {
                    "role": "user",
                    "content": f"Generate a creative and visually descriptive prompt for a playlist cover art based on artists:\n\n{playlist_description}",
                },
            ],
            response_format={"type": "json_object"},
        )

        generated_prompt = completion.choices[0].message.content.strip()

        # Return the generated prompt as JSON response
        return https_fn.Response(generated_prompt, status=200)

    except Exception as e:
        # Handle exceptions and return error message
        return https_fn.Response(str(e), status=500)
