import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_dynamic_tdee(
    current_avg_weight: float,
    prev_avg_weight: float,
    avg_daily_calories_consumed: float,
    default_tdee: float = 2500.0
) -> float:
    """
    Calculates adaptive TDEE based on weight difference and actual caloric consumption.
    Principle: deficit/surplus of 7700 kcal = 1 kg body mass.
    """
    try:
        # Weight change in the last week (kg)
        weight_change = current_avg_weight - prev_avg_weight
        
        # Energy equivalent of the weight change (kcal)
        total_energy_delta = weight_change * 7700.0
        
        # Average daily energy imbalance (kcal/day)
        daily_energy_imbalance = total_energy_delta / 7.0
        
        # Real TDEE (actual active metabolism)
        # TDEE = Average daily consumption - Average daily imbalance
        # If weight decreased, daily_energy_imbalance is negative, so TDEE will be higher than consumption.
        actual_tdee = avg_daily_calories_consumed - daily_energy_imbalance
        
        # Safety limits for recalculated TDEE
        if actual_tdee < 1200:
            actual_tdee = 1200.0
        elif actual_tdee > 5000:
            actual_tdee = 5000.0
            
        return round(actual_tdee, 1)
    except Exception as e:
        logger.error(f"Error calculating adaptive TDEE: {e}")
        return default_tdee

def adjust_nutritional_targets(
    tdee: float,
    weight: float,
    goal: str,  # "lose", "gain", "maintain"
    lift_weights: bool = False,
    target_change_rate_per_week: float = 0.5, # kg/săptămână
) -> dict:
    """
    Adjusts daily calorie and macronutrient targets based on TDEE and goal.
    """
    # 1. Determine calorie deficit/surplus (exactly +-300 kcal from TDEE)
    calorie_adjustment = 0.0
    if goal == "lose":
        calorie_adjustment = -300.0
    elif goal == "gain":
        calorie_adjustment = 300.0
        
    target_calories = tdee + calorie_adjustment
    
    # Safety limits for daily calories
    if target_calories < 1200:
        target_calories = 1200
        
    # 2. Macronutrient distribution
    # Protein based on lift_weights and goal
    if lift_weights:
        if goal == "lose":
            protein_g = weight * 2.2
        else:
            protein_g = weight * 1.8
    else:
        if goal == "lose":
            protein_g = weight * 1.6
        else:
            protein_g = weight * 1.3
            
    # Capped at 200g protein
    if protein_g > 200.0:
        protein_g = 200.0
            
    protein_kcal = protein_g * 4.0
    
    # Carbohydrates and fats from remaining calories (50/50 split)
    remaining_kcal = target_calories - protein_kcal
    if remaining_kcal < 0.0:
        remaining_kcal = 0.0
        
    fat_kcal = remaining_kcal * 0.5
    carb_kcal = remaining_kcal * 0.5
    
    fat_g = fat_kcal / 9.0
    
    # Fat capped at 120g/day (shifting excess calories to carbs)
    if fat_g > 120.0:
        fat_g = 120.0
        fat_kcal = fat_g * 9.0
        carb_kcal = remaining_kcal - fat_kcal
        
    carbs_g = carb_kcal / 4.0
    
    # Fiber: 14g/1000kcal
    fiber_g = (target_calories / 1000.0) * 14.0
    
    # Sat. Fat: 10% of Calories
    satfat_kcal = target_calories * 0.10
    satfat_g = satfat_kcal / 9.0
        
    return {
        "calories": int(round(target_calories)),
        "protein": int(round(protein_g)),
        "carbs": int(round(carbs_g)),
        "fat": int(round(fat_g)),
        "fiber": int(round(fiber_g)),
        "satfat": int(round(satfat_g))
    }
