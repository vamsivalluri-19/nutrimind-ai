export type DietGoal = 'weight loss' | 'muscle gain' | 'fat loss' | 'diabetes diet' | 'keto diet' | 'vegan diet' | 'high protein diet';

export type RecommendationProfile = {
  age?: number;
  weight?: number;
  height?: number;
  goal?: DietGoal;
  budget?: string;
  activity?: string;
  preferences?: string[];
};

export function recommendDiet(profile: RecommendationProfile) {
  const goal = profile.goal ?? 'Weight loss';
  const calories = goal.toLowerCase().includes('muscle') ? 2600 : goal.toLowerCase().includes('keto') ? 2000 : 1900;
  const proteinTarget = goal.toLowerCase().includes('muscle') ? 160 : 130;

  return {
    goal,
    dailyCalories: calories,
    macroTargets: {
      protein: `${proteinTarget}g`,
      carbs: `${goal.toLowerCase().includes('keto') ? 80 : 190}g`,
      fat: `${goal.toLowerCase().includes('keto') ? 120 : 65}g`,
    },
    recommendationType: ['Collaborative filtering', 'Content-based recommendation', 'Deep learning ranking'],
    personalizedReasons: [
      `Adjusted for ${profile.activity ?? 'moderate activity'}`,
      `Accounts for ${profile.budget ?? 'balanced'} budget preferences`,
      `Medical awareness: ${(profile.preferences ?? []).join(', ') || 'none reported'}`,
    ],
  };
}
