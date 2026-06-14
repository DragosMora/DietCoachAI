import Dexie, { type Table } from 'dexie';

export interface LocalMeal {
  id?: number;
  name: string;
  category: string;    // "Meal 1", "Meal 2", etc.
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  satfat: number;
  amount: number;      // grams eaten
  date: string;        // YYYY-MM-DD
  synced: number;      // 0 = local only, 1 = synced to server
}

export interface LocalWeightLog {
  id?: number;
  weight: number;
  date: string;        // YYYY-MM-DD
  synced: number;
  body_fat?: number;
  waist?: number;
  hip?: number;
  arm?: number;
  upper_body?: number;
  leg?: number;
  progress_pic?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  current_weight: number;
  target_weight: number;
  height: number;
  goal: string;
  calorie_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  fiber_target: number;
  satfat_target: number;
  lift_weights?: boolean;
  activity_level?: number;
}

export class DietCoachDatabase extends Dexie {
  meals!: Table<LocalMeal>;
  weightLogs!: Table<LocalWeightLog>;
  profile!: Table<UserProfile>;

  constructor() {
    super('DietCoachDB');
    this.version(2).stores({
      meals: '++id, date, synced',
      weightLogs: '++id, date, synced',
      profile: 'id'
    });
  }
}

export const db = new DietCoachDatabase();
export default db;
