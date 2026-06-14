from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

from vision import analyze_image_llm
from external_apis import query_usda_food, query_open_food_facts, get_mock_nutrition, search_external_foods
from coach import calculate_dynamic_tdee, adjust_nutritional_targets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Diet Coach - Artificial Intelligence Service")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CoachAdjustRequest(BaseModel):
    current_avg_weight: float
    prev_avg_weight: float
    avg_daily_calories_consumed: float
    weight: float
    goal: str  # "lose", "gain", "maintain"
    lift_weights: bool = False
    target_change_rate_per_week: float = 0.5
    default_tdee: float = 2500.0
    activity_level: float = 1.3
    has_enough_data: bool = False
    is_compliant: bool = False
    calorie_target: float = 2000.0

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/v1/vision/analyze")
async def analyze_meal(
    userId: str = Form(...),
    meal_image: UploadFile = File(...),
    api_key: str = Form("")
):
    """
    Main endpoint for meal image analysis.
    Steps:
    1. Image preprocessing + Object detection & weight estimation via LLM.
    2. Biochemical search in USDA / Open Food Facts for each identified food item.
    3. Aggregation of total nutritional values.
    """
    try:
        image_bytes = await meal_image.read()
        
        # 1. Select API key (use parameter or the one from .env)
        effective_key = api_key if api_key and api_key != "dummy" else os.getenv("OPENAI_API_KEY", "dummy")
        
        # LLM Analysis (OpenAI Vision or Mock)
        analysis_result = analyze_image_llm(image_bytes, effective_key)
        items = analysis_result.get("items", [])
        
        # 2. Nutrient search in databases
        detailed_items = []
        total_calories = 0.0
        total_protein = 0.0
        total_carbs = 0.0
        total_fat = 0.0
        
        for item in items:
            name = item.get("name", "").strip()
            weight = float(item.get("estimated_weight_g", 100))
            
            # Search in USDA or Open Food Facts
            # Simple decision rule: if the name contains specific words for packaged products, 
            # we use Open Food Facts, otherwise USDA
            is_packaged = any(word in name.lower() for word in ["bar", "shake", "cereal", "yogurt", "protein", "biscuit", "packaged"])
            
            if is_packaged:
                nutr_100g = query_open_food_facts(name)
            else:
                nutr_100g = query_usda_food(name, api_key=os.getenv("USDA_API_KEY", "DEMO_KEY"))
                
            # Calculate values relative to estimated weight
            factor = weight / 100.0
            item_calories = nutr_100g["calories"] * factor
            item_protein = nutr_100g["protein"] * factor
            item_carbs = nutr_100g["carbs"] * factor
            item_fat = nutr_100g["fat"] * factor
            
            total_calories += item_calories
            total_protein += item_protein
            total_carbs += item_carbs
            total_fat += item_fat
            
            detailed_items.append({
                "name": name,
                "weight_g": weight,
                "calories": round(item_calories, 1),
                "protein": round(item_protein, 1),
                "carbs": round(item_carbs, 1),
                "fat": round(item_fat, 1)
            })
            
        return {
            "status": "success",
            "userId": userId,
            "meal_summary": {
                "calories": round(total_calories, 1),
                "protein": round(total_protein, 1),
                "carbs": round(total_carbs, 1),
                "fat": round(total_fat, 1)
            },
            "items": detailed_items
        }
        
    except Exception as e:
        logger.error(f"Error in analysis endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/coach/adjust")
def adjust_targets(payload: CoachAdjustRequest):
    """
    Endpoint for recalculating the user's weekly calorie targets.
    """
    offset = -300.0 if payload.goal == "lose" else (300.0 if payload.goal == "gain" else 0.0)
    
    if not payload.has_enough_data:
        bmr = 22.0 * payload.weight
        new_tdee = bmr * payload.activity_level
        coach_status = "estimation"
        
        new_targets = adjust_nutritional_targets(
            tdee=new_tdee,
            weight=payload.weight,
            goal=payload.goal,
            lift_weights=payload.lift_weights
        )
    else:
        # Avem suficiente date
        actual_tdee = calculate_dynamic_tdee(
            current_avg_weight=payload.current_avg_weight,
            prev_avg_weight=payload.prev_avg_weight,
            avg_daily_calories_consumed=payload.avg_daily_calories_consumed,
            default_tdee=payload.default_tdee
        )
        
        if not payload.is_compliant:
            # Low compliance - do not update calorie targets
            coach_status = "low_compliance"
            tdee_for_calc = payload.calorie_target - offset
            new_tdee = actual_tdee
            new_targets = adjust_nutritional_targets(
                tdee=tdee_for_calc,
                weight=payload.weight,
                goal=payload.goal,
                lift_weights=payload.lift_weights
            )
        else:
            # Compliant & has data
            weight_change = payload.current_avg_weight - payload.prev_avg_weight
            
            # Check if on track
            on_track = False
            if payload.goal == "lose" and weight_change <= -0.2:
                on_track = True
            elif payload.goal == "gain" and weight_change >= 0.1:
                on_track = True
            elif payload.goal == "maintain" and abs(weight_change) <= 0.1:
                on_track = True
                
            if on_track:
                # Progress is on track - keep current targets
                coach_status = "on_track"
                tdee_for_calc = payload.calorie_target - offset
                new_tdee = actual_tdee
                new_targets = adjust_nutritional_targets(
                    tdee=tdee_for_calc,
                    weight=payload.weight,
                    goal=payload.goal,
                    lift_weights=payload.lift_weights
                )
            else:
                # Progress stalled - adjust targets based on adaptive TDEE
                coach_status = "stalled_adjusted"
                new_tdee = actual_tdee
                new_targets = adjust_nutritional_targets(
                    tdee=new_tdee,
                    weight=payload.weight,
                    goal=payload.goal,
                    lift_weights=payload.lift_weights
                )
                
    return {
        "status": "success",
        "tdee": round(new_tdee, 1),
        "coach_status": coach_status,
        "targets": new_targets
    }

@app.get("/v1/food/search")
def search_foods(query: str, api_key: str = ""):
    """
    Endpoint for live food search in USDA and Open Food Facts.
    """
    effective_key = api_key if api_key and api_key != "dummy" else os.getenv("USDA_API_KEY", "DEMO_KEY")
    results = search_external_foods(query, api_key=effective_key)
    return {"status": "success", "results": results}
