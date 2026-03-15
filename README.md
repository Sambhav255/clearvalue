# ClearValue

AI-powered TCO and Business Case Generator. Build a defensible, CFO-ready business case in under 3 minutes.

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_gemini_api_key
npm run dev
```

## Build

```bash
npm run build
npm run preview   # serve dist/ locally
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), import the project and connect the repo.
3. Add environment variable: **`VITE_GEMINI_API_KEY`** = your Gemini API key (required for the Executive Summary feature).
4. Deploy. Client-side routes (`/inputs`, `/dashboard`, `/summary`) are handled by `vercel.json` rewrites.

Get a Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
