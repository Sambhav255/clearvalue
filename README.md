# ClearValue

AI-powered TCO and Business Case Generator for enterprise 
storage decisions. Input your current environment, get a 
CFO-ready business case in under 3 minutes.

Built by Sambhav Lamichhane · March 2026  
Live demo: [clearvalue.vercel.app](https://clearvalue.vercel.app)

---

## Setup
```bash
npm install
cp .env.example .env
# Add your OpenRouter API key to .env (see below)
npm run dev
```

## Environment Variables

Create a `.env` file in the project root:
```
VITE_OPENROUTER_API_KEY=your_key_here
```

Get a free API key at [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys).  
The key is used only for the AI Executive Summary on the Summary screen.  
Set a spend limit on your key before sharing the app publicly.

## Build & Deploy
```bash
npm run build
npm run preview   # test production build locally
```

**Deploy to Vercel:**
1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `VITE_OPENROUTER_API_KEY`
4. Deploy — client-side routes are handled via `vercel.json`

## How it works

ClearValue models four value levers based on published research:

| Lever | Source |
|---|---|
| Power & Cooling | Western Digital 2024, Everpure ESG Report 2024 |
| Refresh Avoidance | Hitachi Vantara 2022, ESG Evergreen Study |
| Admin Labor | ESG Economic Validation of Pure1, 2022 |
| Downtime Risk | ITIC/EMA 2024, Everpure Evergreen//One SLA |

All assumptions are labeled as Published Source or Industry 
Estimate in the About This Tool section of the app.

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, Recharts, 
React Router v6, OpenRouter API (GPT-4.1-mini), Vercel