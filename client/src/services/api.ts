const BASE_URL = 'http://localhost:4000';

export type ChatNutritionistResponse = {
  response: string;
  followUps: string[];
  ragSources: string[];
};

export type FoodAnalysisResponse = {
  food: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  portionSize: string;
  healthScore: number;
  warnings: string[];
  models?: string[];
  dataset?: string;
  nutrients?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
};

export type DashboardSummaryResponse = {
  caloriesToday: number;
  caloriesGoal: number;
  weeklyTrend: number[];
  macroBalance: {
    protein: number;
    carbs: number;
    fat: number;
  };
  goalCompletion: number;
  hydrationScore: number;
  habitScore: number;
  insights: string[];
  updatedAt: string;
};

type RequestOptions = {
  path: string;
  method?: 'GET' | 'POST';
  body?: unknown;
};

async function request<T>({ path, method = 'GET', body }: RequestOptions): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getHealth: () => request<{ status: string }>({ path: '/health' }),
  getSummary: () => request<DashboardSummaryResponse>({ path: '/stats/summary' }),
  analyzeFood: (payload: { imageUri?: string; imageData?: string }) => request<FoodAnalysisResponse>({ path: '/ai/food-recognition', method: 'POST', body: payload }),
  getRecommendation: (payload: Record<string, unknown>) => request({ path: '/ai/recommendation', method: 'POST', body: payload }),
  getMealPlan: (payload: Record<string, unknown>) => request({ path: '/ai/meal-plan', method: 'POST', body: payload }),
  scanBarcode: (payload: { barcode: string }) => request({ path: '/ai/barcode', method: 'POST', body: payload }),
  predictHealth: (payload: Record<string, unknown>) => request({ path: '/ai/predict', method: 'POST', body: payload }),
  chatNutritionist: (payload: Record<string, unknown>) => request<ChatNutritionistResponse>({ path: '/ai/chat', method: 'POST', body: payload }),
};
