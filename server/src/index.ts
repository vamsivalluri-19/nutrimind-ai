import cors from 'cors';
import express from 'express';
import {
  analyzeFoodImage,
  buildMealPlan,
  buildRecommendation,
  buildSummary,
  chatNutritionist,
  createAuthToken,
  predictHealth,
  scanBarcode,
} from './mockEngine';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'nutrimind-ai-server' });
});

app.post('/auth/login', (request, response) => {
  const email = String(request.body?.email ?? 'demo@nutrimind.ai');
  response.json({ token: createAuthToken(email), user: { email, role: 'member' } });
});

app.post('/auth/register', (request, response) => {
  const email = String(request.body?.email ?? 'new@nutrimind.ai');
  response.json({ token: createAuthToken(email), otpSession: 'demo-otp-session' });
});

app.post('/auth/verify-otp', (_request, response) => {
  response.json({ verified: true, token: createAuthToken('verified@nutrimind.ai') });
});

app.post('/ai/food-recognition', (request, response) => {
  response.json(analyzeFoodImage(request.body ?? {}));
});

app.post('/ai/recommendation', (request, response) => {
  response.json(buildRecommendation(request.body ?? {}));
});

app.post('/ai/meal-plan', (request, response) => {
  response.json(buildMealPlan(request.body ?? {}));
});

app.post('/ai/barcode', (request, response) => {
  response.json(scanBarcode(request.body ?? {}));
});

app.post('/ai/predict', (request, response) => {
  response.json(predictHealth(request.body ?? {}));
});

app.post('/ai/chat', (request, response) => {
  response.json(chatNutritionist(request.body ?? {}));
});

app.get('/stats/summary', (_request, response) => {
  response.json(buildSummary());
});

// Root route for quick health/status checks
app.get('/', (_request, response) => {
  response.json({ status: 'ok', service: 'nutrimind-ai-server', message: 'API root. See /health for health status.' });
});

app.listen(port, () => {
  console.log(`NutriMind AI server running on http://localhost:${port}`);
});
