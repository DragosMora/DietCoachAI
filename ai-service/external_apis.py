import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock database of foods for fallback and local mock mode
MOCK_FOOD_DATABASE = {
    # --- Existing ---
    "chicken breast": {"calories": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6},
    "cooked rice": {"calories": 130, "protein": 2.7, "carbs": 28.0, "fat": 0.3},
    "olive oil": {"calories": 884, "protein": 0.0, "carbs": 0.0, "fat": 100.0},
    "scrambled eggs": {"calories": 143, "protein": 10.0, "carbs": 1.2, "fat": 11.0},
    "mixed salad": {"calories": 15, "protein": 1.0, "carbs": 3.0, "fat": 0.2},
    "banana": {"calories": 89, "protein": 1.1, "carbs": 23.0, "fat": 0.3},
    "protein shake": {"calories": 120, "protein": 24.0, "carbs": 3.0, "fat": 1.5},
    "salmon steak": {"calories": 208, "protein": 20.0, "carbs": 0.0, "fat": 13.0},
    "sweet potato": {"calories": 86, "protein": 1.6, "carbs": 20.0, "fat": 0.1},
    "avocado": {"calories": 160, "protein": 2.0, "carbs": 8.5, "fat": 14.7},
    
    # --- Seeds & Nuts (High Density Fallbacks) ---
    "sunflower seed": {"calories": 584, "protein": 20.8, "carbs": 20.0, "fat": 51.5},
    "pumpkin seed": {"calories": 559, "protein": 30.0, "carbs": 11.0, "fat": 49.0},
    "chia seed": {"calories": 486, "protein": 17.0, "carbs": 42.0, "fat": 31.0},
    "almond": {"calories": 579, "protein": 21.0, "carbs": 22.0, "fat": 50.0},
    "walnut": {"calories": 654, "protein": 15.0, "carbs": 14.0, "fat": 65.0},
    "cashew": {"calories": 553, "protein": 18.0, "carbs": 30.0, "fat": 44.0},
    "peanut": {"calories": 567, "protein": 26.0, "carbs": 16.0, "fat": 49.0},
    "peanut butter": {"calories": 596, "protein": 25.0, "carbs": 12.0, "fat": 46.0},
    "butter": {"calories": 717, "protein": 0.8, "carbs": 0.1, "fat": 81.0},
    
    # --- Fruits ---
    "apple": {"calories": 52, "protein": 0.3, "carbs": 14.0, "fat": 0.2},
    "kiwi": {"calories": 61, "protein": 1.1, "carbs": 15.0, "fat": 0.5},
    "apricot": {"calories": 48, "protein": 1.4, "carbs": 11.0, "fat": 0.4},
    "orange": {"calories": 47, "protein": 0.9, "carbs": 12.0, "fat": 0.1},
    "strawberries": {"calories": 32, "protein": 0.7, "carbs": 8.0, "fat": 0.3},
    "blueberries": {"calories": 57, "protein": 0.7, "carbs": 14.0, "fat": 0.3},
    "mango": {"calories": 60, "protein": 0.8, "carbs": 15.0, "fat": 0.4},
    
    # --- Common Staples & Vegetables ---
    "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7.0, "fat": 0.4},
    "spinach": {"calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4},
    "tomato": {"calories": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2},
    "cucumber": {"calories": 15, "protein": 0.7, "carbs": 3.6, "fat": 0.1},
    "carrot": {"calories": 41, "protein": 0.9, "carbs": 10.0, "fat": 0.2},
    "onion": {"calories": 40, "protein": 1.1, "carbs": 9.0, "fat": 0.1},
    "potato": {"calories": 77, "protein": 2.0, "carbs": 17.0, "fat": 0.1},
    "bread": {"calories": 265, "protein": 8.0, "carbs": 49.0, "fat": 3.0},
    "pasta": {"calories": 350, "protein": 12.0, "carbs": 71.0, "fat": 1.5},
    "rice": {"calories": 360, "protein": 7.0, "carbs": 79.0, "fat": 0.6},
    "oats": {"calories": 389, "protein": 16.9, "carbs": 66.0, "fat": 6.9},
}

def query_usda_food(query: str, api_key: str = "DEMO_KEY") -> dict:
    """
    Queries USDA FoodData Central for a raw ingredient.
    Returns nutritional details per 100g.
    """
    # Allow querying with DEMO_KEY or another valid key
    if not query or api_key == "":
        return get_mock_nutrition(query)
        
    try:
        url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "query": query,
            "pageSize": 1,
            "api_key": api_key
        }
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("foods"):
                food = data["foods"][0]
                nutrients = food.get("foodNutrients", [])
                
                # Search for nutrients by their standard name or ID
                result = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
                for n in nutrients:
                    n_id = n.get("nutrientId")
                    val = n.get("value", 0.0)
                    if n_id == 1008:
                        result["calories"] = val
                    elif n_id == 1003:
                        result["protein"] = val
                    elif n_id == 1005:
                        result["carbs"] = val
                    elif n_id == 1004:
                        result["fat"] = val
                return result
    except Exception as e:
        logger.error(f"Error querying USDA for '{query}': {e}")
        
    return get_mock_nutrition(query)

def query_open_food_facts(query: str) -> dict:
    """
    Queries Open Food Facts for a packaged product.
    """
    try:
        url = "https://world.openfoodfacts.org/cgi/search.pl"
        params = {
            "search_terms": query,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": 1
        }
        # Open Food Facts blocks generic/default User-Agents (like python-requests)
        headers = {"User-Agent": "DietCoachApp - WebApp - Version 2.0 - contact@dietcoach.ro"}
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("products"):
                product = data["products"][0]
                nutriments = product.get("nutriments", {})
                
                return {
                    "calories": float(nutriments.get("energy-kcal_100g", nutriments.get("energy_100g", 0.0))),
                    "protein": float(nutriments.get("proteins_100g", 0.0)),
                    "carbs": float(nutriments.get("carbohydrates_100g", 0.0)),
                    "fat": float(nutriments.get("fat_100g", 0.0))
                }
    except Exception as e:
        logger.error(f"Error querying Open Food Facts for '{query}': {e}")
        
    return get_mock_nutrition(query)

def get_mock_nutrition(query: str) -> dict:
    """
    Fallback/mock method that returns nutritional values based on the name.
    """
    q = query.lower()
    # Search for a partial match in our mock database
    for key, value in MOCK_FOOD_DATABASE.items():
        if key in q or q in key:
            return value
    # Generic default values
    return {"calories": 100.0, "protein": 5.0, "carbs": 15.0, "fat": 2.0}

def search_external_foods(query: str, api_key: str = "DEMO_KEY") -> list:
    """
    Search for food in USDA and Open Food Facts databases.
    Returns a list of objects compatible with the FoodItem structure on the frontend.
    """
    results = []
    
    # 1. Open Food Facts search (packaged products)
    try:
        url = "https://world.openfoodfacts.org/cgi/search.pl"
        params = {
            "search_terms": query,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": 15
        }
        headers = {"User-Agent": "DietCoachApp - WebApp - Version 2.0 - contact@dietcoach.ro"}
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            for p in data.get("products", []):
                name = p.get("product_name") or p.get("generic_name")
                if name:
                    nutr = p.get("nutriments", {})
                    results.append({
                        "name": f"{name} (OpenFoodFacts)",
                        "cals": float(nutr.get("energy-kcal_100g", nutr.get("energy_100g", 0.0))),
                        "p": float(nutr.get("proteins_100g", 0.0)),
                        "c": float(nutr.get("carbohydrates_100g", 0.0)),
                        "f": float(nutr.get("fat_100g", 0.0)),
                        "fiber": float(nutr.get("fiber_100g", 0.0)),
                        "satfat": float(nutr.get("saturated-fat_100g", 0.0))
                    })
    except Exception as e:
        logger.error(f"Error searching Open Food Facts for '{query}': {e}", exc_info=True)

    # 2. USDA search (raw ingredients)
    try:
        url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "query": query,
            "pageSize": 15,
            "api_key": api_key
        }
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            for f in data.get("foods", []):
                name = f.get("description")
                if name:
                    nutrients = f.get("foodNutrients", [])
                    cals = p = c = fat = fiber = satfat = 0.0
                    for n in nutrients:
                        n_id = n.get("nutrientId")
                        val = n.get("value", 0.0)
                        if n_id == 1008:
                            cals = val
                        elif n_id == 1003:
                            p = val
                        elif n_id == 1005:
                            c = val
                        elif n_id == 1004:
                            fat = val
                        elif n_id == 1079:
                            fiber = val
                        elif n_id == 1258:
                            satfat = val
                    results.append({
                        "name": f"{name} (USDA)",
                        "cals": cals,
                        "p": p,
                        "c": c,
                        "f": fat,
                        "fiber": fiber,
                        "satfat": satfat
                    })
    except Exception as e:
        logger.error(f"Error searching USDA for '{query}': {e}", exc_info=True)

    return results
