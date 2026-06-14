// ---- LOCAL FOOD DATABASE (All values per 100g) ----
const localFoodDB = [
    // --- Lean Proteins & Meats ---
    { name: "Chicken Breast (Raw)", cals: 120, p: 22.5, c: 0, f: 2.6, fiber: 0, satfat: 0.6 },
    { name: "Chicken Thigh (Skinless, Raw)", cals: 120, p: 19.0, c: 0, f: 4.0, fiber: 0, satfat: 1.0 },
    { name: "Chicken Sausages (Raw)", cals: 145, p: 18.0, c: 2.5, f: 7.0, fiber: 0, satfat: 2.0 },
    { name: "Turkey Breast (Raw)", cals: 104, p: 22.0, c: 0, f: 1.6, fiber: 0, satfat: 0.5 },
    { name: "Turkey Mince (Extra Lean 2%, Raw)", cals: 112, p: 24.0, c: 0, f: 2.0, fiber: 0, satfat: 0.5 },
    { name: "Turkey Mince (Lean 5%, Raw)", cals: 147, p: 24.0, c: 0, f: 5.0, fiber: 0, satfat: 1.5 },
    { name: "Beef Sirloin (Trimmed, Raw)", cals: 155, p: 26.0, c: 0, f: 5.0, fiber: 0, satfat: 2.0 },
    { name: "Beef Fillet (Raw)", cals: 145, p: 21.0, c: 0, f: 6.0, fiber: 0, satfat: 2.5 },
    { name: "Beef Mince (5% Fat, Raw)", cals: 137, p: 21.4, c: 0, f: 5.0, fiber: 0, satfat: 2.0 },
    { name: "Beef Mince (10% Fat, Raw)", cals: 176, p: 20.0, c: 0, f: 10.0, fiber: 0, satfat: 4.5 },
    { name: "Pork Loin (Trimmed, Raw)", cals: 143, p: 26.0, c: 0, f: 4.0, fiber: 0, satfat: 1.4 },
    { name: "Pork Tenderloin (Raw)", cals: 120, p: 21.0, c: 0, f: 3.5, fiber: 0, satfat: 1.2 },
    { name: "Lean Pork Mince (5% Fat, Raw)", cals: 135, p: 21.0, c: 0, f: 5.0, fiber: 0, satfat: 1.8 },
    { name: "Venison (Raw)", cals: 120, p: 23.0, c: 0, f: 2.5, fiber: 0, satfat: 1.0 },
    { name: "Bacon (Smoked, Raw)", cals: 310, p: 14.0, c: 1.0, f: 28.0, fiber: 0, satfat: 10.0 },

    // --- Seafood ---
    { name: "Cod Fillet (Raw)", cals: 82, p: 18.0, c: 0, f: 0.7, fiber: 0, satfat: 0.1 },
    { name: "Salmon Fillet (Raw)", cals: 208, p: 20.0, c: 0, f: 13.0, fiber: 0, satfat: 3.0 },
    { name: "Tuna (Canned in Spring Water)", cals: 86, p: 19.5, c: 0, f: 0.5, fiber: 0, satfat: 0.1 },
    { name: "Tuna (Canned in Brine)", cals: 89, p: 19.5, c: 0, f: 0.8, fiber: 0, satfat: 0.1 },
    { name: "Tuna (Canned in Sunflower Oil)", cals: 198, p: 29.0, c: 0, f: 8.0, fiber: 0, satfat: 1.0 },
    { name: "Tuna Steak (Raw)", cals: 130, p: 28.0, c: 0, f: 1.0, fiber: 0, satfat: 0.3 },
    { name: "Shrimp/Prawns (Raw)", cals: 71, p: 14.0, c: 1.0, f: 1.0, fiber: 0, satfat: 0.2 },
    { name: "Sea Bass (Raw)", cals: 97, p: 18.0, c: 0, f: 2.5, fiber: 0, satfat: 0.6 },
    { name: "Tilapia (Raw)", cals: 96, p: 20.0, c: 0, f: 1.7, fiber: 0, satfat: 0.6 },
    { name: "Mackerel (Raw)", cals: 205, p: 19.0, c: 0, f: 14.0, fiber: 0, satfat: 3.3 },

    // --- Eggs & Dairy ---
    { name: "Whole Egg (Raw)", cals: 143, p: 12.6, c: 0.7, f: 9.5, fiber: 0, satfat: 3.1 },
    { name: "Liquid Egg Whites", cals: 48, p: 10.5, c: 0.8, f: 0.2, fiber: 0, satfat: 0.0 },
    { name: "Fage Total 0% Greek Yogurt", cals: 54, p: 10.3, c: 3.0, f: 0.0, fiber: 0, satfat: 0.0 },
    { name: "Fage Total 5% Greek Yogurt", cals: 95, p: 9.0, c: 3.0, f: 5.0, fiber: 0, satfat: 3.5 },
    { name: "Cottage Cheese (Fat Free)", cals: 65, p: 11.5, c: 4.0, f: 0.2, fiber: 0, satfat: 0.1 },
    { name: "Cottage Cheese (Low Fat)", cals: 72, p: 12.0, c: 3.0, f: 1.0, fiber: 0, satfat: 0.6 },
    { name: "Quark (0% Fat)", cals: 65, p: 12.0, c: 3.5, f: 0.2, fiber: 0, satfat: 0.1 },
    { name: "Skyr (Natural, 0% Fat)", cals: 62, p: 11.0, c: 3.5, f: 0.2, fiber: 0, satfat: 0.1 },
    { name: "Skimmed Milk", cals: 35, p: 3.4, c: 5.0, f: 0.1, fiber: 0, satfat: 0.1 },
    { name: "Semi-Skimmed Milk", cals: 47, p: 3.4, c: 4.8, f: 1.7, fiber: 0, satfat: 1.1 },
    { name: "Whole Milk", cals: 64, p: 3.2, c: 4.7, f: 3.7, fiber: 0, satfat: 2.3 },
    { name: "Soy Milk (Unsweetened)", cals: 33, p: 3.3, c: 0.2, f: 1.8, fiber: 0.6, satfat: 0.3 },
    { name: "Almond Milk (Unsweetened)", cals: 13, p: 0.4, c: 0.1, f: 1.1, fiber: 0.4, satfat: 0.1 },
    { name: "Cheddar Cheese", cals: 402, p: 25.0, c: 1.3, f: 33.0, fiber: 0, satfat: 21.0 },
    { name: "Parmesan Cheese", cals: 431, p: 38.0, c: 4.0, f: 29.0, fiber: 0, satfat: 18.0 },
    { name: "Mozzarella (Light)", cals: 157, p: 18.0, c: 1.0, f: 9.0, fiber: 0, satfat: 6.0 },

    // --- Grains, Starches & Carbs ---
    { name: "White Rice (Dry)", cals: 360, p: 7.0, c: 79.0, f: 0.6, fiber: 1.3, satfat: 0.2 },
    { name: "Brown Rice (Dry)", cals: 365, p: 7.5, c: 76.0, f: 2.7, fiber: 3.5, satfat: 0.5 },
    { name: "Basmati Rice (Dry)", cals: 350, p: 8.5, c: 77.0, f: 0.7, fiber: 1.5, satfat: 0.2 },
    { name: "Cream of Rice (Dry)", cals: 355, p: 6.5, c: 80.0, f: 0.8, fiber: 1.0, satfat: 0.2 },
    { name: "Quinoa (Dry)", cals: 368, p: 14.0, c: 64.0, f: 6.0, fiber: 7.0, satfat: 0.7 },
    { name: "Pasta (Dry)", cals: 350, p: 12.0, c: 71.0, f: 1.5, fiber: 3.0, satfat: 0.3 },
    { name: "Whole Wheat Pasta (Dry)", cals: 340, p: 13.5, c: 65.0, f: 2.0, fiber: 8.0, satfat: 0.4 },
    { name: "Oats (Dry)", cals: 389, p: 16.9, c: 66.0, f: 6.9, fiber: 10.6, satfat: 1.2 },
    { name: "Oat Flour (Dry)", cals: 404, p: 14.7, c: 65.7, f: 9.1, fiber: 6.5, satfat: 1.6 },
    { name: "Potato (Raw)", cals: 77, p: 2.0, c: 17.0, f: 0.1, fiber: 2.2, satfat: 0.0 },
    { name: "Sweet Potato (Raw)", cals: 86, p: 1.6, c: 20.0, f: 0.1, fiber: 3.0, satfat: 0.0 },
    { name: "Bulgur Wheat (Dry)", cals: 342, p: 12.3, c: 75.9, f: 1.3, fiber: 18.3, satfat: 0.2 },
    { name: "Bread (White)", cals: 265, p: 8.0, c: 49.0, f: 3.0, fiber: 2.5, satfat: 0.6 },
    { name: "Bread (Wholemeal)", cals: 245, p: 10.0, c: 42.0, f: 2.5, fiber: 6.5, satfat: 0.5 },
    { name: "Bagel (Plain)", cals: 250, p: 10.0, c: 48.0, f: 1.5, fiber: 2.0, satfat: 0.3 },
    { name: "Rice Cakes (Plain)", cals: 387, p: 8.2, c: 81.5, f: 2.8, fiber: 4.1, satfat: 0.6 },
    { name: "Corn Flakes", cals: 378, p: 7.0, c: 84.0, f: 0.9, fiber: 3.0, satfat: 0.2 },
    { name: "Bran Flakes", cals: 359, p: 10.0, c: 68.0, f: 2.0, fiber: 14.0, satfat: 0.4 },

    // --- Legumes & Plant Proteins ---
    { name: "Red Lentils (Dry)", cals: 353, p: 25.0, c: 60.0, f: 1.0, fiber: 30.0, satfat: 0.2 },
    { name: "Chickpeas (Canned)", cals: 139, p: 7.0, c: 20.0, f: 2.5, fiber: 6.0, satfat: 0.3 },
    { name: "Black Beans (Canned)", cals: 114, p: 7.6, c: 16.0, f: 0.5, fiber: 7.5, satfat: 0.1 },
    { name: "Kidney Beans (Canned)", cals: 103, p: 7.0, c: 14.0, f: 0.5, fiber: 6.4, satfat: 0.1 },
    { name: "Tofu (Firm)", cals: 144, p: 15.8, c: 2.8, f: 8.7, fiber: 2.3, satfat: 1.3 },
    { name: "Tempeh", cals: 193, p: 19.0, c: 9.0, f: 11.0, fiber: 3.0, satfat: 2.2 },
    { name: "Soy Chunks (Textured Soy Protein, Dry)", cals: 352, p: 52.0, c: 30.0, f: 1.0, fiber: 17.0, satfat: 0.2 },
    { name: "Edamame Beans", cals: 122, p: 11.0, c: 10.0, f: 5.0, fiber: 5.0, satfat: 0.6 },
    { name: "Hummus", cals: 166, p: 8.0, c: 14.0, f: 10.0, fiber: 6.0, satfat: 1.4 },

    // --- Fruits (Raw) ---
    { name: "Banana (Raw)", cals: 89, p: 1.1, c: 23.0, f: 0.3, fiber: 2.6, satfat: 0.1 },
    { name: "Apple (Raw)", cals: 52, p: 0.3, c: 14.0, f: 0.2, fiber: 2.4, satfat: 0.0 },
    { name: "Orange (Raw)", cals: 47, p: 0.9, c: 12.0, f: 0.1, fiber: 2.4, satfat: 0.0 },
    { name: "Blueberries (Raw/Frozen)", cals: 57, p: 0.7, c: 14.0, f: 0.3, fiber: 2.4, satfat: 0.0 },
    { name: "Strawberries (Raw/Frozen)", cals: 32, p: 0.7, c: 8.0, f: 0.3, fiber: 2.0, satfat: 0.0 },
    { name: "Raspberries (Raw/Frozen)", cals: 52, p: 1.2, c: 12.0, f: 0.7, fiber: 6.5, satfat: 0.0 },
    { name: "Mango (Raw)", cals: 60, p: 0.8, c: 15.0, f: 0.4, fiber: 1.6, satfat: 0.1 },
    { name: "Pineapple (Raw)", cals: 50, p: 0.5, c: 13.0, f: 0.1, fiber: 1.4, satfat: 0.0 },
    { name: "Grapes (Raw)", cals: 69, p: 0.7, c: 18.0, f: 0.2, fiber: 0.9, satfat: 0.1 },
    { name: "Peach (Raw)", cals: 39, p: 0.9, c: 9.5, f: 0.3, fiber: 1.5, satfat: 0.0 },
    { name: "Kiwi Fruit (Raw)", cals: 61, p: 1.1, c: 15.0, f: 0.5, fiber: 3.0, satfat: 0.0 },
    { name: "Watermelon (Raw)", cals: 30, p: 0.6, c: 8.0, f: 0.2, fiber: 0.4, satfat: 0.0 },
    { name: "Avocado (Raw)", cals: 160, p: 2.0, c: 8.5, f: 14.7, fiber: 6.7, satfat: 2.1 },

    // --- Vegetables (Raw) ---
    { name: "Broccoli (Raw)", cals: 34, p: 2.8, c: 7.0, f: 0.4, fiber: 2.6, satfat: 0.1 },
    { name: "Spinach (Raw)", cals: 23, p: 2.9, c: 3.6, f: 0.4, fiber: 2.2, satfat: 0.1 },
    { name: "Kale (Raw)", cals: 49, p: 4.3, c: 9.0, f: 0.9, fiber: 3.6, satfat: 0.1 },
    { name: "Asparagus (Raw)", cals: 20, p: 2.2, c: 3.9, f: 0.1, fiber: 2.1, satfat: 0.0 },
    { name: "Zucchini/Courgette (Raw)", cals: 17, p: 1.2, c: 3.1, f: 0.3, fiber: 1.0, satfat: 0.1 },
    { name: "Cucumber (Raw)", cals: 15, p: 0.7, c: 3.6, f: 0.1, fiber: 0.5, satfat: 0.0 },
    { name: "Tomato (Raw)", cals: 18, p: 0.9, c: 3.9, f: 0.2, fiber: 1.2, satfat: 0.0 },
    { name: "Bell Pepper (Raw)", cals: 31, p: 1.0, c: 6.0, f: 0.3, fiber: 2.1, satfat: 0.1 },
    { name: "Carrots (Raw)", cals: 41, p: 0.9, c: 10.0, f: 0.2, fiber: 2.8, satfat: 0.0 },
    { name: "Cauliflower (Raw)", cals: 25, p: 1.9, c: 5.0, f: 0.3, fiber: 2.0, satfat: 0.1 },
    { name: "Green Beans (Raw)", cals: 31, p: 1.8, c: 7.0, f: 0.1, fiber: 3.4, satfat: 0.0 },
    { name: "Brussels Sprouts (Raw)", cals: 43, p: 3.4, c: 9.0, f: 0.3, fiber: 3.8, satfat: 0.1 },
    { name: "Mushrooms (Raw)", cals: 22, p: 3.1, c: 3.3, f: 0.3, fiber: 1.0, satfat: 0.1 },
    { name: "Onion (Raw)", cals: 40, p: 1.1, c: 9.0, f: 0.1, fiber: 1.7, satfat: 0.0 },

    // --- Nuts & Seeds ---
    { name: "Almonds", cals: 579, p: 21.0, c: 22.0, f: 50.0, fiber: 12.5, satfat: 3.8 },
    { name: "Walnuts", cals: 654, p: 15.0, c: 14.0, f: 65.0, fiber: 6.7, satfat: 6.1 },
    { name: "Cashews", cals: 553, p: 18.0, c: 30.0, f: 44.0, fiber: 3.3, satfat: 7.8 },
    { name: "Peanuts", cals: 567, p: 26.0, c: 16.0, f: 49.0, fiber: 8.5, satfat: 6.8 },
    { name: "Chia Seeds", cals: 486, p: 17.0, c: 42.0, f: 31.0, fiber: 34.0, satfat: 3.3 },
    { name: "Flax Seeds", cals: 534, p: 18.0, c: 29.0, f: 42.0, fiber: 27.0, satfat: 3.7 },
    { name: "Pumpkin Seeds", cals: 559, p: 30.0, c: 11.0, f: 49.0, fiber: 6.0, satfat: 8.7 },
    { name: "Peanut Butter (100% Peanuts)", cals: 596, p: 25.0, c: 12.0, f: 46.0, fiber: 6.0, satfat: 8.0 },
    { name: "Almond Butter (100% Almonds)", cals: 614, p: 21.0, c: 19.0, f: 56.0, fiber: 10.0, satfat: 4.2 },
    { name: "PB2 (Defatted Peanut Powder)", cals: 416, p: 50.0, c: 33.0, f: 12.0, fiber: 16.0, satfat: 2.0 },

    // --- Oils, Sauces & Condiments ---
    { name: "Olive Oil", cals: 884, p: 0.0, c: 0.0, f: 100.0, fiber: 0, satfat: 14.0 },
    { name: "Coconut Oil", cals: 862, p: 0.0, c: 0.0, f: 100.0, fiber: 0, satfat: 87.0 },
    { name: "Butter", cals: 717, p: 0.8, c: 0.1, f: 81.0, fiber: 0, satfat: 51.0 },
    { name: "Mayonnaise (Standard)", cals: 680, p: 1.0, c: 2.0, f: 75.0, fiber: 0, satfat: 12.0 },
    { name: "Light Mayo", cals: 264, p: 0.6, c: 14.0, f: 23.0, fiber: 0, satfat: 2.0 },
    { name: "Ketchup", cals: 101, p: 1.0, c: 23.0, f: 0.1, fiber: 0.3, satfat: 0.0 },
    { name: "Zero Sugar Ketchup", cals: 41, p: 1.5, c: 8.0, f: 0.1, fiber: 1.0, satfat: 0.0 },
    { name: "Sriracha Sauce", cals: 84, p: 1.5, c: 18.0, f: 0.5, fiber: 1.5, satfat: 0.1 },
    { name: "Soy Sauce", cals: 53, p: 8.0, c: 5.0, f: 0.1, fiber: 0.8, satfat: 0.0 },
    { name: "BBQ Sauce", cals: 167, p: 1.0, c: 41.0, f: 0.2, fiber: 0.6, satfat: 0.0 },
    { name: "Zero Calorie Syrup", cals: 5, p: 0.0, c: 1.0, f: 0.0, fiber: 0, satfat: 0.0 },

    // --- Supplements & Sports Nutrition ---
    { name: "Whey Protein Concentrate (80%)", cals: 395, p: 80.0, c: 6.0, f: 5.5, fiber: 0, satfat: 3.5 },
    { name: "Whey Protein Isolate (90%)", cals: 370, p: 90.0, c: 1.5, f: 1.0, fiber: 0, satfat: 0.5 },
    { name: "Micellar Casein Protein", cals: 360, p: 82.0, c: 5.0, f: 1.5, fiber: 0, satfat: 1.0 },
    { name: "Clear Whey Isolate", cals: 340, p: 85.0, c: 2.0, f: 0.1, fiber: 0, satfat: 0.1 },
    { name: "Vegan Protein Blend (Pea/Soy)", cals: 380, p: 75.0, c: 5.0, f: 6.0, fiber: 3.0, satfat: 1.5 },

    // --- Sweets, Treats & Snacks ---
    { name: "Snickers Bar", cals: 488, p: 8.6, c: 59.3, f: 23.8, fiber: 1.4, satfat: 8.3 },
    { name: "Milk Chocolate", cals: 535, p: 7.6, c: 59.4, f: 29.7, fiber: 3.4, satfat: 18.5 },
    { name: "Dark Chocolate (70%+)", cals: 598, p: 7.8, c: 45.9, f: 42.6, fiber: 10.9, satfat: 25.0 },
    { name: "Ice Cream (Vanilla, Dairy)", cals: 207, p: 3.5, c: 24.0, f: 11.0, fiber: 0.7, satfat: 6.8 },
    { name: "Low Calorie Ice Cream (e.g. Halo Top)", cals: 130, p: 8.5, c: 18.0, f: 3.5, fiber: 5.0, satfat: 2.0 },
    { name: "Protein Bar (Generic)", cals: 360, p: 33.0, c: 35.0, f: 11.0, fiber: 10.0, satfat: 5.0 },
    { name: "Popcorn (Air Popped)", cals: 387, p: 13.0, c: 78.0, f: 4.5, fiber: 14.5, satfat: 0.6 },
    { name: "Honey", cals: 304, p: 0.3, c: 82.4, f: 0.0, fiber: 0.2, satfat: 0.0 }
];

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STATE & STORAGE ENGINE
    // ==========================================
    let appData = JSON.parse(localStorage.getItem('tdee_data')) || {};
    let appTargets = JSON.parse(localStorage.getItem('tdee_targets')) || null;
    let appUserSettings = JSON.parse(localStorage.getItem('tdee_user_settings')) || {
        name: "",
        age: null,
        sex: "",
        weight: null,
        bf: null,
        lbm: null,
        fm: null,
        mealCount: 4,
        lastQuantities: {},
        notifEnabled: false,
        foodNotifTime: "20:00",
        weightNotifTime: "08:00",
        coachEnabled: false,
        isMetric: true,
        wizardGoal: null,
        wizardCutRate: 0.7,
        wizardBulkRate: 1.0,
        wizardWeight: null,
        coachHistory: [],
        coachLastApplied: null,
        coachLastAdvice: []
    };
    
    let selectedDate = new Date();
    
    function getFormattedDate(dateObj) {
        // Use LOCAL date parts to avoid UTC offset shifting the day
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    
    let currentDateStr = getFormattedDate(selectedDate);
    
    function ensureDateExists(dateStr) {
        if (!appData[dateStr]) {
            appData[dateStr] = { weight: null, foods: [] };
        }
    }
    
    // Migration: Cleanup bad keys from previous bad excel imports
    let migrated = false;
    Object.keys(appData).forEach(k => {
        if (k.match(/^2\d-\d{2}-\d{2}$/)) { // matches 25-04-05
            const correctKey = `20${k}`;
            if (!appData[correctKey]) {
                appData[correctKey] = appData[k];
            } else {
                // merge
                if (appData[k].weight) appData[correctKey].weight = appData[k].weight;
                if (appData[k].foods && appData[k].foods.length > 0) {
                    appData[correctKey].foods = appData[k].foods;
                }
                appData[correctKey].macroOverwritten = appData[k].macroOverwritten || appData[correctKey].macroOverwritten;
                appData[correctKey].weightOverwritten = appData[k].weightOverwritten || appData[correctKey].weightOverwritten;
            }
            delete appData[k];
            migrated = true;
        }
    });
    if (migrated) localStorage.setItem('tdee_data', JSON.stringify(appData));
    
    function saveData() {
        localStorage.setItem('tdee_data', JSON.stringify(appData));
        localStorage.setItem('tdee_targets', JSON.stringify(appTargets));
        localStorage.setItem('tdee_user_settings', JSON.stringify(appUserSettings));
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 2500);
    }

    // ==========================================
    // 2. BOTTOM NAVIGATION & TABS
    // ==========================================
    const tabItems = document.querySelectorAll('.tab-item');
    const sections = document.querySelectorAll('.app-view');

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            // Intercept Coach tab if disabled
            if (target === 'view-coach' && !appUserSettings.coachEnabled) {
                document.getElementById('modal-coach-disabled').classList.remove('hidden');
                return;
            }

            tabItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(sec => {
                sec.classList.remove('active-view');
                sec.classList.add('hidden');
            });
            
            const targetView = document.getElementById(target);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('active-view');
            }

            if (target === 'view-diary') renderDiary();
            if (target === 'view-weight') { renderWeightView(); updateChart(30); }
            if (target === 'view-settings') renderSettings();
            if (target === 'view-coach') renderCoachView();
        });
    });

    // Coach Disabled Modal
    document.getElementById('modal-coach-disabled-close').addEventListener('click', () => {
        document.getElementById('modal-coach-disabled').classList.add('hidden');
    });
    document.getElementById('modal-coach-disabled-go-settings').addEventListener('click', () => {
        document.getElementById('modal-coach-disabled').classList.add('hidden');
        // Switch to settings tab
        tabItems.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-target="view-settings"]').classList.add('active');
        document.querySelectorAll('.app-view').forEach(s => { s.classList.remove('active-view'); s.classList.add('hidden'); });
        const sv = document.getElementById('view-settings');
        sv.classList.remove('hidden'); sv.classList.add('active-view');
        renderSettings();
    });


    function getMealOptionsHTML() {
        let html = '';
        for (let i = 1; i <= appUserSettings.mealCount; i++) {
            html += `<option value="Meal ${i}">Meal ${i}</option>`;
        }
        return html;
    }

    // ==========================================
    // 3. DIARY & FOOD LOGIC
    // ==========================================
    const diaryDateHeader = document.getElementById('diary-current-date');
    const diaryFoodList = document.getElementById('diary-food-list');
    
    document.getElementById('diary-prev-day').addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() - 1);
        currentDateStr = getFormattedDate(selectedDate);
        renderDiary();
    });
    
    document.getElementById('diary-next-day').addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() + 1);
        currentDateStr = getFormattedDate(selectedDate);
        renderDiary();
    });

    function renderDiary() {
        const todayStr = getFormattedDate(new Date());

        // Auto-snap: if the user was viewing "today" but the day has rolled over, update to real today
        if (currentDateStr !== todayStr && currentDateStr === getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)))) {
            // they were on "yesterday" which WAS today — don't auto-snap, let them stay
        } else if (currentDateStr < todayStr && currentDateStr === getFormattedDate(selectedDate)) {
            // selectedDate is stale but hasn't been deliberately navigated — snap to today
            const prevToday = getFormattedDate(new Date(new Date().getTime() - 86400000));
            if (currentDateStr === prevToday) {
                // The user was on today, midnight rolled — snap forward
                selectedDate = new Date();
                currentDateStr = todayStr;
            }
        }

        let dateHtml = currentDateStr === todayStr
            ? 'Today'
            : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });


        ensureDateExists(currentDateStr);
        const dayData = appData[currentDateStr];
        
        diaryDateHeader.innerHTML = dateHtml;
        
        const loggedFoodsHeader = document.getElementById('logged-foods-header');
        if (loggedFoodsHeader) {
            if (dayData && dayData.macroOverwritten && dayData.foods.length > 0) {
                loggedFoodsHeader.innerHTML = `<h3>Logged Foods <span style="font-size:0.65rem; background: var(--text-primary); color: var(--bg-main); padding: 0.15rem 0.4rem; border-radius: 4px; vertical-align: middle; margin-left: 0.5rem; letter-spacing: 0.5px;">OVERWRITE</span></h3>`;
            } else {
                loggedFoodsHeader.innerHTML = `<h3>Logged Foods</h3>`;
            }
        }
        
        let sumCals = 0, sumP = 0, sumC = 0, sumF = 0, sumFiber = 0, sumSatFat = 0;
        
        const container = document.getElementById('meal-groups-container');
        container.innerHTML = '';

        // Always show meals up to appUserSettings.mealCount, plus any foods in higher meals if they exist
        const maxMealNum = Math.max(appUserSettings.mealCount, ...dayData.foods.map(f => parseInt(f.meal?.split(' ')[1] || 0)));
        
        for (let i = 1; i <= maxMealNum; i++) {
            const mealName = `Meal ${i}`;
            const mealFoods = dayData.foods.filter(f => (f.meal || 'Meal 1') === mealName);
            
            let mCals = 0, mP = 0, mC = 0, mF = 0;
            mealFoods.forEach(f => { mCals += f.cals; mP += f.p; mC += f.c; mF += f.f; });
            
            const mealDiv = document.createElement('div');
            mealDiv.className = 'meal-group';
            mealDiv.innerHTML = `
                <div class="meal-header" style="flex-wrap: wrap;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <h4>${mealName}</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="material-icons btn-meal-add" style="cursor:pointer;" data-meal="${mealName}">add_circle_outline</span>
                            <span class="material-icons btn-meal-more" style="cursor:pointer; color:var(--text-secondary);" data-meal="${mealName}">more_vert</span>
                        </div>
                    </div>
                    ${mealFoods.length > 0 ? `<div style="width: 100%; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem; font-weight: 500;">
                        ${Math.round(mCals)} kcal • P: ${Math.round(mP)}g • C: ${Math.round(mC)}g • F: ${Math.round(mF)}g
                    </div>` : ''}
                </div>
                <ul class="food-log-list"></ul>
            `;
            
            const list = mealDiv.querySelector('ul');
            if (mealFoods.length === 0) {
                list.innerHTML = '<li class="empty-state" style="padding: 0.5rem 0.75rem; font-size: 0.8rem; opacity: 0.6;">No entries for this meal.</li>';
            } else {
                mealFoods.forEach(food => {
                    sumCals += food.cals; sumP += food.p; sumC += food.c; sumF += food.f;
                    sumFiber += food.fiber || 0; sumSatFat += food.satfat || 0;
                    
                    const foodIdx = dayData.foods.indexOf(food);
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="flex-between">
                            <strong style="font-size:0.95rem;">${food.name}</strong>
                            <strong style="color:var(--text-primary);">${Math.round(food.cals)} kcal</strong>
                        </div>
                        <div class="food-meta">
                            <span>${food.amount}${typeof food.amount === 'number' ? 'g' : ''}</span>
                            <span>P: ${Math.round(food.p)}g | C: ${Math.round(food.c)}g | F: ${Math.round(food.f)}g</span>
                            <span class="material-icons" style="margin-left:auto; font-size:16px; color:#f87171; cursor:pointer;" data-index="${foodIdx}">delete</span>
                        </div>
                    `;
                    li.querySelector('.material-icons').addEventListener('click', () => {
                        dayData.foods.splice(foodIdx, 1);
                        saveData(); renderDiary();
                    });
                    list.appendChild(li);
                });
            }

            mealDiv.querySelector('.btn-meal-add').addEventListener('click', () => {
                stagedMeal = mealName;
                document.getElementById('modal-add-food').classList.remove('hidden');
                searchInput.value = '';
                searchResults.innerHTML = '';
                searchResults.classList.add('hidden');
                searchInput.focus();
            });

            mealDiv.querySelector('.btn-meal-more').addEventListener('click', () => {
                stagedMeal = mealName;
                document.getElementById('modal-meal-options-title').innerText = mealName + " Options";
                
                const clipboard = localStorage.getItem('tdee_copied_meal');
                if (clipboard && JSON.parse(clipboard).length > 0) {
                    document.getElementById('btn-meal-opt-paste').classList.remove('hidden');
                } else {
                    document.getElementById('btn-meal-opt-paste').classList.add('hidden');
                }
                
                document.getElementById('modal-meal-options').classList.remove('hidden');
            });

            container.appendChild(mealDiv);
        }
        
        // Render Progress
        document.getElementById('diary-cal-consumed').innerText = Math.round(sumCals);
        
        let targetCals = 2000, targetP = 150, targetC = 200, targetF = 50, targetFiber = 25, targetSatFat = 20, targetFruits = 250, targetVeg = 300;
        
        // Priority: Manual Targets (appTargets) if they exist, else default/calc
        if (appTargets) {
            targetCals = appTargets.cal || 2000;
            targetP = appTargets.p || 0; 
            targetC = appTargets.c || 0; 
            targetF = appTargets.f || 0;
            targetFiber = appTargets.fiber || 0; 
            targetSatFat = appTargets.satfat || 0;
            targetFruits = appTargets.fruits || 0; 
            targetVeg = appTargets.veg || 0;
        }
        
        document.getElementById('diary-cal-budget').innerText = Math.round(targetCals);
        document.getElementById('diary-cal-remaining').innerText = Math.round(targetCals - sumCals);
        
        document.getElementById('prog-p').innerText = `${Math.round(sumP)} / ${Math.round(targetP)}g`;
        document.getElementById('prog-c').innerText = `${Math.round(sumC)} / ${Math.round(targetC)}g`;
        document.getElementById('prog-f').innerText = `${Math.round(sumF)} / ${Math.round(targetF)}g`;
        document.getElementById('prog-fiber').innerText = `${Math.round(sumFiber)} / ${Math.round(targetFiber)}g`;
        document.getElementById('prog-satfat').innerText = `${Math.round(sumSatFat)} / ${Math.round(targetSatFat)}g`;
        
        document.getElementById('diary-fruits-rem').innerText = `${Math.round(targetFruits)}g`;
        document.getElementById('diary-veg-rem').innerText = `${Math.round(targetVeg)}g`;
        
        document.getElementById('fill-p').style.width = `${Math.min((sumP/targetP)*100, 100)}%`;
        document.getElementById('fill-c').style.width = `${Math.min((sumC/targetC)*100, 100)}%`;
        document.getElementById('fill-f').style.width = `${Math.min((sumF/targetF)*100, 100)}%`;
        document.getElementById('fill-fiber').style.width = `${Math.min((sumFiber/targetFiber)*100, 100)}%`;
        document.getElementById('fill-satfat').style.width = `${Math.min((sumSatFat/targetSatFat)*100, 100)}%`;
    }

    // ==========================================
    // 4. FOOD SEARCH & APIs
    // --- Search Engine ---
    let searchTimeout;
    const searchInput = document.getElementById('food-search');
    const searchResults = document.getElementById('search-results-list');
    const searchSpinner = document.getElementById('search-spinner');
    let stagedMeal = "Meal 1";

    // Use Event Delegation for search results
    searchResults.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li || li.classList.contains('empty-state')) return;
        
        const name = li.getAttribute('data-name');
        const cal = parseFloat(li.getAttribute('data-cal'));
        const p = parseFloat(li.getAttribute('data-p'));
        const c = parseFloat(li.getAttribute('data-c'));
        const f = parseFloat(li.getAttribute('data-f'));
        const fiber = parseFloat(li.getAttribute('data-fiber'));
        const satfat = parseFloat(li.getAttribute('data-satfat'));
        
        // Close the search modal when proceeding to Amount modal
        document.getElementById('modal-add-food').classList.add('hidden');
        openAmountModal(name, cal, p, c, f, fiber, satfat);
    });

    document.getElementById('modal-add-close').addEventListener('click', () => {
        document.getElementById('modal-add-food').classList.add('hidden');
    });

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            searchSpinner.classList.add('hidden');
            return;
        }

        searchResults.classList.remove('hidden');
        
        // Search local DB only (instant)
        const localHits = localFoodDB.filter(f => f.name.toLowerCase().includes(query));
        let resultsHTML = '';
        localHits.forEach(food => {
            resultsHTML += createSearchResultHTML(food.name, food.cals, food.p, food.c, food.f, food.fiber, food.satfat);
        });

        if (resultsHTML === '') resultsHTML = '<li class="empty-state">No foods found. Try Quick Add.</li>';
        searchResults.innerHTML = resultsHTML;
    });

    function createSearchResultHTML(name, cals, p, c, f, fiber, satfat) {
        return `<li data-name="${name}" data-cal="${cals}" data-p="${p}" data-c="${c}" data-f="${f}" data-fiber="${fiber}" data-satfat="${satfat}" style="cursor:pointer;">
            <div class="flex-between" style="pointer-events:none;"><strong>${name}</strong><span>${Math.round(cals)} kcal</span></div>
            <div class="food-meta" style="pointer-events:none;"><span>P: ${Math.round(p)}g | C: ${Math.round(c)}g | F: ${Math.round(f)}g</span><span style="margin-left:auto;">per 100g</span></div>
        </li>`;
    }

    // Amount Modal
    const modalAmount = document.getElementById('modal-select-amount');
    let stagedFood = null;

    function openAmountModal(name, cal, p, c, f, fiber, satfat) {
        stagedFood = { name, cal, p, c, f, fiber, satfat };
        document.getElementById('modal-amount-title').innerText = name;
        document.getElementById('modal-amount-meta').innerText = `Base: 100g = ${Math.round(cal)} kcal`;
        
        // Last quantity memory
        const lastQ = appUserSettings.lastQuantities[name] || 100;
        document.getElementById('modal-amount-g').value = lastQ;
        
        const mealSelect = document.getElementById('modal-amount-meal-select');
        mealSelect.innerHTML = getMealOptionsHTML();
        mealSelect.value = stagedMeal; // Use the meal tracked via stagedMeal
        
        modalAmount.classList.remove('hidden');
    }

    document.getElementById('modal-amount-cancel').addEventListener('click', () => modalAmount.classList.add('hidden'));
    
    document.getElementById('modal-amount-add').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('modal-amount-g').value) || 0;
        const selectedMeal = document.getElementById('modal-amount-meal-select').value;
        if (amount <= 0) return;
        
        // Update memory
        appUserSettings.lastQuantities[stagedFood.name] = amount;
        
        const mult = amount / 100;
        ensureDateExists(currentDateStr);
        appData[currentDateStr].foods.push({
            name: stagedFood.name,
            amount: amount,
            meal: selectedMeal,
            cals: stagedFood.cal * mult,
            p: stagedFood.p * mult,
            c: stagedFood.c * mult,
            f: stagedFood.f * mult,
            fiber: (stagedFood.fiber || 0) * mult,
            satfat: (stagedFood.satfat || 0) * mult
        });
        
        saveData();
        modalAmount.classList.add('hidden');
        searchInput.value = '';
        searchResults.classList.add('hidden');
        renderDiary();
        showToast('Food Added!');
    });

    // Custom Modal
    const modalCustom = document.getElementById('modal-custom-food');
    document.getElementById('btn-manual-add').addEventListener('click', () => {
        document.getElementById('modal-add-food').classList.add('hidden'); // Close search modal
        const mealSelect = document.getElementById('modal-custom-meal-select');
        mealSelect.innerHTML = getMealOptionsHTML();
        mealSelect.value = stagedMeal; // Use global tracked meal
        modalCustom.classList.remove('hidden');
    });
    document.getElementById('modal-btn-cancel').addEventListener('click', () => modalCustom.classList.add('hidden'));
    
    document.getElementById('modal-btn-add').addEventListener('click', () => {
        const name = document.getElementById('modal-food-name').value || 'Custom Food';
        const meal = document.getElementById('modal-custom-meal-select').value;
        const cal = parseFloat(document.getElementById('modal-cals').value) || 0;
        const p = parseFloat(document.getElementById('modal-p').value) || 0;
        const c = parseFloat(document.getElementById('modal-c').value) || 0;
        const f = parseFloat(document.getElementById('modal-f').value) || 0;
        const fiber = parseFloat(document.getElementById('modal-fiber').value) || 0;
        
        ensureDateExists(currentDateStr);
        appData[currentDateStr].foods.push({ name, amount: '1 serving', meal, cals: cal, p, c, f, fiber, satfat: 0 });
        
        saveData();
        modalCustom.classList.add('hidden');
        renderDiary();
        showToast('Custom Food Added!');
    });

    // Meal Options Modal Actions
    document.getElementById('modal-meal-options-close').addEventListener('click', () => {
        document.getElementById('modal-meal-options').classList.add('hidden');
    });

    document.getElementById('btn-meal-opt-copy').addEventListener('click', () => {
        ensureDateExists(currentDateStr);
        const mealFoods = appData[currentDateStr].foods.filter(f => (f.meal || 'Meal 1') === stagedMeal);
        localStorage.setItem('tdee_copied_meal', JSON.stringify(mealFoods));
        document.getElementById('modal-meal-options').classList.add('hidden');
        showToast(stagedMeal + ' Copied!');
    });

    document.getElementById('btn-meal-opt-paste').addEventListener('click', () => {
        const clipboard = localStorage.getItem('tdee_copied_meal');
        if (clipboard) {
            const foodsToPaste = JSON.parse(clipboard);
            ensureDateExists(currentDateStr);
            foodsToPaste.forEach(f => {
                appData[currentDateStr].foods.push({ ...f, meal: stagedMeal });
            });
            saveData();
            renderDiary();
            document.getElementById('modal-meal-options').classList.add('hidden');
            showToast('Pasted into ' + stagedMeal + '!');
        }
    });

    document.getElementById('btn-meal-opt-clear').addEventListener('click', () => {
        ensureDateExists(currentDateStr);
        appData[currentDateStr].foods = appData[currentDateStr].foods.filter(f => (f.meal || 'Meal 1') !== stagedMeal);
        saveData();
        renderDiary();
        document.getElementById('modal-meal-options').classList.add('hidden');
        showToast(stagedMeal + ' Cleared!');
    });


    // ==========================================
    // 5. SETTINGS ENGINE
    // ==========================================
    function renderSettings() {
        document.getElementById('set-name').value = appUserSettings.name || "";
        document.getElementById('set-age').value = appUserSettings.age || "";
        document.getElementById('set-sex').value = appUserSettings.sex || "";
        document.getElementById('set-weight').value = appUserSettings.weight || "";
        document.getElementById('set-bf-input').value = appUserSettings.bf || "";
        calculateProfileLBM();
        document.getElementById('set-meal-count-display').innerText = `${appUserSettings.mealCount} Meals`;
        document.getElementById('set-coach-enabled').checked = appUserSettings.coachEnabled || false;
        document.getElementById('set-notif-enabled').checked = appUserSettings.notifEnabled;
        document.getElementById('set-time-weight').value = appUserSettings.weightNotifTime;
        document.getElementById('set-time-food').value = appUserSettings.foodNotifTime;
        document.getElementById('notif-settings-group').classList.toggle('hidden', !appUserSettings.notifEnabled);
    }

    document.getElementById('set-coach-enabled').addEventListener('change', (e) => {
        appUserSettings.coachEnabled = e.target.checked;
        saveData();
        showToast(appUserSettings.coachEnabled ? 'Coach Mode enabled' : 'Coach Mode disabled');
    });


    // Init Settings Modals Logic
    document.getElementById('btn-manual-targets').addEventListener('click', () => {
        document.getElementById('set-meal-count').value = appUserSettings.mealCount;
        document.getElementById('modal-settings-meals').classList.remove('hidden');
    });

    document.getElementById('modal-meals-cancel').addEventListener('click', () => document.getElementById('modal-settings-meals').classList.add('hidden'));
    document.getElementById('modal-meals-save').addEventListener('click', () => {
        appUserSettings.mealCount = parseInt(document.getElementById('set-meal-count').value) || 4;
        saveData();
        renderSettings();
        document.getElementById('modal-settings-meals').classList.add('hidden');
        showToast('Meal count updated');
    });

    const modalNutri = document.getElementById('modal-settings-nutrition');
    document.getElementById('btn-open-nutrition-modal').addEventListener('click', () => {
        if (!appTargets) appTargets = { cal: 2000, p: 150, c: 200, f: 50, fiber: 25, satfat: 20, fruits: 250, veg: 300 };
        document.getElementById('set-target-cal').value = appTargets.cal;
        document.getElementById('set-target-p').value = appTargets.p;
        document.getElementById('set-target-c').value = appTargets.c;
        document.getElementById('set-target-f').value = appTargets.f;
        document.getElementById('set-target-fiber').value = appTargets.fiber;
        document.getElementById('set-target-satfat').value = appTargets.satfat;
        document.getElementById('set-target-fruits').value = appTargets.fruits;
        document.getElementById('set-target-veg').value = appTargets.veg;
        modalNutri.classList.remove('hidden');
    });

    document.getElementById('modal-nutrition-cancel').addEventListener('click', () => modalNutri.classList.add('hidden'));
    document.getElementById('modal-nutrition-save').addEventListener('click', () => {
        if (!appTargets) appTargets = {};
        appTargets.cal = parseFloat(document.getElementById('set-target-cal').value) || 2000;
        appTargets.p = parseFloat(document.getElementById('set-target-p').value) || 0;
        appTargets.c = parseFloat(document.getElementById('set-target-c').value) || 0;
        appTargets.f = parseFloat(document.getElementById('set-target-f').value) || 0;
        appTargets.fiber = parseFloat(document.getElementById('set-target-fiber').value) || 0;
        appTargets.satfat = parseFloat(document.getElementById('set-target-satfat').value) || 0;
        appTargets.fruits = parseFloat(document.getElementById('set-target-fruits').value) || 0;
        appTargets.veg = parseFloat(document.getElementById('set-target-veg').value) || 0;
        
        saveData();
        renderDiary();
        modalNutri.classList.add('hidden');
        showToast('Manual Targets Applied');
    });

    function calculateProfileLBM() {
        const weight = parseFloat(document.getElementById('set-weight').value);
        const bf = parseFloat(document.getElementById('set-bf-input').value);
        if (weight && bf) {
            const lbm = weight - (weight * (bf / 100));
            const fm = weight - lbm;
            document.getElementById('set-lbm').innerText = `${lbm.toFixed(1)}kg`;
            document.getElementById('set-fm').innerText = `${fm.toFixed(1)}kg`;
            appUserSettings.lbm = lbm.toFixed(1);
            appUserSettings.fm = fm.toFixed(1);
        } else {
            document.getElementById('set-lbm').innerText = "--";
            document.getElementById('set-fm').innerText = "--";
        }
    }

    // Profile Listeners
    document.getElementById('set-name').addEventListener('change', (e) => { appUserSettings.name = e.target.value; saveData(); });
    document.getElementById('set-age').addEventListener('change', (e) => { appUserSettings.age = parseInt(e.target.value) || null; saveData(); });
    document.getElementById('set-sex').addEventListener('change', (e) => { appUserSettings.sex = e.target.value; saveData(); });
    document.getElementById('set-weight').addEventListener('input', (e) => { 
        appUserSettings.weight = parseFloat(e.target.value); 
        calculateProfileLBM(); 
        saveData(); 
    });
    document.getElementById('set-bf-input').addEventListener('input', (e) => { 
        appUserSettings.bf = parseFloat(e.target.value); 
        calculateProfileLBM(); 
        saveData(); 
    });
    document.getElementById('set-meal-count').addEventListener('change', (e) => {
        appUserSettings.mealCount = parseInt(e.target.value);
        saveData();
    });

    // Nutrition Target Listeners
    const targetFields = ['cal', 'p', 'c', 'f', 'fiber', 'satfat', 'fruits', 'veg'];
    targetFields.forEach(field => {
        document.getElementById(`set-target-${field}`).addEventListener('change', (e) => {
            if (!appTargets) appTargets = {};
            appTargets[field] = parseFloat(e.target.value);
            saveData();
            showToast('Target Updated');
        });
    });

    // Notification Listeners
    document.getElementById('set-notif-enabled').addEventListener('change', async (e) => {
        appUserSettings.notifEnabled = e.target.checked;
        if (appUserSettings.notifEnabled) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                appUserSettings.notifEnabled = false;
                e.target.checked = false;
                showToast('Notification permission denied');
            }
        }
        document.getElementById('notif-settings-group').classList.toggle('hidden', !appUserSettings.notifEnabled);
        saveData();
    });

    document.getElementById('set-time-weight').addEventListener('change', (e) => { appUserSettings.weightNotifTime = e.target.value; saveData(); });
    document.getElementById('set-time-food').addEventListener('change', (e) => { appUserSettings.foodNotifTime = e.target.value; saveData(); });

    // Notification Checker
    let lastNotifiedMinute = null;
    function checkNotifications() {
        if (!appUserSettings.notifEnabled) return;
        
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5); // "HH:MM"
        
        if (lastNotifiedMinute === timeStr) return; // Prevent duplicate triggers in the same minute
        
        let shouldNotifWeight = false;
        let shouldNotifFood = false;

        // Weight Reminder
        if (timeStr === appUserSettings.weightNotifTime) {
            ensureDateExists(currentDateStr);
            if (appData[currentDateStr].weight === null) {
                shouldNotifWeight = true;
            }
        }
        
        // Food Reminder
        if (timeStr === appUserSettings.foodNotifTime) {
            shouldNotifFood = true; // Always remind them around this time to log their next meal
        }

        if (shouldNotifWeight || shouldNotifFood) {
            lastNotifiedMinute = timeStr;
            if (Notification.permission === 'granted') {
                // Try to use Service Worker for better PWA compatibility (especially on iOS/Android)
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(reg => {
                        if (shouldNotifWeight) reg.showNotification("DietCoach: Log Weight", { body: "Don't forget to log your morning weight!" });
                        if (shouldNotifFood) reg.showNotification("DietCoach: Log Food", { body: "Friendly reminder to update your food diary!" });
                    });
                } else {
                    // Fallback for desktop/non-pwa
                    if (shouldNotifWeight) new Notification("DietCoach: Log Weight", { body: "Don't forget to log your morning weight!" });
                    if (shouldNotifFood) new Notification("DietCoach: Log Food", { body: "Friendly reminder to update your food diary!" });
                }
            }
        }
    }
    setInterval(checkNotifications, 60000); // Check every minute

    // ==========================================
    // 6. WEIGHT & CHART.JS ENGINE
    // ==========================================
    const inWeight = document.getElementById('today-weight-input');
    const btnLogWeight = document.getElementById('btn-log-weight');
    const histList = document.getElementById('historical-weight-list');
    
    let weightChart = null;

    btnLogWeight.addEventListener('click', () => {
        const w = parseFloat(inWeight.value);
        if (!w) return;
        ensureDateExists(currentDateStr);
        appData[currentDateStr].weight = w;
        saveData();
        inWeight.value = '';
        showToast('Weight Saved!');
        renderWeightView();
        updateChart(30); // Default to 30 days
    });

    function renderWeightView() {
        histList.innerHTML = '';
        const dates = Object.keys(appData).sort().reverse();
        let rendered = 0;
        
        dates.forEach(date => {
            if (appData[date].weight) {
                rendered++;
                const li = document.createElement('li');
                li.className = 'weight-item';
                const isOverwrite = appData[date].weightOverwritten ? `<span style="font-size:0.6rem; background: var(--text-primary); color: var(--bg-main); padding: 0.15rem 0.35rem; border-radius: 4px; margin-left: 0.5rem; font-weight: bold; letter-spacing: 0.5px;">OVERWRITE</span>` : '';
                li.innerHTML = `
                    <span style="display:flex; align-items:center;">${date} ${isOverwrite}</span> 
                    <strong>${appData[date].weight} kg</strong>
                    <div class="actions">
                        <i class="material-icons edit-icon" data-date="${date}">edit</i>
                        <i class="material-icons delete-icon" data-date="${date}">delete</i>
                    </div>
                `;
                li.querySelector('.edit-icon').addEventListener('click', () => openEditWeightModal(date));
                li.querySelector('.delete-icon').addEventListener('click', () => deleteWeight(date));
                histList.appendChild(li);
            }
        });
        
        if (rendered === 0) histList.innerHTML = '<li class="empty-state">No past weigh-ins found.</li>';
    }

    // Weight Editing Logic
    const modalEditWeight = document.getElementById('modal-edit-weight');
    let editingWeightDate = null;

    function openEditWeightModal(date) {
        editingWeightDate = date;
        document.getElementById('edit-weight-date').value = date;
        document.getElementById('edit-weight-val').value = appData[date].weight;
        modalEditWeight.classList.remove('hidden');
    }

    document.getElementById('modal-edit-weight-cancel').addEventListener('click', () => modalEditWeight.classList.add('hidden'));
    
    document.getElementById('modal-edit-weight-save').addEventListener('click', () => {
        const newDate = document.getElementById('edit-weight-date').value;
        const newVal = parseFloat(document.getElementById('edit-weight-val').value);
        if (!newDate || !newVal) return;

        // If date changed
        if (newDate !== editingWeightDate) {
            // Delete old, ensuredate for new
            const oldVal = appData[editingWeightDate].weight;
            appData[editingWeightDate].weight = null; 
            ensureDateExists(newDate);
            appData[newDate].weight = newVal;
        } else {
            appData[editingWeightDate].weight = newVal;
        }

        saveData();
        modalEditWeight.classList.add('hidden');
        renderWeightView();
        updateChart(30);
        showToast('Weight Updated');
    });

    function deleteWeight(date) {
        appData[date].weight = null;
        saveData();
        renderWeightView();
        updateChart(30);
        showToast('Weight Deleted');
    }

    // Chart Tabs
    document.querySelectorAll('#chart-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#chart-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateChart(parseInt(e.target.getAttribute('data-range')));
        });
    });

    function updateChart(daysBack) {
        if (typeof Chart === 'undefined') {
            console.warn("Chart.js not loaded.");
            return;
        }

        const dates = Object.keys(appData).sort(); // chronological
        
        // Filter purely for math purposes
        let cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);
        const cutoffStr = getFormattedDate(cutoffDate);
        
        const chartLabels = [];
        const chartData = [];
        let sum = 0, count = 0;

        dates.forEach(d => {
            if (d >= cutoffStr && appData[d].weight) {
                chartLabels.push(d.substring(5)); // just MM-DD
                chartData.push(appData[d].weight);
                sum += appData[d].weight;
                count++;
            }
        });

        // Set avg
        document.getElementById('graph-avg-val').innerText = count > 0 ? (sum/count).toFixed(2) : '--';

        const ctx = document.getElementById('weight-chart').getContext('2d');
        if (weightChart) weightChart.destroy();

        weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Weight (kg)',
                    data: chartData,
                    borderColor: '#fafafa',
                    backgroundColor: 'rgba(250, 250, 250, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#27272a',
                    pointBorderColor: '#fafafa',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } },
                    y: { grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } }
                }
            }
        });
    }


    // ==========================================
    // 7. CALCULATOR WIZARD
    // ==========================================
    // Core Wizard Navigation Handled here
    const form = document.getElementById('wizard-form');
    const steps = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')];
    const resultsPanel = document.getElementById('results-panel');
    const progressBar = document.getElementById('progress-bar');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const btnCalculate = document.getElementById('btn-calculate');
    const btnSaveTargets = document.getElementById('btn-save-targets');
    let currentStep = 0; const totalSteps = steps.length;
    let isMetric = true;

    updateWizardUI();

    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        const ok = validateStep(currentStep);
        if (!ok) {
            showToast('Please fill in required fields');
            return;
        }
        if (currentStep < totalSteps - 1) { 
            currentStep++; 
            updateWizardUI(); 
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 0) { currentStep--; updateWizardUI(); }
    });

    // Calculate button — appears on last wizard step
    btnCalculate.addEventListener('click', () => {
        if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
            showToast('Please fill in all required fields.');
            return;
        }
        calculateWizardResults();
    });

    // Add to Diary — lives inside the results panel
    btnSaveTargets.addEventListener('click', () => {
        if (!appTargets) {
            showToast('Please calculate your targets first.');
            return;
        }
        saveData();
        showToast('Targets Saved to Diary');
        
        // Push BF/LBM/FM to Settings Profile
        const bf = parseFloat(document.getElementById('body-fat').value);
        let weight = parseFloat(document.getElementById('weight').value);
        if (!isMetric) weight = weight / 2.20462; // store always in kg
        const lbm = weight - (weight * (bf / 100));
        const fm = weight - lbm;

        appUserSettings.bf = bf;
        appUserSettings.lbm = lbm.toFixed(1);
        appUserSettings.fm = fm.toFixed(1);
        appUserSettings.isMetric = isMetric;

        // Save wizard goal/rate for Coach
        const goalNode = Array.from(document.getElementsByName('goal')).find(r => r.checked);
        appUserSettings.wizardGoal = goalNode ? goalNode.value : 'maintain';
        appUserSettings.wizardCutRate = parseFloat(document.getElementById('cut-rate').value) || 0.7;
        appUserSettings.wizardBulkRate = parseFloat(document.getElementById('bulk-experience').value) || 1.0;
        appUserSettings.wizardWeight = weight; // always in kg
        saveData();

        currentStep = 0;
        updateWizardUI();
        
        // Setup done! Close Modal explicitly without touching tabs
        document.getElementById('modal-calculator').classList.add('hidden');
        renderDiary();
        renderSettings();
    });

    document.getElementById('unit-toggle').addEventListener('change', (e) => {
        isMetric = !e.target.checked;
        appUserSettings.isMetric = isMetric;
        saveData();
        document.getElementById('label-metric').classList.toggle('inactive', !isMetric);
        document.getElementById('label-imperial').classList.toggle('inactive', isMetric);
        document.getElementById('weight-label').textContent = isMetric ? 'Weight (kg)' : 'Weight (lbs)';
    });

    document.getElementById('cut-rate').addEventListener('input', (e) => document.getElementById('cut-rate-display').textContent = `${e.target.value}%`);
    document.getElementsByName('goal').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('cut-details').classList.add('hidden');
            document.getElementById('bulk-details').classList.add('hidden');
            if (e.target.value === 'cut') document.getElementById('cut-details').classList.remove('hidden');
            else if (e.target.value === 'bulk') document.getElementById('bulk-details').classList.remove('hidden');
        });
    });

    // Silent check — does NOT mark fields red
    function isStepFilled(index) {
        let filled = true;
        steps[index].querySelectorAll('input[required], select[required]').forEach(input => {
            if (!input.value || input.value.trim() === '') filled = false;
        });
        return filled;
    }

    // Visual validation — marks empty fields red for user feedback
    function validateStep(index) {
        let isValid = true;
        // Scope tightly to only the current step's own inputs
        const currentStepEl = steps[index];
        if (!currentStepEl) return false;

        currentStepEl.querySelectorAll('input[required], select[required]').forEach(input => {
            if (!input.value || input.value.trim() === '') {
                input.style.borderColor = '#f87171';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border-subtle)';
            }
        });
        return isValid;
    }

    function updateWizardUI() {
        steps.forEach((step, index) => step.classList.toggle('hidden', index !== currentStep));
        progressBar.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
        btnBack.classList.toggle('hidden', currentStep === 0);
        
        if (currentStep === totalSteps - 1) {
            // On last step: show Calculate, hide Next
            btnNext.classList.add('hidden');
            btnCalculate.classList.remove('hidden');
            // If all fields are pre-filled (e.g. user came back), auto-show results
            if (isStepFilled(0) && isStepFilled(1) && isStepFilled(2)) calculateWizardResults();
        } else {
            btnNext.classList.remove('hidden');
            btnCalculate.classList.add('hidden');
            resultsPanel.classList.add('hidden');
        }
    }

    function calculateWizardResults() {
        let weight = parseFloat(document.getElementById('weight').value);
        if (!isMetric) weight = weight / 2.20462;
        const act = parseFloat(document.getElementById('activity').value);
        const goalNode = Array.from(document.getElementsByName('goal')).find(r => r.checked);
        const goal = goalNode ? goalNode.value : 'maintain';
        const bf = parseFloat(document.getElementById('body-fat').value);
        
        const tdee = weight * 22 * act;
        const lbm = weight - (weight * (bf / 100));

        let tCals = tdee;
        if (goal === 'cut') tCals = Math.max(1200, tdee - (((weight * (parseFloat(document.getElementById('cut-rate').value) / 100)) * 7700) / 7));
        else if (goal === 'bulk') tCals = tdee + (((weight * (parseFloat(document.getElementById('bulk-experience').value) / 100)) * 7700) / 30.4);

        const pro = goal === 'cut' ? 2.5 * lbm : 2.2 * lbm;
        const carbs = goal === 'cut' ? 1.0 * weight : 2.0 * weight;

        // Render DOM
        document.getElementById('tdee-display').textContent = `${Math.round(tdee)} kcal`;
        document.getElementById('lbm-display').textContent = `${lbm.toFixed(1)}`;
        document.getElementById('target-calories').textContent = Math.round(tCals).toLocaleString();
        document.getElementById('res-protein').textContent = `${Math.round(pro)}g`;
        document.getElementById('res-carbs').textContent = `${Math.round(carbs)}g`;
        document.getElementById('res-fiber').textContent = `${Math.round((tCals/1000)*13)}g`;
        document.getElementById('res-satfat').textContent = `${Math.round((tCals*0.1)/9)}g`;
        document.getElementById('res-sugar').textContent = `${Math.round((tCals*0.1)/4)}g`;
        document.getElementById('res-fruits').textContent = `${Math.round((tCals/1000)*120)}g`;
        document.getElementById('res-veg').textContent = `${Math.round((tCals/(goal==='cut'?500:1000))*100)}g`;

        resultsPanel.classList.remove('hidden');
        
        // Save to target object in memory, waiting for user to click button
        appTargets = { 
            cal: Math.round(tCals), 
            p: Math.round(pro), 
            c: Math.round(carbs), 
            f: 50,
            fiber: Math.round((tCals/1000)*13),
            satfat: Math.round((tCals*0.1)/9),
            fruits: Math.round((tCals/1000)*120),
            veg: Math.round((tCals/(goal==='cut'?500:1000))*100)
        };
    }

    // Init views rendering baseline if already having targets
    if (appTargets) {
        renderDiary();
        renderWeightView();
        updateChart(30);
    } else {
        // Fresh start: Open the calculator modal persistently over UI
        document.getElementById('modal-calculator').classList.remove('hidden');
    }

    // Support explicit Settings open & UI controls for the Modal
    document.getElementById('btn-open-calc').addEventListener('click', () => {
        currentStep = 0;
        updateWizardUI();
        document.getElementById('modal-calculator').classList.remove('hidden');
    });

    document.getElementById('btn-close-calc').addEventListener('click', () => {
        document.getElementById('modal-calculator').classList.add('hidden');
        renderDiary();
        renderWeightView();
        updateChart(30);
    });

    // ==========================================
    // 8. COACH ENGINE
    // ==========================================

    function renderCoachHistory() {
        const history = (appUserSettings.coachHistory || []);
        if (history.length === 0) return '<p style="color:var(--text-secondary); font-size:0.85rem; text-align:center; padding:0.75rem 0;">No past recommendations yet.</p>';
        const unitLabel = appUserSettings.isMetric !== false ? 'kg' : 'lbs';
        return history.slice(0, 10).map(item => `
            <div style="padding:0.75rem 0; border-bottom:1px solid var(--border-subtle);">
                <div class="flex-between" style="margin-bottom:0.2rem;">
                    <span style="font-size:0.8rem; color:var(--text-secondary);">${item.date}</span>
                    <strong>${item.cal.toLocaleString()} kcal</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); display:flex; gap:0.75rem; flex-wrap:wrap;">
                    <span>TDEE ${item.tdee}</span>
                    <span style="text-transform:capitalize;">${item.goal}</span>
                    <span>${item.wChange > 0 ? '−' : '+'}${Math.abs(item.wChange).toFixed(2)} ${unitLabel}/14d</span>
                    <span>~${item.avgCals} kcal avg</span>
                </div>
            </div>`).join('');
    }

    function calculateCoachAdjustment() {
        const todayStr = getFormattedDate(new Date());
        const isMetric = appUserSettings.isMetric !== false;
        const toKg = v => isMetric ? v : v / 2.20462;
        const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

        const week1Dates = [], week2Dates = [];
        for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); week2Dates.push(getFormattedDate(d)); }
        for (let i = 8; i <= 14; i++) { const d = new Date(); d.setDate(d.getDate() - i); week1Dates.push(getFormattedDate(d)); }
        const allDates14 = [...week1Dates, ...week2Dates];

        const w1Raw = week1Dates.map(d => appData[d]?.weight || null).filter(v => v !== null);
        const w2Raw = week2Dates.map(d => appData[d]?.weight || null).filter(v => v !== null);
        const foodDays14 = allDates14.filter(d => (appData[d]?.foods || []).length > 0);

        if (foodDays14.length < 5 || (w1Raw.length + w2Raw.length) < 3 || w1Raw.length === 0 || w2Raw.length === 0) return null;

        const getTrimmedAvg = (rawArr) => {
            if (rawArr.length < 4) return avg(rawArr.map(toKg));
            const sorted = rawArr.map(toKg).sort((a,b) => a-b);
            sorted.shift(); sorted.pop();
            return avg(sorted);
        };

        const w1_kg = getTrimmedAvg(w1Raw);
        const w2_kg = getTrimmedAvg(w2Raw);
        const weeklyChange_kg = w1_kg - w2_kg;
        const historyTDEE = (appUserSettings.coachHistory && appUserSettings.coachHistory.length > 0) ? appUserSettings.coachHistory[0].tdee : null;
        
        let fallbackMaintenance = historyTDEE;
        if (!fallbackMaintenance) {
            const wt_kg = appUserSettings.wizardWeight || w2_kg || 70;
            fallbackMaintenance = Math.round(wt_kg * 24 * 1.3);
        }

        const missingDays = 14 - foodDays14.length;
        let totalLoggedCals = 0;
        foodDays14.forEach(d => { totalLoggedCals += (appData[d].foods || []).reduce((s, f) => s + (f.cals || 0), 0); });
        const avgDailyCals = (totalLoggedCals + (missingDays * fallbackMaintenance)) / 14;
        const rawObservedTDEE = Math.round(avgDailyCals + (weeklyChange_kg / 7 * 7700));
        let observedTDEE = historyTDEE ? Math.round((rawObservedTDEE * 0.5) + (historyTDEE * 0.5)) : rawObservedTDEE;

        const goal = appUserSettings.wizardGoal || null;
        const wizardWeight_kg = appUserSettings.wizardWeight || avg([w1_kg, w2_kg]);
        let calculatedNewCalTarget = observedTDEE, targetWeeklyChange_kg = 0;

        if (goal === 'cut') {
            const r = appUserSettings.wizardCutRate || 0.7;
            targetWeeklyChange_kg = wizardWeight_kg * (r / 100);
            calculatedNewCalTarget = observedTDEE - (targetWeeklyChange_kg * 7700 / 7);
        } else if (goal === 'bulk') {
            const r = appUserSettings.wizardBulkRate || 1.0;
            targetWeeklyChange_kg = (wizardWeight_kg * (r / 100)) / 4.33;
            calculatedNewCalTarget = observedTDEE + (targetWeeklyChange_kg * 7700 / 7);
        }
        
        calculatedNewCalTarget = Math.max(1200, Math.round(calculatedNewCalTarget));
        let newCalTarget = calculatedNewCalTarget;
        const currentTarget = appTargets?.cal || newCalTarget;
        if (goal && currentTarget) {
            if (newCalTarget > currentTarget + 300) newCalTarget = currentTarget + 300;
            else if (newCalTarget < currentTarget - 300) newCalTarget = currentTarget - 300;
        }

        const bf = parseFloat(appUserSettings.bf) || 15;
        const avgWeight_kg = avg([w1_kg, w2_kg]);
        const lbm_kg = avgWeight_kg * (1 - bf / 100);
        const protein = Math.round(goal === 'cut' ? 2.5 * lbm_kg : 2.2 * lbm_kg);
        const carbs = Math.round(goal === 'cut' ? 1.0 * avgWeight_kg : 2.0 * avgWeight_kg);
        const fiber = Math.round((newCalTarget / 1000) * 13);
        const satfat = Math.round((newCalTarget * 0.1) / 9);
        const fruits = Math.round((newCalTarget / 1000) * 120);
        const veg = Math.round(newCalTarget / (goal === 'cut' ? 500 : 1000) * 100);

        return {
            cal: newCalTarget, p: protein, c: carbs, f: 50, fiber, satfat, fruits, veg,
            tdee: observedTDEE, avgCals: Math.round(avgDailyCals), 
            wChange: parseFloat((appUserSettings.isMetric !== false ? weeklyChange_kg : weeklyChange_kg * 2.20462).toFixed(2))
        };
    }

    function renderCoachView() {
        const content = document.getElementById('coach-content');
        const todayStr = getFormattedDate(new Date());

        const last = appUserSettings.coachLastApplied;
        const daysSince = last ? Math.floor((new Date(todayStr) - new Date(last)) / 86400000) : 999;
        const cooldown = 7;
        const daysLeft = cooldown - daysSince;

        // COOLDOWN STATE
        if (daysLeft > 0) {
            let adviceHTML = '';
            if (appUserSettings.coachLastAdvice && appUserSettings.coachLastAdvice.length > 0) {
                adviceHTML = `
                    <div class="panel" style="border-left: 4px solid var(--brand-primary); margin-bottom: 1rem;">
                        <div class="flex-between" style="margin-bottom:0.75rem;">
                            <h2 class="section-title" style="margin-bottom:0; display:flex; align-items:center; gap:0.5rem;">
                                <span class="material-icons" style="font-size:1.2rem; color:var(--brand-primary);">psychology</span> Coach's Feedback
                            </h2>
                        </div>
                        <ul style="padding-left:1.25rem; margin:0; color:var(--text-secondary); font-size:0.85rem; line-height:1.6;">
                            ${appUserSettings.coachLastAdvice.map(a => `<li style="margin-bottom:0.5rem;">${a}</li>`).join('')}
                        </ul>
                    </div>`;
            }

            content.innerHTML = `
                ${adviceHTML}
                <div class="panel">
                    <div class="flex-between" style="margin-bottom:1rem;">
                        <h2 class="section-title" style="margin-bottom:0;">Current Targets</h2>
                        <span class="bmr-chip" style="background:var(--brand-primary); color:white;">Week View</span>
                    </div>
                    <div class="main-cal-display" style="padding:0.75rem 0 0.5rem; background:var(--bg-card); border-radius:var(--radius-md); margin-bottom:1.25rem;">
                        <div class="cal-content">
                            <span class="cal-label">Active Calorie Target</span>
                            <span class="cal-number">${appTargets.cal.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="macros-grid" style="margin-bottom:1.25rem;">
                        <div class="macro-card protein"><div class="macro-header"><div class="dot"></div><span>Protein</span></div><div class="macro-grams">${appTargets.p}g</div></div>
                        <div class="macro-card carbs"><div class="macro-header"><div class="dot"></div><span>Carbs</span></div><div class="macro-grams">${appTargets.c}g</div></div>
                        <div class="macro-card fats"><div class="macro-header"><div class="dot"></div><span>Fats</span></div><div class="macro-grams">${appTargets.f}g</div></div>
                    </div>
                    <div class="micros-grid" style="margin-bottom:0;">
                        <div class="micro-row"><span>Fiber (min)</span><strong>${appTargets.fiber}g</strong></div>
                        <div class="micro-row"><span>Sat. Fat (max)</span><strong>${appTargets.satfat}g</strong></div>
                        <div class="micro-row"><span>Fruits (min)</span><strong>${appTargets.fruits}g</strong></div>
                        <div class="micro-row"><span>Veggies (min)</span><strong>${appTargets.veg}g</strong></div>
                    </div>
                </div>

                <div class="panel" style="text-align:center; padding:1.5rem;">
                    <h3 style="margin-bottom:0.5rem; font-size:1rem;">Next Adjustment</h3>
                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:1rem;">Adjustment window ready in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>.</p>
                    <button class="secondary-btn" style="width:100%; opacity:0.5; cursor:not-allowed;" disabled>Locked for ${daysLeft}d</button>
                </div>
                <div class="panel"><h2 class="section-title">Coach History</h2>${renderCoachHistory()}</div>
            `;
            return;
        }

        // READY STATE
        content.innerHTML = `
            <div class="panel" style="text-align:center; padding:2.5rem 1.5rem;">
                <span class="material-icons" style="font-size:3.5rem; color:var(--brand-primary); margin-bottom:1rem;">psychology</span>
                <h2 style="margin-bottom:0.75rem;">Weekly Check-in</h2>
                <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">Your 7-day adjustment is ready. Complete your check-in to receive behavior feedback and updated targets.</p>
                <button id="btn-start-checkin" class="primary-btn" style="width:100%; padding:1rem;">Start Weekly Check-in</button>
            </div>
            <div class="panel"><h2 class="section-title">Coach History</h2>${renderCoachHistory()}</div>
        `;
        document.getElementById('btn-start-checkin')?.addEventListener('click', openCoachCheckin);
    }

    // --- COACH CHECK-IN WIZARD ---
    const modalCheckin = document.getElementById('modal-coach-checkin');
    let checkinAdvice = [];

    function openCoachCheckin() {
        modalCheckin.classList.remove('hidden');
        showCheckinStep(1);
    }

    function showCheckinStep(step) {
        document.querySelectorAll('.checkin-step').forEach(el => el.classList.add('hidden'));
        document.getElementById(`checkin-step-${step}`).classList.remove('hidden');
    }

    // Slider Listeners
    const sliders = [
        { id: 'checkin-intensity', val: 'val-intensity', suffix: '%' },
        { id: 'checkin-form', val: 'val-form', suffix: '' },
        { id: 'checkin-train-adh', val: 'val-train-adh', suffix: '%' },
        { id: 'checkin-diet-adh', val: 'val-diet-adh', suffix: '%' },
        { id: 'checkin-meal-adh', val: 'val-meal-adh', suffix: '%' },
        { id: 'checkin-steps-adh', val: 'val-steps-adh', suffix: '%' },
        { id: 'checkin-sleep', val: 'val-sleep', suffix: '' },
        { id: 'checkin-satiety', val: 'val-satiety', suffix: '' }
    ];

    sliders.forEach(s => {
        const input = document.getElementById(s.id);
        const display = document.getElementById(s.val);
        input.addEventListener('input', () => { display.textContent = input.value + s.suffix; });
    });

    document.getElementById('modal-coach-checkin-close').addEventListener('click', () => modalCheckin.classList.add('hidden'));
    document.getElementById('btn-checkin-next-1').addEventListener('click', () => showCheckinStep(2));
    document.getElementById('btn-checkin-prev-2').addEventListener('click', () => showCheckinStep(1));
    document.getElementById('btn-checkin-next-2').addEventListener('click', () => showCheckinStep(3));
    document.getElementById('btn-checkin-prev-3').addEventListener('click', () => showCheckinStep(2));

    document.getElementById('btn-checkin-submit').addEventListener('click', () => {
        const scores = {
            intensity: parseInt(document.getElementById('checkin-intensity').value),
            form: parseInt(document.getElementById('checkin-form').value),
            trainAdh: parseInt(document.getElementById('checkin-train-adh').value),
            dietAdh: parseInt(document.getElementById('checkin-diet-adh').value),
            mealAdh: parseInt(document.getElementById('checkin-meal-adh').value),
            stepsAdh: parseInt(document.getElementById('checkin-steps-adh').value),
            sleep: parseInt(document.getElementById('checkin-sleep').value),
            satiety: parseInt(document.getElementById('checkin-satiety').value)
        };

        const advice = [];
        if (scores.intensity < 70) advice.push("You are not training hard enough! Try to adhere to the recommended RIR targets for optimal progress.");
        if (scores.form < 6) advice.push("You are not using good enough form on average. Proper form is crucial for injury prevention and progression!");
        if (scores.trainAdh < 100) advice.push("You are not following your workout program! For best results, do all of your prescribed workouts!");
        if (scores.dietAdh < 90 || scores.dietAdh > 105) advice.push("You are not following your calorie and macro targets! For best results, adhere as close as possible to the dietary recommendations.");
        if (scores.mealAdh < 70) advice.push("You are not eating your prescribed number of meals on average. If the meal number is unsustainable, consider changing the number of meals you eat.");
        if (scores.stepsAdh < 80 || scores.stepsAdh > 110) advice.push("You are not hitting your step targets on average. For best results, try getting the prescribed number of steps daily.");
        if (scores.sleep < 7) advice.push("You are not sleeping enough! For best results, try getting at least 8 hours of sleep every night.");
        if (scores.satiety < 6) advice.push("You may be a little too hungry, consider losing weight at a slower rate or eating more filling foods.");
        else if (scores.satiety > 10) advice.push("You are feeling too full. Consider eating less filling foods, higher energy density foods and drinking more calories.");

        // Automated Silent Adjustment
        const result = calculateCoachAdjustment();
        if (result) {
            appTargets = { 
                cal: result.cal, p: result.p, c: result.c, f: result.f, 
                fiber: result.fiber, satfat: result.satfat, 
                fruits: result.fruits, veg: result.veg 
            };
            if (!appUserSettings.coachHistory) appUserSettings.coachHistory = [];
            appUserSettings.coachHistory.unshift({
                date: getFormattedDate(new Date()), 
                tdee: result.tdee, 
                cal: result.cal,
                wChange: result.wChange,
                avgCals: result.avgCals, 
                goal: appUserSettings.wizardGoal || 'maintain'
            });
            appUserSettings.coachLastApplied = getFormattedDate(new Date());
            showToast('Targets applied automatically!');
        }

        appUserSettings.coachLastAdvice = advice.length > 0 ? advice : ["Great job! You are adhering perfectly to your plan across all metrics. Keep it up!"];
        saveData();
        renderDiary();
        modalCheckin.classList.add('hidden');
        renderCoachView();
    });

    // ==========================================
    // 9. DATA IMPORT (EXCEL .xlsx)
    // ==========================================

    // Erase All Account Data — Custom Modal
    const modalEraseAll = document.getElementById('modal-erase-all');

    document.getElementById('btn-erase-all').addEventListener('click', () => {
        modalEraseAll.classList.remove('hidden');
    });
    document.getElementById('modal-erase-all-close').addEventListener('click', () => {
        modalEraseAll.classList.add('hidden');
    });
    document.getElementById('modal-erase-all-cancel').addEventListener('click', () => {
        modalEraseAll.classList.add('hidden');
    });
    document.getElementById('modal-erase-all-confirm').addEventListener('click', () => {
        // Wipe all logs and targets; keep profile identity (name, age, sex)
        localStorage.removeItem('tdee_data');
        localStorage.removeItem('tdee_targets');
        // Clear coach-related fields from user settings but keep profile
        appUserSettings.coachHistory = [];
        appUserSettings.coachLastApplied = null;
        appUserSettings.wizardGoal = null;
        appUserSettings.wizardWeight = null;
        localStorage.setItem('tdee_user_settings', JSON.stringify(appUserSettings));
        // Reload — initialization will detect no targets and show the wizard
        location.reload();
    });

    // Clear Overwritten Data — Custom Modal
    const modalClearOverwrite = document.getElementById('modal-clear-overwrite');

    document.getElementById('btn-clear-overwrite').addEventListener('click', () => {
        modalClearOverwrite.classList.remove('hidden');
    });

    document.getElementById('modal-clear-overwrite-close').addEventListener('click', () => {
        modalClearOverwrite.classList.add('hidden');
    });

    document.getElementById('modal-clear-overwrite-cancel').addEventListener('click', () => {
        modalClearOverwrite.classList.add('hidden');
    });

    document.getElementById('modal-clear-overwrite-confirm').addEventListener('click', () => {
        let clearedCount = 0;
        Object.keys(appData).forEach(date => {
            const day = appData[date];
            if (day.macroOverwritten) {
                day.foods = [];
                day.macroOverwritten = false;
                clearedCount++;
            }
            if (day.weightOverwritten) {
                day.weight = null;
                day.weightOverwritten = false;
                clearedCount++;
            }
        });

        saveData();
        renderDiary();
        renderWeightView();
        updateChart(30);
        modalClearOverwrite.classList.add('hidden');
        showToast(clearedCount > 0 ? 'Overwritten data cleared!' : 'No overwritten data found.');
    });

    document.getElementById('file-import-excel').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = evt.target.result;
                const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
                
                // Parse Sheet 1 (Macros)
                if (workbook.SheetNames.length > 0) {
                    const macroSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const macroData = XLSX.utils.sheet_to_json(macroSheet, { raw: false, dateNF: 'yyyy-mm-dd' });
                    
                    macroData.forEach(row => {
                        let dateVal, cals=0, p=0, c=0, f=0;
                        Object.keys(row).forEach(k => {
                            const kt = k.trim().toLowerCase();
                            if (kt === 'date') dateVal = row[k];
                            else if (kt.includes('calories')) cals = parseFloat(row[k]) || 0;
                            else if (kt.includes('prote')) p = parseFloat(row[k]) || 0;
                            else if (kt.includes('carb')) c = parseFloat(row[k]) || 0;
                            else if (kt.includes('fat') && !kt.includes('percent')) f = parseFloat(row[k]) || 0;
                        });

                        if (!dateVal) return;
                        
                        let isoDate = "";
                        if (typeof dateVal === 'string') {
                            const str = dateVal.trim();
                            if (str.includes('/')) {
                                const parts = str.split('/');
                                if (parts.length === 3) {
                                    let year = parts[2].trim();
                                    if (year.length === 2) year = '20' + year;
                                    isoDate = `${year}-${parts[0].trim().padStart(2, '0')}-${parts[1].trim().padStart(2, '0')}`;
                                }
                            } else if (str.match(/^\d{4}-\d{2}-\d{2}/)) {
                                isoDate = str.substring(0, 10);
                            }
                        } else if (dateVal instanceof Date) {
                            isoDate = getFormattedDate(dateVal);
                        } else if (typeof dateVal === 'number') {
                            const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                            isoDate = getFormattedDate(d);
                        }
                        
                        if (isoDate) {
                            ensureDateExists(isoDate);
                            
                            appData[isoDate].foods = [{
                                name: 'Imported History',
                                amount: '1 day',
                                meal: 'Meal 1',
                                cals: cals,
                                p: p,
                                c: c,
                                f: f,
                                fiber: 0,
                                satfat: 0
                            }];
                            
                            appData[isoDate].macroOverwritten = true;
                        }
                    });
                }
                
                // Parse Sheet 2 (Weight & BF)
                if (workbook.SheetNames.length > 1) {
                    const weightSheet = workbook.Sheets[workbook.SheetNames[1]];
                    const weightData = XLSX.utils.sheet_to_json(weightSheet, { raw: false, dateNF: 'yyyy-mm-dd' });
                    
                    let latestDateInt = 0;
                    let latestBF = null;

                    weightData.forEach(row => {
                        let dateVal, w=0, bfRaw;
                        Object.keys(row).forEach(k => {
                            const kt = k.trim().toLowerCase();
                            if (kt === 'date') dateVal = row[k];
                            else if (kt.includes('weight')) w = parseFloat(row[k]) || 0;
                            else if (kt.includes('percent') || kt.includes('bf')) bfRaw = row[k];
                        });

                        if (!dateVal) return;
                        
                        let isoDate = "";
                        if (typeof dateVal === 'string') {
                            const str = dateVal.trim();
                            if (str.includes('/')) {
                                const parts = str.split('/');
                                if (parts.length === 3) {
                                    let year = parts[2].trim();
                                    if (year.length === 2) year = '20' + year;
                                    isoDate = `${year}-${parts[0].trim().padStart(2, '0')}-${parts[1].trim().padStart(2, '0')}`;
                                }
                            } else if (str.match(/^\d{4}-\d{2}-\d{2}/)) {
                                isoDate = str.substring(0, 10);
                            }
                        } else if (dateVal instanceof Date) {
                            isoDate = getFormattedDate(dateVal);
                        } else if (typeof dateVal === 'number') {
                            const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                            isoDate = getFormattedDate(d);
                        }
                        
                        if (isoDate) {
                            ensureDateExists(isoDate);
                            
                            if (w > 0) {
                                appData[isoDate].weight = w;
                                appData[isoDate].weightOverwritten = true;
                            }
                            
                            if (bfRaw !== undefined && bfRaw !== '') {
                                const bf = parseFloat(bfRaw);
                                if (!isNaN(bf)) {
                                    const intDate = parseInt(isoDate.replace(/-/g, ''));
                                    if (intDate > latestDateInt) {
                                        latestDateInt = intDate;
                                        latestBF = bf;
                                    }
                                }
                            }
                        }
                    });
                    
                    if (latestBF !== null) {
                        appUserSettings.bf = latestBF;
                        calculateProfileLBM();
                    }
                }
                
                saveData();
                renderDiary();
                renderWeightView();
                updateChart(30);
                renderSettings();
                showToast('Excel Data Imported Successfully!');
                
            } catch (err) {
                console.error(err);
                showToast('Error parsing Excel File.');
            }
        };
        reader.readAsBinaryString(file);
        
        e.target.value = '';
    });
});
