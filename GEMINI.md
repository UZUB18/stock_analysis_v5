# Long-Only Stock Protocol (LOSP) Framework

## Project Overview
The LOSP Framework is an AI-driven, hybrid stock analysis application designed to generate institutional-grade capital allocation memorandums. It features a modern web interface built with React, Vite, Tailwind CSS, and Framer Motion, alongside an API-first local backend powered by Express and Node.js. 

The core research and analysis engine utilizes the **Gemini 3.0 Flash Preview** API. It performs high-depth reasoning with real-time Google Search grounding and Python code execution to calculate complex financial ratios, ensuring mathematical accuracy. The system enforces strict, structured JSON outputs based on canonical Zod schemas, which the backend validates and repairs as necessary before serving to the frontend.

## Building and Running

The project utilizes `npm` for package management and `concurrently` to run both the frontend and backend simultaneously during development.

### Prerequisites
- Node.js (v18+)
- A Gemini API Key (set as `GEMINI_API_KEY` in a `.env` file)

### Key Commands
- **Install Dependencies:**
  ```bash
  npm install
  ```
- **Start Development Servers (Frontend on port 3000, Backend on port 3001):**
  ```bash
  npm run dev
  ```
- **Run the Test Suite (Validates schemas and endpoints):**
  ```bash
  npm run test
  ```
- **Build for Production (Frontend):**
  ```bash
  npm run build
  ```

## Development Conventions

- **Language:** The entire stack (frontend and backend) is written in **TypeScript**.
- **Data Validation (Backend):** **Zod** (`server/schema.ts`) is the canonical source of truth for data contracts. The backend strictly validates all AI-generated JSON against these schemas (Single-stock and Basket comparison schemas) and will trigger an automated repair prompt if the output is incomplete or invalid.
- **AI Prompts:** Instructions for the AI (located in `server/analyze.ts`) enforce high-rigor institutional persona behaviors, such as mandatory multi-method valuations, anti-bias checks, and strict tagging in Markdown memos (`[Fact]`, `[Estimate]`, etc.).
- **Data Persistence:** Historical analysis requests are persisted locally using a SQLite database (`data/history.db`) via `better-sqlite3`.
- **UI Styling:** The frontend is styled using **Tailwind CSS** and animated with **Framer Motion**. Charts are rendered using **Recharts**.
- **Resilience:** The system is designed to handle mixed response shapes gracefully, allowing for backwards compatibility with legacy flat data structures while preferring the newer nested schemas.