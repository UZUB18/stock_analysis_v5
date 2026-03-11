import express, { type Express } from 'express';
import cors from 'cors';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { generateAnalysis, type AnalysisType, type GeneratedAnalysis } from './analyze.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };
const CONTRACT_VERSION = 'analysis-v2';

type HistoryEntry = {
  ticker: string;
  data: unknown;
  memo: string;
  timestamp: string;
};

type GenerateAnalysisFn = (ticker: string, type: AnalysisType) => Promise<GeneratedAnalysis>;

export function createApp(generateAnalysisFn: GenerateAnalysisFn = generateAnalysis): {
  app: Express;
  historyCache: HistoryEntry[];
  serverMetadata: {
    version: string;
    contractVersion: string;
    startedAt: string;
  };
} {
  const app = express();
  const historyCache: HistoryEntry[] = [];
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
      
      historyCache.push({
        ticker: ticker,
        data: analysisResult.data,
        memo: analysisResult.memo,
        timestamp: new Date().toISOString()
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
    const sortedHistory = [...historyCache].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(sortedHistory);
  });

  return { app, historyCache, serverMetadata };
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
