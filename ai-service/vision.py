import cv2
import numpy as np
import base64
import json
import logging
from openai import OpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# List of mock meals for simulation
MOCK_MEALS = [
    {
        "items": [
            {"name": "chicken breast", "estimated_weight_g": 200},
            {"name": "cooked rice", "estimated_weight_g": 150},
            {"name": "mixed salad", "estimated_weight_g": 100}
        ]
    },
    {
        "items": [
            {"name": "scrambled eggs", "estimated_weight_g": 150},
            {"name": "avocado", "estimated_weight_g": 80},
            {"name": "mixed salad", "estimated_weight_g": 50}
        ]
    },
    {
        "items": [
            {"name": "salmon steak", "estimated_weight_g": 180},
            {"name": "sweet potato", "estimated_weight_g": 150},
            {"name": "olive oil", "estimated_weight_g": 10}
        ]
    }
]

def preprocess_image(image_bytes: bytes) -> bytes:
    """
    Uses OpenCV to improve image quality (contrast adjustment, noise reduction).
    """
    try:
        # Decode image directly into memory
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            logger.warning("Image decoding failed. Using original bytes.")
            return image_bytes
            
        # 1. Conversion to YCrCb color space for lighting adjustment
        ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
        channels = list(cv2.split(ycrcb))
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to the luminance channel (Y)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        channels[0] = clahe.apply(channels[0])
        
        # Re-combine channels and convert back to BGR
        ycrcb = cv2.merge(channels)
        img_enhanced = cv2.cvtColor(ycrcb, cv2.COLOR_YCrCb2BGR)
        
        # 2. Noise reduction with a bilateral filter (preserves food edges)
        img_filtered = cv2.bilateralFilter(img_enhanced, d=9, sigmaColor=75, sigmaSpace=75)
        
        # Re-encode to JPEG format
        success, encoded_img = cv2.imencode(".jpg", img_filtered)
        if success:
            return encoded_img.tobytes()
    except Exception as e:
        logger.error(f"Error preprocessing image with OpenCV: {e}")
        
    return image_bytes

def analyze_image_llm(image_bytes: bytes, api_key: str) -> dict:
    """
    Sends the image to the OpenAI API (GPT-4o) with Structured Outputs constraints.
    In case of an invalid key / mock, returns a realistically simulated meal.
    """
    # Preprocessing with OpenCV
    processed_bytes = preprocess_image(image_bytes)
    
    # Check if we are in Mock mode (missing or invalid key)
    if not api_key or api_key.startswith("sk-or-v1-") or api_key == "dummy":
        logger.info("Mock mode enabled for visual analysis.")
        # Generate a simulated meal based on a simple hash of bytes for determinism with the same bytes
        idx = sum(processed_bytes[:100]) % len(MOCK_MEALS)
        return MOCK_MEALS[idx]
        
    try:
        # Convert to Base64
        base64_image = base64.b64encode(processed_bytes).decode('utf-8')
        
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" }, # Impunere JSON Schema
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Identify the separate food items in the image and estimate their weights in grams. "
                                "Return a structured JSON with a single key 'items', which points to an array of objects. "
                                "Each object in the array must contain exactly these two keys: "
                                "'name' (the descriptive name of the food, in english, lowercase) and "
                                "'estimated_weight_g' (the estimated weight in grams as an integer). "
                                "Do not include any other keys in the response."
                            )
                        },
                        {
                            "type": "image_url",
                            "url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        logger.error(f"Error calling OpenAI Vision: {e}")
        raise e
