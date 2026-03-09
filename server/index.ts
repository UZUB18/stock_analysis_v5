import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, '..', 'data');
const REQUESTS_DIR = path.join(DATA_DIR, 'requests');
const REPORTS_DIR = path.join(DATA_DIR, 'reports');

// Ensure directories exist
const initDirs = async () => {
  await fs.mkdir(REQUESTS_DIR, { recursive: true });
  await fs.mkdir(REPORTS_DIR, { recursive: true });
};
initDirs();

// Endpoint to request an analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { ticker, type } = req.body;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker is required' });
    }

    const requestFile = path.join(REQUESTS_DIR, `${ticker}.json`);
    await fs.writeFile(requestFile, JSON.stringify({ ticker, type, timestamp: new Date().toISOString() }, null, 2));

    res.json({ success: true, message: 'Analysis requested', ticker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to poll for analysis results
app.get('/api/status/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const memoFile = path.join(REPORTS_DIR, `${ticker}_memo.md`);
    const dataFile = path.join(REPORTS_DIR, `${ticker}_data.json`);

    try {
      // Check if both files exist
      await fs.access(memoFile);
      await fs.access(dataFile);

      // Read both files
      const memoContent = await fs.readFile(memoFile, 'utf-8');
      const dataContent = await fs.readFile(dataFile, 'utf-8');

      // Return them
      res.json({
        status: 'complete',
        memo: memoContent,
        data: JSON.parse(dataContent)
      });
    } catch (e) {
      // One or both files don't exist yet
      res.json({ status: 'processing' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all completed reports for history
app.get('/api/history', async (req, res) => {
  try {
    const files = await fs.readdir(REPORTS_DIR);
    const dataFiles = files.filter(f => f.endsWith('_data.json'));
    
    const history = [];
    for (const file of dataFiles) {
      const ticker = file.replace('_data.json', '');
      const memoFile = `${ticker}_memo.md`;
      
      try {
        const dataContent = await fs.readFile(path.join(REPORTS_DIR, file), 'utf-8');
        const memoContent = await fs.readFile(path.join(REPORTS_DIR, memoFile), 'utf-8');
        const data = JSON.parse(dataContent);
        
        history.push({
          ticker,
          data,
          memo: memoContent,
          timestamp: (await fs.stat(path.join(REPORTS_DIR, file))).mtime
        });
      } catch (e) {
        console.error(`Error reading history for ${ticker}`, e);
      }
    }
    
    // Sort by newest first
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
