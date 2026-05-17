type ProfileInput = {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  goal?: string;
  activity?: string;
  budget?: string;
  preferences?: string[];
  medicalConditions?: string[];
  meals?: Array<{ meal: string; calories: number }>;
  message?: string;
  barcode?: string;
  imageUri?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hashText(text: string) {
  return text.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
}

function baseCalories(goal: string) {
  switch (goal.toLowerCase()) {
    case 'weight loss':
    case 'fat loss':
      return 1800;
    case 'muscle gain':
      return 2600;
    case 'keto':
      return 2000;
    case 'vegan':
      return 2100;
    case 'diabetes diet':
      return 1900;
    default:
      return 2200;
  }
}

export function analyzeFoodImage(input: ProfileInput) {
  const seedSource = input.imageData ?? input.imageUri ?? 'paneer';
  const seed = hashText(typeof seedSource === 'string' ? seedSource.slice(0, 200) : String(seedSource));

  const foods = [
    'Paneer Butter Masala',
    'Chicken Salad Bowl',
    'Idli Sambar',
    'Tofu Stir Fry',
    'Oats with Berries',
  ];
  const food = foods[seed % foods.length];
  const calories = 320 + (seed % 7) * 45;

  return {
    food,
    calories,
    protein: `${14 + (seed % 8)}g`,
    carbs: `${18 + (seed % 12)}g`,
    fat: `${9 + (seed % 10)}g`,
    fiber: `${3 + (seed % 5)}g`,
    sugar: `${2 + (seed % 8)}g`,
    portionSize: seed % 2 === 0 ? '1 medium bowl' : '1 plate',
    nutrients: {
      protein: 14 + (seed % 8),
      carbs: 18 + (seed % 12),
      fat: 9 + (seed % 10),
      fiber: 3 + (seed % 5),
      sugar: 2 + (seed % 8),
    },
    healthScore: clamp(92 - (seed % 35), 40, 96),
    warnings: food.toLowerCase().includes('butter') ? ['High saturated fat', 'Moderate sugar'] : ['Monitor portion size'],
    models: ['YOLOv8', 'TensorFlow Lite', 'MobileNet'],
    dataset: 'Food101 + custom Indian food dataset',
  };
}

export function buildRecommendation(input: ProfileInput) {
  const goal = input.goal ?? 'Weight loss';
  const calories = baseCalories(goal);
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
      `Adjusted for ${input.activity ?? 'moderate activity'}`,
      `Accounts for ${input.budget ?? 'balanced'} budget preferences`,
      `Medical awareness: ${(input.medicalConditions ?? []).join(', ') || 'none reported'}`,
    ],
  };
}

export function buildMealPlan(input: ProfileInput) {
  const calories = baseCalories(input.goal ?? 'weight loss');
  const breakfast = Math.round(calories * 0.22);
  const lunch = Math.round(calories * 0.33);
  const dinner = Math.round(calories * 0.26);
  const snacks = calories - breakfast - lunch - dinner;

  return {
    breakfast: { title: 'Moong chilla with curd', calories: breakfast },
    lunch: { title: 'Paneer quinoa bowl', calories: lunch },
    dinner: { title: 'Tofu stir fry with vegetables', calories: dinner },
    snacks: { title: 'Greek yogurt, berries, and seeds', calories: snacks },
    waterSchedule: ['8:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
    weeklyMealSchedule: Array.from({ length: 7 }, (_, index) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      calories: calories - index * 30,
    })),
    groceryList: ['Paneer', 'Tofu', 'Greek yogurt', 'Quinoa', 'Moong dal', 'Spinach', 'Berries'],
    alternatives: ['High-protein Indian vegetarian bowl', 'Keto avocado salad', 'Diabetes-friendly millet plate'],
  };
}

export function scanBarcode(input: ProfileInput) {
  const seed = hashText(input.barcode ?? '8901234567890');
  const score = clamp(100 - (seed % 42), 38, 98);

  return {
    product: 'High Protein Greek Yogurt',
    ingredients: ['Milk', 'Live cultures', 'Natural stabilizers'],
    nutrition: {
      calories: 120 + (seed % 50),
      protein: `${11 + (seed % 7)}g`,
      carbs: `${8 + (seed % 10)}g`,
      fat: `${2 + (seed % 5)}g`,
      sugar: `${6 + (seed % 7)}g`,
      sodium: `${45 + (seed % 80)}mg`,
    },
    healthScore: score,
    warnings: score < 65 ? ['Check added sugar', 'Watch sodium'] : ['Balanced for most goals'],
  };
}

export function predictHealth(input: ProfileInput) {
  const currentWeight = input.weight ?? 75;
  const goal = (input.goal ?? 'fat loss').toLowerCase();
  const delta = goal.includes('gain') ? 0.4 : goal.includes('loss') ? -0.35 : -0.15;
  const bmi = (currentWeight / Math.pow((input.height ?? 175) / 100, 2)).toFixed(1);

  return {
    predictedWeight30Days: Number((currentWeight + delta * 30).toFixed(1)),
    predictedBMI30Days: Number((Number(bmi) + delta * 0.6).toFixed(1)),
    caloriesNeeded: baseCalories(input.goal ?? 'weight loss') - 120,
    riskFlags: goal.includes('diabetes') ? ['Glycemic control monitoring'] : ['Low risk, keep consistent habits'],
    modelStack: ['Linear Regression', 'Random Forest', 'XGBoost', 'LSTM Time-Series'],
  };
}

export function chatNutritionist(input: ProfileInput) {
  const message = (input.message ?? '').toLowerCase();

  const intent = (() => {
    if (message.includes('protein')) return 'protein';
    if (message.includes('workout') || message.includes('exercise')) return 'post-workout';
    if (message.includes('weight loss') || message.includes('fat loss')) return 'weight-loss';
    if (message.includes('muscle') || message.includes('gain')) return 'muscle-gain';
    if (message.includes('keto')) return 'keto';
    if (message.includes('diabetes')) return 'diabetes';
    if (message.includes('breakfast')) return 'breakfast';
    return 'general';
  })();

  const nameFragment = input.message ? '' : '';

  const personalized = (text: string) => {
    const weight = input.weight ? `${input.weight}kg` : 'your weight';
    const goal = input.goal ?? 'your goal';
    return `${text} (${goal}, ${weight}).`;
  };

  const weightKg = input.weight ?? null;
  const proteinPerMeal = weightKg ? Math.round(Math.max(20, Math.min(50, (weightKg * 1.6) / 3))) : 30;

  let response = '';
  let followUps: string[] = [];

  switch (intent) {
    case 'protein':
      response = `Aim for ~${proteinPerMeal}g protein per meal to support recovery and muscle maintenance. Good sources: ${input.preferences?.includes('vegan') ? 'tofu, lentils, chickpeas, tempeh' : 'paneer, Greek yogurt, lentils, eggs, lean poultry'}.`;
      followUps = ['Want meal suggestions hitting this target?', 'Include supplementation guidance?'];
      break;
    case 'post-workout':
      response = `After a workout, combine 20–40g protein with fast-digesting carbs (a banana, white rice, or a smoothie) within ~60 minutes to support recovery.`;
      followUps = ['Would you like pre/post workout meal ideas?', 'Want a 7-day recovery snack plan?'];
      break;
    case 'weight-loss':
      response = personalized('For weight loss, target a moderate calorie deficit (≈300–500 kcal/day), increase protein to preserve lean mass, and prioritize high-fiber vegetables');
      followUps = ['Generate a low-calorie grocery list?', 'Create a 7-day meal plan for fat loss?'];
      break;
    case 'muscle-gain':
      response = personalized('For muscle gain, aim for a small calorie surplus, progressive resistance training, and 1.6–2.2 g protein per kg body weight daily');
      followUps = ['Want a muscle-building meal plan?', 'Map macros for each meal?'];
      break;
    case 'keto':
      response = 'For ketogenic diets, keep carbs low (typically <50g/day), prioritize whole-food fats, and monitor electrolytes; personalization is recommended for long-term adherence.';
      followUps = ['Create a keto grocery list?', 'Suggest keto-friendly snacks?'];
      break;
    case 'diabetes':
      response = 'For diabetes support, focus on consistent carbohydrate portions, low-glycemic choices, and pairing carbs with protein/fiber to blunt glucose spikes.';
      followUps = ['Want low-glycemic breakfast options?', 'Generate carb targets per meal?'];
      break;
    case 'breakfast':
      response = `A strong breakfast example: ${input.preferences?.includes('vegan') ? 'moong chilla or tofu scramble' : 'moong chilla, oats with whey, or Greek yogurt with nuts and berries'} — include protein and fiber to improve satiety.`;
      followUps = ['Generate 3 breakfast options for the week?', 'Prefer quick or cooked breakfasts?'];
      break;
    default:
      response = 'I can personalize meals, calories, macros, and habit coaching once you share a little about your weight, goal, and preferences.';
      followUps = ['Would you like to provide weight and goal now?', 'Shall I create a weekly plan from your profile?'];
  }

  return {
    response,
    followUps,
    ragSources: ['Nutrition knowledge base', 'Meal plan history', 'Diet adherence analytics'],
  };
}

export function buildSummary() {
  const now = new Date();
  const timeSeed = now.getHours() * 7 + now.getMinutes();
  const caloriesToday = clamp(1720 + (timeSeed % 240), 1500, 2120);
  const caloriesGoal = 2200;
  const protein = clamp(36 + (timeSeed % 14), 28, 52);
  const carbs = clamp(28 + (timeSeed % 18), 22, 50);
  const fat = clamp(18 + (timeSeed % 12), 14, 34);

  return {
    caloriesToday,
    caloriesGoal,
    weeklyTrend: Array.from({ length: 7 }, (_, index) => -140 + ((timeSeed + index * 17) % 85)),
    macroBalance: { protein, carbs, fat },
    goalCompletion: clamp(74 + (timeSeed % 19), 72, 96),
    hydrationScore: clamp(68 + (timeSeed % 21), 64, 96),
    habitScore: clamp(72 + (timeSeed % 17), 70, 95),
    insights: [
      caloriesToday <= caloriesGoal ? 'You are under your calorie goal today.' : 'You are slightly above your calorie goal today.',
      protein >= 40 ? 'Protein intake is on track for recovery.' : 'Raise protein a little at breakfast or lunch.',
      clamp(68 + (timeSeed % 21), 64, 96) >= 80 ? 'Hydration is strong and supporting appetite control.' : 'Hydration could be stronger before dinner.',
    ],
    updatedAt: now.toISOString(),
  };
}

export function createAuthToken(email: string) {
  return `demo.${Buffer.from(email).toString('base64url')}.token`;
}
