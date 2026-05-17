export const dashboardMetrics = [
  { label: 'Calories', value: '1,840', delta: '-120 vs goal' },
  { label: 'Protein', value: '128g', delta: '+18g today' },
  { label: 'Water', value: '2.4L', delta: '3.0L target' },
  { label: 'Sleep', value: '7h 18m', delta: 'AI score 86' },
];

export const macroSplit = [
  { label: 'Protein', value: 42, color: '#61E18C' },
  { label: 'Carbs', value: 34, color: '#54E1C1' },
  { label: 'Fat', value: 24, color: '#F6B93B' },
];

export const mealPlan = [
  {
    meal: 'Breakfast',
    title: 'Moong chilla + mint curd',
    calories: 420,
    note: 'High protein, low glycemic load',
  },
  {
    meal: 'Lunch',
    title: 'Paneer bowl with quinoa',
    calories: 560,
    note: 'Balanced macros for muscle retention',
  },
  {
    meal: 'Dinner',
    title: 'Grilled tofu + veggies',
    calories: 430,
    note: 'Light dinner for recovery',
  },
  {
    meal: 'Snack',
    title: 'Greek yogurt + berries',
    calories: 180,
    note: 'Supports satiety and gut health',
  },
];

export const groceryList = ['Paneer', 'Tofu', 'Greek yogurt', 'Quinoa', 'Moong dal', 'Spinach', 'Berries', 'Almonds'];

export const foodAnalysis = {
  food: 'Paneer Butter Masala',
  calories: 420,
  protein: '18g',
  carbs: '25g',
  fat: '22g',
  fiber: '4g',
  sugar: '8g',
  portionSize: '1 medium bowl',
  healthScore: 71,
  warnings: ['High saturated fat', 'Moderate sugar'],
  nutrients: { protein: 18, carbs: 25, fat: 22, fiber: 4, sugar: 8 },
  models: ['YOLOv8', 'TensorFlow Lite', 'MobileNet'],
  dataset: 'Food101 + custom Indian food dataset',
};

export const healthInsights = [
  'Daily calorie trend is 8% below target, which supports fat-loss goals.',
  'Protein timing is strong around workouts, but breakfast can be improved.',
  'Sleep consistency predicts better appetite control over the next 10 days.',
  'Water intake is stable but still short of the full hydration target.',
];

export const notifications = [
  'Water reminder in 12 minutes',
  'Dinner window opens in 35 minutes',
  'Workout recovery alert: log protein within 60 minutes',
];

export const chatbotPrompts = [
  'Suggest a high-protein Indian vegetarian diet under 1800 calories.',
  'What should I eat after a workout?',
  'Generate a keto-friendly grocery list for 7 days.',
];

export const analyticsBars = [72, 68, 78, 81, 74, 85, 88];
