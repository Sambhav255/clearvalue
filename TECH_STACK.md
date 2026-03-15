# ClearValue — Tech Stack Definition

---

## Core Framework
| Technology | Version | Reason |
|---|---|---|
| React | 18.x | Component model ideal for multi-step wizard with shared state |
| TypeScript | 5.x | Type safety on financial model prevents silent calculation errors |
| Vite | 5.x | Fast dev server, same as CardSense — familiar setup |

---

## Styling
| Technology | Reason |
|---|---|
| Tailwind CSS | Utility-first, fast to build dark enterprise UI, no CSS file sprawl |
| No component library | Keeps bundle small, full control over Everpure brand aesthetic |

**Color tokens to define in tailwind.config.ts:**
```typescript
colors: {
  navy: {
    900: '#0F172A',  // page background
    800: '#1A2744',  // primary brand navy
    700: '#1E293B',  // card background
  },
  orange: {
    500: '#F97316',  // primary accent / CTA buttons
    400: '#FB923C',  // hover state
  },
  slate: {
    100: '#F1F5F9',  // primary text
    400: '#94A3B8',  // secondary text / labels
  }
}
```

---

## Data Visualization
| Technology | Version | Reason |
|---|---|---|
| Recharts | 2.x | React-native, composable, supports both BarChart and custom waterfall. Lightweight. Same pattern as most fintech dashboards. |

**Charts needed:**
- `<BarChart>` — grouped bars for Legacy vs Everpure per value lever (Screen 2, Section C)
- Four `<BarChart>` single-bar cards — one per value lever in breakdown section (Screen 2, Section D)

**Do NOT use:** Chart.js (imperative API fights with React), D3 (overkill, too much custom code risk)

---

## AI Integration
| Technology | Reason |
|---|---|
| Google Gemini API (gemini-1.5-flash) | Familiar from CardSense. Fast, cheap, handles prose generation well. |
| Native fetch (no SDK) | Keeps dependencies minimal. Same pattern used in CardSense. |

**API call structure:**
```typescript
// lib/geminiApi.ts
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

export async function generateExecutiveSummary(params: SummaryParams): Promise<string> {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(params) }] }],
      generationConfig: {
        temperature: 0.4,      // Low temp = consistent, professional tone
        maxOutputTokens: 400,  // ~220 words
      }
    })
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

---

## State Management
| Technology | Reason |
|---|---|
| React useState + useContext | No Redux needed. Two contexts cover everything: InputContext (form state) and ResultsContext (computed TCO). |
| No Zustand / Redux | Overkill for a 4-screen wizard with no async state complexity beyond one API call |

**Context structure:**
```typescript
// Two contexts only
InputContext   — stores all user inputs from Screen 1
ResultsContext — stores computed TCO results derived from inputs
```

---

## Routing
| Technology | Reason |
|---|---|
| React Router v6 | Clean URL-based navigation between screens. Enables "← Back" without prop drilling. |

**Routes:**
```
/           → Landing page (Screen 0)
/inputs     → Company profile & environment inputs (Screen 1)
/dashboard  → TCO comparison dashboard (Screen 2)
/summary    → AI executive summary (Screen 3)
```

**Navigation guard:** If user navigates directly to /dashboard or /summary without inputs, redirect to /inputs.

---

## Icons
| Technology | Reason |
|---|---|
| Lucide React | Clean, consistent, tree-shakeable. Use for lever icons, info tooltips, nav arrows. |

---

## Tooltip Component
| Technology | Reason |
|---|---|
| @radix-ui/react-tooltip | Accessible, headless, zero styling conflict. Used only for assumption tooltips on Screen 2. |

```bash
npm install @radix-ui/react-tooltip
```

---

## Formatting Utilities
No library needed. Write two small utility functions in `lib/formatters.ts`:

```typescript
export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

export const formatCurrencyFull = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
```

---

## Deployment
| Technology | Reason |
|---|---|
| Vercel | Same as CardSense. Zero config, instant deploy from GitHub, handles env vars cleanly. |

**Environment variables needed:**
```
VITE_GEMINI_API_KEY=your_key_here
```

**Deploy command:**
```bash
npm run build
# Push to GitHub → Vercel auto-deploys
```

---

## Development Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.12.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-tooltip": "^1.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

---

## File Structure
```
clearvalue/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Reusable button with variants
│   │   │   ├── Card.tsx            # Dark card wrapper
│   │   │   ├── Tooltip.tsx         # Radix tooltip wrapper
│   │   │   ├── KPICard.tsx         # Summary metric card
│   │   │   └── StepIndicator.tsx   # Progress bar across screens
│   │   ├── screens/
│   │   │   ├── LandingScreen.tsx   # Screen 0
│   │   │   ├── InputsScreen.tsx    # Screen 1
│   │   │   ├── DashboardScreen.tsx # Screen 2
│   │   │   └── SummaryScreen.tsx   # Screen 3
│   │   └── charts/
│   │       ├── ComparisonBarChart.tsx   # Grouped bar: Legacy vs Everpure
│   │       └── LeverBreakdownChart.tsx  # Per-lever bar
│   ├── context/
│   │   ├── InputContext.tsx        # All form state
│   │   └── ResultsContext.tsx      # Computed TCO results
│   ├── lib/
│   │   ├── tcoModel.ts             # ALL financial formulas — pure functions
│   │   ├── benchmarks.ts           # Company size preset values
│   │   ├── geminiApi.ts            # API call + prompt builder
│   │   └── formatters.ts           # Currency + number formatters
│   ├── types/
│   │   └── index.ts                # All shared TypeScript interfaces
│   ├── App.tsx                     # Router setup
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind directives only
├── .env                            # VITE_GEMINI_API_KEY
├── .env.example                    # Committed to repo (no key)
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## What NOT to Use
| Tool | Why Not |
|---|---|
| Next.js | Server-side rendering adds complexity with no benefit for a demo tool |
| Redux / Zustand | Overkill — two React contexts are sufficient |
| Material UI / Chakra | Too opinionated, would fight the custom Everpure dark theme |
| Chart.js | Imperative API is messy in React, Recharts is purpose-built for React |
| Axios | Native fetch is sufficient for one API call |
| date-fns | Not needed — only current date used, handled with `new Date()` |
