# ClearValue

AI-powered TCO and Business Case Generator. Build a defensible, CFO-ready business case in under 3 minutes.

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env and set VITE_HF_TOKEN=your_huggingface_token
npm run dev
```

### Where to put the API token

**In the project root, edit the `.env` file** (create it from `.env.example` if needed):

- **`VITE_HF_TOKEN`** — Your Hugging Face token (required for the Executive Summary on the Summary screen). The Executive Summary uses the Hugging Face Inference API with the Qwen model (`Qwen/Qwen3.5-27B:novita`).

Create a token at [Hugging Face → Settings → Access Tokens](https://huggingface.co/settings/tokens) with **"Inference Providers"** (or "Make calls to Inference Providers") permission. Restart `npm run dev` after changing `.env`.

## Build

```bash
npm run build
npm run preview   # serve dist/ locally
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), import the project and connect the repo.
3. Add environment variable: **`VITE_HF_TOKEN`** = your Hugging Face token (required for the Executive Summary feature).
4. Deploy. Client-side routes (`/inputs`, `/dashboard`, `/summary`) are handled by `vercel.json` rewrites.
