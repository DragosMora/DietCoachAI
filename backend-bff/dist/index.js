"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const initDb_1 = require("./initDb");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database initialization on start
(0, initDb_1.initializeDatabase)();
// 1. Profil Utilizator (Mocked / DB)
app.get('/api/auth/profile', async (req, res) => {
    try {
        const userId = req.query.userId || 'usr_982341';
        const result = await (0, db_1.query)('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/auth/profile', async (req, res) => {
    try {
        const { id, name, current_weight, target_weight, height, goal, calorie_target, protein_target, carbs_target, fat_target, fiber_target, satfat_target, lift_weights, activity_level } = req.body;
        const result = await (0, db_1.query)(`UPDATE users 
       SET name=$2, current_weight=$3, target_weight=$4, height=$5, goal=$6, 
           calorie_target=$7, protein_target=$8, carbs_target=$9, fat_target=$10,
           fiber_target=$11, satfat_target=$12, lift_weights=$13, activity_level=$14
       WHERE id=$1 RETURNING *`, [
            id || 'usr_982341',
            name,
            current_weight,
            target_weight,
            height,
            goal,
            calorie_target,
            protein_target,
            carbs_target,
            fat_target,
            fiber_target || 25,
            satfat_target || 20,
            lift_weights !== undefined ? lift_weights : false,
            activity_level !== undefined ? String(activity_level) : '1.3'
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 2. Weight Logging
app.get('/api/weight', async (req, res) => {
    try {
        const userId = req.query.userId || 'usr_982341';
        const result = await (0, db_1.query)('SELECT * FROM weight_logs WHERE user_id = $1 ORDER BY log_date DESC LIMIT 30', [userId]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/weight', async (req, res) => {
    try {
        const { userId, weight, date, body_fat, waist, hip, arm, upper_body, leg, progress_pic } = req.body;
        const targetUserId = userId || 'usr_982341';
        const targetDate = date || new Date().toISOString().split('T')[0];
        // Insert or update weight / metrics for the respective day
        const result = await (0, db_1.query)(`INSERT INTO weight_logs (user_id, weight, log_date, body_fat, waist, hip, arm, upper_body, leg, progress_pic) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (user_id, log_date) 
       DO UPDATE SET weight = $2, body_fat = $4, waist = $5, hip = $6, arm = $7, upper_body = $8, leg = $9, progress_pic = $10
       RETURNING *`, [
            targetUserId,
            weight,
            targetDate,
            body_fat !== undefined ? body_fat : null,
            waist !== undefined ? waist : null,
            hip !== undefined ? hip : null,
            arm !== undefined ? arm : null,
            upper_body !== undefined ? upper_body : null,
            leg !== undefined ? leg : null,
            progress_pic !== undefined ? progress_pic : null
        ]);
        // Update current weight in the user's main profile
        await (0, db_1.query)('UPDATE users SET current_weight = $1 WHERE id = $2', [weight, targetUserId]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/weight', async (req, res) => {
    try {
        const userId = req.query.userId || 'usr_982341';
        const date = req.query.date;
        if (!date) {
            return res.status(400).json({ error: 'Date query parameter is required' });
        }
        await (0, db_1.query)('DELETE FROM weight_logs WHERE user_id = $1 AND log_date = $2', [userId, date]);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 3. Meal Logging
app.get('/api/meals', async (req, res) => {
    try {
        const userId = req.query.userId || 'usr_982341';
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const result = await (0, db_1.query)('SELECT * FROM meals WHERE user_id = $1 AND log_date = $2 ORDER BY created_at ASC', [userId, date]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/meals', async (req, res) => {
    try {
        const { userId, name, category, calories, protein, carbs, fat, date } = req.body;
        const targetUserId = userId || 'usr_982341';
        const targetDate = date || new Date().toISOString().split('T')[0];
        const result = await (0, db_1.query)(`INSERT INTO meals (user_id, name, category, calories, protein, carbs, fat, log_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [targetUserId, name, category || 'breakfast', calories, protein, carbs, fat, targetDate]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete a meal
app.delete('/api/meals/:id', async (req, res) => {
    try {
        const mealId = parseInt(req.params.id);
        await (0, db_1.query)('DELETE FROM meals WHERE id = $1', [mealId]);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 4. Proxy to AI Service - Image Analysis (with Multipart)
// Use a raw handler since we forward the multipart file query further
app.post('/api/vision/analyze', async (req, res) => {
    try {
        // Since Express receives the data, the simplest proxy method is to forward
        // the request body directly to the Python microservice using raw/multipart format.
        const contentType = req.headers['content-type'];
        if (!contentType) {
            return res.status(400).json({ error: 'Missing Content-Type header' });
        }
        // Since we do not want to load large additional modules like multer,
        // we read the request body as a buffer and send it via fetch.
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
            const buffer = Buffer.concat(chunks);
            try {
                const response = await fetch(`${AI_SERVICE_URL}/v1/vision/analyze`, {
                    method: 'POST',
                    headers: {
                        'content-type': contentType,
                    },
                    body: buffer,
                });
                const data = await response.json();
                res.status(response.status).json(data);
            }
            catch (err) {
                console.error('Error calling AI service:', err);
                res.status(500).json({ error: 'AI service did not respond', details: err.message });
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 3.5. Food Search - Proxy to AI Service (USDA & Open Food Facts)
app.get('/api/food/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is missing' });
        }
        const response = await fetch(`${AI_SERVICE_URL}/v1/food/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: 'AI service error', details: errText });
        }
        const data = await response.json();
        res.json(data.results || []);
    }
    catch (error) {
        console.error('Error during food search:', error);
        res.status(500).json({ error: error.message });
    }
});
// 3.7. Barcode Search - Proxy to Open Food Facts API
app.get('/api/food/barcode/:barcode', async (req, res) => {
    try {
        const barcode = req.params.barcode;
        if (!barcode) {
            return res.status(400).json({ error: 'Barcode is missing' });
        }
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
            headers: {
                'User-Agent': 'DietCoachApp - WebApp - Version 2.0 - contact@dietcoach.ro'
            }
        });
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Open Food Facts service error' });
        }
        const data = await response.json();
        if (data.status !== 1 || !data.product) {
            return res.status(404).json({ error: 'Product not found in Open Food Facts' });
        }
        const prod = data.product;
        const nutr = prod.nutriments || {};
        const foodItem = {
            name: prod.product_name || prod.generic_name || `Product ${barcode}`,
            cals: parseFloat(nutr['energy-kcal_100g'] || nutr['energy_100g'] || 0),
            p: parseFloat(nutr['proteins_100g'] || 0),
            c: parseFloat(nutr['carbohydrates_100g'] || 0),
            f: parseFloat(nutr['fat_100g'] || 0),
            fiber: parseFloat(nutr['fiber_100g'] || 0),
            satfat: parseFloat(nutr['saturated-fat_100g'] || 0)
        };
        res.json(foodItem);
    }
    catch (error) {
        console.error('Error searching barcode:', error);
        res.status(500).json({ error: error.message });
    }
});
// 5. AI Coach Logic - Calculate Averages and Adjust Targets
app.post('/api/coach/adjust', async (req, res) => {
    try {
        const userId = req.body.userId || 'usr_982341';
        // Retrieve user profile
        const userResult = await (0, db_1.query)('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userResult.rows[0];
        // Calculate weight averages for the last 14 days
        // Current week (last 7 days): interval [now, now - 7 days]
        // Previous week: interval [now - 7 days, now - 14 days]
        const weightResult = await (0, db_1.query)(`SELECT 
         AVG(CASE WHEN log_date >= CURRENT_DATE - INTERVAL '7 days' THEN weight END) as current_avg,
         AVG(CASE WHEN log_date >= CURRENT_DATE - INTERVAL '14 days' AND log_date < CURRENT_DATE - INTERVAL '7 days' THEN weight END) as prev_avg
       FROM weight_logs
       WHERE user_id = $1`, [userId]);
        // Calculate average calorie consumption in the last week
        const calorieResult = await (0, db_1.query)(`SELECT COALESCE(SUM(calories), 0) / 7.0 as avg_calories
       FROM meals
       WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '7 days'`, [userId]);
        // BW logic: latest weight log if exists, otherwise initial/current weight
        const latestWeightResult = await (0, db_1.query)(`SELECT weight FROM weight_logs WHERE user_id = $1 ORDER BY log_date DESC, id DESC LIMIT 1`, [userId]);
        const bw = latestWeightResult.rows.length > 0
            ? parseFloat(latestWeightResult.rows[0].weight)
            : parseFloat(user.current_weight);
        const current_avg = parseFloat(weightResult.rows[0].current_avg) || bw;
        const prev_avg = parseFloat(weightResult.rows[0].prev_avg) || bw;
        const avg_calories = parseFloat(calorieResult.rows[0].avg_calories) || 2000.0;
        // Calculate logging compliance and progress
        // Total days logged with distinct weights
        const totalWeightDaysResult = await (0, db_1.query)(`SELECT COUNT(DISTINCT log_date) as count FROM weight_logs WHERE user_id = $1`, [userId]);
        const totalWeightDays = parseInt(totalWeightDaysResult.rows[0].count) || 0;
        // Total days logged with distinct meals
        const totalMealDaysResult = await (0, db_1.query)(`SELECT COUNT(DISTINCT log_date) as count FROM meals WHERE user_id = $1`, [userId]);
        const totalMealDays = parseInt(totalMealDaysResult.rows[0].count) || 0;
        // Number of days with meals in the last 7 days for compliance
        const mealDaysLast7Result = await (0, db_1.query)(`SELECT COUNT(DISTINCT log_date) as count 
       FROM meals 
       WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '7 days'`, [userId]);
        const mealDaysLast7 = parseInt(mealDaysLast7Result.rows[0].count) || 0;
        const hasEnoughData = (totalWeightDays >= 7 && totalMealDays >= 7);
        const targetCal = parseFloat(user.calorie_target) || 2000.0;
        const deviation = Math.abs(avg_calories - targetCal) / targetCal;
        const isCompliant = (mealDaysLast7 >= 6) && (deviation <= 0.15);
        // Call the Python microservice for recalculation
        const response = await fetch(`${AI_SERVICE_URL}/v1/coach/adjust`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_avg_weight: current_avg,
                prev_avg_weight: prev_avg,
                avg_daily_calories_consumed: avg_calories,
                weight: bw,
                goal: user.goal,
                lift_weights: !!user.lift_weights,
                target_change_rate_per_week: 0.5,
                default_tdee: 2500.0,
                activity_level: parseFloat(user.activity_level) || 1.3,
                has_enough_data: hasEnoughData,
                is_compliant: isCompliant,
                calorie_target: targetCal
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            return res.status(500).json({ error: 'AI service error', details: errText });
        }
        const aiData = await response.json();
        const { targets } = aiData.data || aiData;
        // Update new calorie and macronutrient targets in the user profile
        await (0, db_1.query)(`UPDATE users 
       SET calorie_target = $1, protein_target = $2, carbs_target = $3, fat_target = $4,
           fiber_target = $5, satfat_target = $6
       WHERE id = $7`, [targets.calories, targets.protein, targets.carbs, targets.fat, targets.fiber || 25, targets.satfat || 20, userId]);
        res.json({
            success: true,
            message: 'Nutritional targets processed by AI Coach',
            coach_status: aiData.coach_status || 'estimation',
            weight_days_logged: totalWeightDays,
            meal_days_logged: totalMealDays,
            meal_days_last_7: mealDaysLast7,
            calorie_deviation_pct: round(deviation * 100, 1),
            is_compliant: isCompliant,
            previous_targets: {
                calories: user.calorie_target,
                protein: user.protein_target,
                carbs: user.carbs_target,
                fat: user.fat_target,
                fiber: user.fiber_target,
                satfat: user.satfat_target
            },
            new_targets: targets,
            data_metrics: {
                current_avg_weight: round(current_avg, 2),
                prev_avg_weight: round(prev_avg, 2),
                avg_daily_calories: round(avg_calories, 0)
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
function round(val, decimals) {
    return parseFloat(val.toFixed(decimals));
}
app.listen(PORT, () => {
    console.log(`Node.js BFF running on http://localhost:${PORT}`);
});
