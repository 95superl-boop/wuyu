export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ActivityLevel {
  SEDENTARY = 1.2,          // 久坐
  LIGHTLY_ACTIVE = 1.375,   // 轻度活动
  MODERATELY_ACTIVE = 1.55, // 中度活动
  VERY_ACTIVE = 1.725,      // 高度活动
  EXTRA_ACTIVE = 1.9        // 极高度活动
}

export enum WeightLossIntensity {
  MILD = 300,    // 温和 (300 kcal/day)
  NORMAL = 500,  // 正常 (500 kcal/day)
  AGGRESSIVE = 800 // 激进 (800 kcal/day)
}

export enum WeeklyExerciseHours {
  TWO_THREE = '2-3',
  FOUR_FIVE = '4-5',
  SIX_SEVEN = '6-7',
  EIGHT_NINE = '8-9',
  TEN_PLUS = '10+'
}

export interface UserMetrics {
  gender: Gender;
  age: number;
  height: number;
  weight: number; // kg
  targetWeight: number; // kg
  activityLevel: ActivityLevel;
  intensity: WeightLossIntensity;
  weeklyExerciseHours: WeeklyExerciseHours;
}

export interface MacroPlan {
  carbs: number;
  protein: number;
  fat: number;
  totalKcal: number;
}

export interface CalculationResults {
  bmi: number;
  bfp: number;
  bmr: number;
  tdee: number;
  weightToLose: number;
  totalKcalDeficit: number;
  daysNeeded: number;
  recommendedIntake: number;
  macros: MacroPlan;
}
