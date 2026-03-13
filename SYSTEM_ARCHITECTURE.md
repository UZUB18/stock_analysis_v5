# SYSTEM ARCHITECTURE: Gemini 3.0 API-First Framework

## Overview
This application uses an **API-first agentic backend**. The research and analysis loop is powered directly by the **Gemini 3.0 Flash Preview** API, with real-time web grounding, code execution, JSON-schema-constrained outputs, and server-side validation to produce institutional-style financial intelligence.

## Core Architecture

### 1. Request Flow
The system operates on a single-request, deterministic flow:
1. **Frontend (React/Vite)**: User inputs a ticker or comparison query.
2. **Backend (Express)**: Receives the request and identifies the mode (`single` or `basket`). The Express app is constructed via `createApp()` so it can be tested without a separately managed shell process.
3. **AI Engine (Gemini 3.0)**: Executes a high-depth reasoning cycle (`ThinkingLevel.HIGH`) using specialized prompts.
4. **Structured Contract**: The backend sends a generated JSON Schema (`responseJsonSchema`) derived from canonical Zod schemas.
5. **Validation + Repair**: The backend validates the AI response, checks required memo sections, formula evidence, valuation method distinctness, and retries once with targeted repair instructions if the output is incomplete.
6. **Delivery**: The backend returns a rich machine-readable `data` object plus a separate `memo` string for rendering.
7. **Frontend Fallback Handling**: If the API is unavailable or returns a non-success payload, the frontend preserves the query and surfaces an explicit error instead of silently resetting to the landing page.

### 2. The AI Engine: Gemini 3.0 Flash
The heart of the app is the `generateAnalysis` engine in `server/analyze.ts`. It utilizes three key features of the Gemini 3 API:

*   **Google Search Grounding**: Forces the model to fetch real-time 10-K filings, current stock prices, and market news rather than relying on training data.
*   **Code Execution (Python)**: The model writes and runs Python code to calculate complex financial ratios (ROE, FCF Conversion, etc.), eliminating mathematical hallucinations.
*   **Structured Output**: Uses `responseJsonSchema` generated from Zod to force the model toward the dashboard's full JSON contract rather than a thin summary shape.

### 3. Data Integrity & Schemas
We use **Zod** (`server/schema.ts`) as the canonical source of truth. The backend maintains two major contracts:
*   **Single-stock institutional schema**: A nested analysis object with `metadata`, `decision_gate`, `recommendation`, `thesis`, `business_quality`, `financial_quality`, `valuation`, `risk`, `monitoring`, `analyst_process`, and `comparison_fields`.
*   **Basket comparison schema**: `tickers`, `allocations`, `gauntlet_scores`, `garp_metrics`, and `memo_markdown`.

Every AI response is checked for:
*   **Type Safety**: Numbers, enums, and nested objects must match the canonical schema.
*   **Completeness**: Required memo sections, key analytical fields, and mandatory formula references must be present.
*   **Graceful Degradation**: Missing values must be `null` where allowed rather than invented.
*   **Cross-field Consistency**: Comparison fields, allocations, and memo sections are validated against the structured output.
*   **Score Canonicalization**: Basket gauntlet scores are canonical `0-100` integers on the backend.

### 4. Instructional Layer (The "Must-DOs")
The prompts in `server/analyze.ts` are dense, high-rigor instructions based on the **Institutional Equity Analyst** and **Portfolio Manager** personas. They enforce:
*   **Strict Tagging**: Use of `[Fact]`, `[Estimate]`, `[Derived]`, etc., in the Markdown memo.
*   **Structural Gates**: Immediate rejection of stocks with fraud or solvency red flags.
*   **Multi-Method Valuation**: Mandatory use of at least two valuation frameworks (e.g., DCF and Multiples).
*   **Anti-Bias Checks**: Required bear-case steel-manning and "why I could be wrong" sections.
*   **Schema Mapping**: Explicit mapping from analysis work into the nested JSON structure expected by the frontend.

### 5. Frontend Consumption Layer
The frontend intentionally supports mixed response shapes during transition:
*   **Single-stock dashboard**: Prefers the new nested schema but still tolerates the legacy flat fields as fallbacks.
*   **Basket dashboard**: Treats `0-100` as canonical, but normalizes older `0-10` basket gauntlet scores at render time so historic responses do not collapse the radar chart.
*   **History cards**: Detect basket entries from their shape (`tickers` + `allocations`) and render basket-specific summaries instead of assuming single-stock recommendation fields.
*   **Processing screen**: Uses a non-morphing SVG animation path to avoid runtime browser errors from invalid `d` attribute interpolation.

## Key Files
*   `server/index.ts`: The Express API entry point and health-check provider.
*   `server/analyze.ts`: The Gemini 3 integration logic and prompt library.
*   `server/schema.ts`: The Zod schemas enforcing data consistency.
*   `src/components/Processing.tsx`: The terminal-style loading animation that now waits for the cloud response.
*   `src/components/Landing.tsx`: The landing page and history UI, including backend error surfacing.
*   `src/components/BasketReport.tsx`: The basket comparison dashboard and legacy basket-score normalization.

## Development & Deployment
*   **API Key**: Requires `GEMINI_API_KEY` in a `.env` file.
*   **Environment**: The backend is decoupled from repo-tracked output files and is ready for cloud deployment (e.g., Render, Railway, Vercel).
*   **Health Metadata**: `/api/health` now returns `status`, `timestamp`, `version`, `contractVersion`, and `startedAt`, which makes stale local server processes easier to identify.
*   **History**: Persisted in a SQLite database (`data/history.db`) via `better-sqlite3`. The `/api/history` endpoint supports pagination (`?page=&limit=`) and individual entry deletion (`DELETE /api/history/:id`). The `server/db.ts` module uses WAL mode and prepared statements for performance.
*   **Testing**: The repo now includes an automated `npm test` path using Node's built-in test runner via `tsx --test`, covering validator logic and Express endpoints without live Gemini calls.

---
*This document serves as the official technical reference for the Long-Only Stock Protocol (LOSP) API implementation.*
