# NutriMind AI

NutriMind AI is a cross-platform mobile nutrition app scaffold built with React Native and a mocked Express backend.

## What is included
- Dark, glassmorphism-style mobile UI
- Authentication flow screens
- AI nutrition dashboard, camera scanner, meal planner, fitness tracker, chatbot, analytics, and profile screens
- Mock backend endpoints for AI food recognition, recommendations, meal planning, barcode analysis, prediction, and chat
- AI model placeholders under `ai-models/`

## Structure
- `client/` - Expo mobile app
- `server/` - Express API with mocked AI logic
- `ai-models/` - placeholder AI/ML modules and model notes

## Run locally
Install dependencies in each workspace, then start the app and API.

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run server
npm run client
```

## Notes
This scaffold is designed to be extended into a production system with real ML inference, mobile camera integrations, health platform connectors, and secure auth.
