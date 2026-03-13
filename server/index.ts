import express, { type Express } from 'express';
import cors from 'cors';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { generateAnalysis, type AnalysisType, type GeneratedAnalysis } from './analyze.js';
import { initDb, type HistoryDb } from './db.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };
const CONTRACT_VERSION = 'analysis-v2';

type GenerateAnalysisFn = (ticker: string, type: AnalysisType) => Promise<GeneratedAnalysis>;

export function createApp(
  generateAnalysisFn: GenerateAnalysisFn = generateAnalysis,
  dbPath?: string
): {
  app: Express;
  db: HistoryDb;
  serverMetadata: {
    version: string;
    contractVersion: string;
    startedAt: string;
  };
} {
  const app = express();
  const db = initDb(dbPath);
  const serverMetadata = {
    version: packageJson.version,
    contractVersion: CONTRACT_VERSION,
    startedAt: new Date().toISOString()
  };

  app.use(cors());
  app.use(express.json());

  app.post('/api/analyze', async (req, res) => {
    try {
      const { ticker, type } = req.body;
      if (!ticker) {
        return res.status(400).json({ error: 'Ticker is required' });
      }

      const normalizedType: AnalysisType = type === 'basket' ? 'basket' : 'single';
      console.log(`Starting cloud analysis for ${ticker} (Type: ${normalizedType})...`);
      
      const analysisResult = await generateAnalysisFn(ticker, normalizedType);
      
      db.insertHistory({
        ticker,
        type: normalizedType,
        data: analysisResult.data,
        memo: analysisResult.memo,
      });

      res.json({ 
        success: true, 
        status: 'complete',
        ticker: ticker,
        data: analysisResult.data,
        memo: analysisResult.memo
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error during analysis' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      version: serverMetadata.version,
      contractVersion: serverMetadata.contractVersion,
      startedAt: serverMetadata.startedAt
    });
  });

  app.get('/api/history', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(parseInt(req.query.limit as string, 10) || 20, 100));
    const result = db.getHistory(page, limit);
    res.json(result);
  });

  app.delete('/api/history/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid history entry ID' });
    }
    const deleted = db.deleteHistoryEntry(id);
    if (!deleted) {
      return res.status(404).json({ error: 'History entry not found' });
    }
    res.json({ success: true });
  });

  return { app, db, serverMetadata };
}

const shouldStartServer =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (shouldStartServer) {
  const PORT = 3001;
  const { app } = createApp();
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}
