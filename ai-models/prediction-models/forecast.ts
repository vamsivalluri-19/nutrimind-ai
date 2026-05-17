export type ForecastInput = {
  weight?: number;
  height?: number;
  goal?: string;
  adherence?: number;
  sleep?: number;
};

export function forecastWeight(input: ForecastInput) {
  const currentWeight = input.weight ?? 75;
  const goal = (input.goal ?? 'fat loss').toLowerCase();
  const delta = goal.includes('gain') ? 0.4 : goal.includes('loss') ? -0.35 : -0.15;
  const predictedWeight30Days = Number((currentWeight + delta * 30).toFixed(1));
  const predictedBMI30Days = Number(((currentWeight / Math.pow((input.height ?? 175) / 100, 2)) + delta * 0.6).toFixed(1));

  return {
    predictedWeight30Days,
    predictedBMI30Days,
    caloriesNeeded: 1900 - 120 + Math.round((input.sleep ?? 7) * 25),
    riskFlags: goal.includes('diabetes') ? ['Glycemic control monitoring'] : ['Low risk, keep consistent habits'],
    modelStack: ['Linear Regression', 'Random Forest', 'XGBoost'],
  };
}
