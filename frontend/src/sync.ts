import { db, type UserProfile } from './db';

const API_BASE_URL = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.startsWith('192.168.')
  ? `http://${location.hostname}:3001/api`
  : 'https://dietcoach-bff.onrender.com/api';

/**
 * Sync local data with the BFF server
 */
export async function syncOfflineData(): Promise<{ success: boolean; syncedMealsCount: number; syncedWeightsCount: number }> {
  let syncedMealsCount = 0;
  let syncedWeightsCount = 0;

  if (!navigator.onLine) {
    console.log('No internet connection. Synchronization is deferred.');
    return { success: false, syncedMealsCount, syncedWeightsCount };
  }

  try {
    // 1. Sync unsynced weight logs
    const unsyncedWeights = await db.weightLogs.where('synced').equals(0).toArray();
    for (const log of unsyncedWeights) {
      const response = await fetch(`${API_BASE_URL}/weight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_982341',
          weight: log.weight,
          date: log.date,
          body_fat: log.body_fat,
          waist: log.waist,
          hip: log.hip,
          arm: log.arm,
          upper_body: log.upper_body,
          leg: log.leg,
          progress_pic: log.progress_pic
        })
      });

      if (response.ok) {
        await db.weightLogs.update(log.id!, { synced: 1 });
        syncedWeightsCount++;
      }
    }

    // 2. Sync unsynced meals
    const unsyncedMeals = await db.meals.where('synced').equals(0).toArray();
    for (const meal of unsyncedMeals) {
      const response = await fetch(`${API_BASE_URL}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_982341',
          name: meal.name,
          category: meal.category,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          date: meal.date
        })
      });

      if (response.ok) {
        await db.meals.update(meal.id!, { synced: 1 });
        syncedMealsCount++;
      }
    }

    // 3. Send local profile to server for bidirectional sync
    const localProfile = await db.profile.get('usr_982341');
    if (localProfile) {
      await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localProfile)
      });
    }

    // 4. Download latest user profile from server and merge with local data
    const profileResponse = await fetch(`${API_BASE_URL}/auth/profile?userId=usr_982341`);
    if (profileResponse.ok) {
      const serverProfile: UserProfile = await profileResponse.json();
      const mergedProfile = { ...localProfile, ...serverProfile } as UserProfile;
      await db.profile.put(mergedProfile);
    }

    console.log(`Sync complete. Meals: ${syncedMealsCount}, Weights: ${syncedWeightsCount}`);
    return { success: true, syncedMealsCount, syncedWeightsCount };
  } catch (error) {
    console.error('Error during data synchronization:', error);
    return { success: false, syncedMealsCount, syncedWeightsCount };
  }
}
