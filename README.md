# Long-Only Stock Protocol (LOSP) Framework

An AI-driven, hybrid stock analysis framework combining a modern React web interface, a local Express backend, and the autonomous Gemini CLI to generate institutional-grade capital allocation memorandums.

## 🧠 System Architecture

The LOSP Framework is not a traditional web app. It is a **CLI-driven hybrid system**. The web interface acts as a beautiful, animated dashboard and request queue, while the actual heavy lifting (financial research, multiple-scenario valuation, bias-checking) is performed by an autonomous AI agent operating within the Gemini CLI.

### Data Flow & Lifecycle
1. **Trigger:** A user enters a stock ticker (e.g., `AAPL`) into the Web UI.
2. **Queueing:** The React frontend sends an HTTP request to the local Express backend, which writes a request file to the local filesystem (`data/requests/AAPL.json`).
3. **Polling (The Gauntlet):** The Web UI enters a "Processing" state, displaying terminal-like logs while polling the backend every 3 seconds for the completed report.
4. **Autonomous Execution:** The user commands the Gemini CLI (running in a separate terminal) to analyze the stock using the `long-only-stock-protocol` skill.
5. **Report Generation:** The Gemini CLI completes its research and writes two structured files to the filesystem:
   - `data/reports/{TICKER}_data.json` (Structured metrics: confidence score, targets, FCF, etc.)
   - `data/reports/{TICKER}_memo.md` (The full text markdown analysis)
6. **Resolution:** The Express backend detects the new files, serves them to the polling frontend, and the UI instantly transitions to display the completed Dashboard and Memo.

---

## 📂 Codebase Overview

### 1. Frontend (`/src`)
Built with React, Vite, Tailwind CSS, Framer Motion, and Recharts.
- **`App.tsx`:** The central state manager. Handles transitions between the Landing, Processing, and Report views.
- **`Landing.tsx`:** The entry point. Features a cursor-following pulsing background, a sleek input form, and a dynamically fetched "Recent Memorandums" history grid.
- **`Processing.tsx`:** The loading state. Simulates a 14-step "gauntlet" execution log while quietly polling `/api/status/:ticker` in the background.
- **`SingleStockReport.tsx`:** The result dashboard. Parses the `_data.json` and `_memo.md` files from the backend, animating the data into interactive charts (Recharts), dynamic score dials, and rendering the markdown text.

### 2. Backend (`/server`)
Built with Node.js and Express.
- **`index.ts`:** A lightweight API server running on port `3001`. 
  - `POST /api/analyze`: Receives analysis requests from the UI.
  - `GET /api/status/:ticker`: Checks if the CLI has finished generating the specific report files.
  - `GET /api/history`: Scans the `data/reports/` folder to return a list of all historically generated memos for the Landing page.

### 3. Data Layer (`/data`)
The local filesystem acts as the database, making it extremely easy for the CLI agent to interact with the web app without needing complex API keys or database connections.
- **`/data/requests`:** Where the frontend drops "I need this analyzed" tickets.
- **`/data/reports`:** Where the Gemini CLI drops the finished `.json` and `.md` files.

---

## 🛠️ What Was Modified from the Original Mockup

1. **Static to Dynamic:** Removed all the `Math.random()` data generation. The app now strictly adheres to real data provided by the AI agent via props.
2. **Local API Integration:** Introduced the Express backend and wired the React frontend to use real `fetch` calls instead of `setTimeout` simulated delays.
3. **History System:** Added a historical ledger that scans the local directory and surfaces past reports directly on the landing page for immediate viewing.
4. **UI Enhancements:** Added an interactive cursor-following ambient light (`useMotionValue` / `useSpring`) to the landing page to elevate the "terminal/hacker" aesthetic.
5. **Unified Development:** Configured `concurrently` in `package.json` so a single command spins up both the Vite frontend and the Express backend.

---

## 🚀 How to Run the Framework

### Prerequisites
- Node.js (v18+)
- Gemini CLI installed and authenticated.
- The `long-only-stock-protocol` skill configured in your Gemini CLI environment.

### 1. Start the Application
Open a terminal in the project root directory and run:
```bash
npm install
npm run dev
```
*This command uses `concurrently` to start the Vite frontend on `http://localhost:3000` and the Express backend on `http://localhost:3001`.*

### 2. Request an Analysis
1. Open your browser and navigate to `http://localhost:3000`.
2. Type a stock ticker (e.g., `TSLA`) into the execution terminal and press **EXECUTE**.
3. The UI will begin processing and enter a waiting state, polling the backend.

### 3. Execute the AI Agent (via Gemini CLI)
Open a new terminal window, start the Gemini CLI, and issue the command:
> *"Analyze TSLA using the long-only-stock-protocol. Save the output memo as `data/reports/TSLA_memo.md` and the structured metrics as `data/reports/TSLA_data.json`."*

### 4. View the Results
The moment the Gemini CLI finishes writing the files to the `data/reports/` directory, the web UI will automatically detect them, snap out of the processing state, and display the beautiful, interactive dashboard. 

If you return to the home page, `TSLA` will now permanently appear in your "Recent Memorandums" history section.
