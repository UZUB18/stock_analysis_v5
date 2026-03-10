# How to Use the Long-Only Stock Protocol (LOSP) App

This application is a hybrid system that uses a React frontend, an Express backend, and the autonomous Gemini CLI to generate detailed stock analysis reports.

## Prerequisites
- Node.js (v18 or higher) installed on your system.
- Gemini CLI installed and authenticated.
- The `long-only-stock-protocol` skill configured in your Gemini CLI environment.

## Step-by-Step Instructions

### Step 1: Start the Application Servers
Open a terminal in the project root directory and run the following commands to install the necessary dependencies and start both the Vite frontend and Express backend:

```bash
npm install
npm run dev
```
*This will start the frontend on `http://localhost:3000` and the backend API on `http://localhost:3001`.*

### Step 2: Request an Analysis in the Web UI
1. Open your web browser and navigate to `http://localhost:3000`.
2. Enter a stock ticker symbol (e.g., `AAPL`, `TSLA`) into the execution terminal input on the landing page.
3. Press **EXECUTE**.
4. The UI will transition into a "Processing" state. It is now actively polling the backend, waiting for the report files to be generated.

### Step 3: Execute the AI Agent (via Gemini CLI)
The actual analysis is performed by the Gemini CLI. Open a **new, separate terminal window**, start the Gemini CLI, and issue a command to run the analysis. 

For example, if you requested `TSLA` in the Web UI, give the Gemini CLI the following prompt:

> "Analyze TSLA using the long-only-stock-protocol. Save the output memo as `data/reports/TSLA_memo.md` and the structured metrics as `data/reports/TSLA_data.json`."

### Step 4: View the Results
1. The Gemini CLI will autonomously research the stock and eventually write the two requested files (`_memo.md` and `_data.json`) to the `data/reports/` directory.
2. The moment those files are saved, the web UI will automatically detect them, exit the "Processing" state, and render the interactive dashboard with charts, scores, and the full markdown text.
3. If you return to the home page, the analyzed ticker will now appear in your "Recent Memorandums" history for quick access later.