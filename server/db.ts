import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, "..", "data", "history.db");

export type HistoryRow = {
  id: number;
  ticker: string;
  type: string;
  data: unknown;
  memo: string;
  created_at: string;
};

export type PaginatedHistory = {
  items: HistoryRow[];
  total: number;
  page: number;
  totalPages: number;
};

export type HistoryDb = ReturnType<typeof initDb>;

/**
 * Opens (or creates) the SQLite database and returns a thin API object.
 * Pass ":memory:" as `dbPath` for tests.
 */
export function initDb(dbPath: string = DEFAULT_DB_PATH) {
  const db = new Database(dbPath);

  // Performance pragmas
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker     TEXT    NOT NULL,
      type       TEXT    NOT NULL DEFAULT 'single',
      data_json  TEXT    NOT NULL,
      memo       TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_history_created
    ON history(created_at DESC);
  `);

  // ── Prepared statements ──────────────────────────────────────────────

  const stmtInsert = db.prepare(`
    INSERT INTO history (ticker, type, data_json, memo, created_at)
    VALUES (@ticker, @type, @dataJson, @memo, datetime('now'))
  `);

  const stmtSelectPage = db.prepare(`
    SELECT id, ticker, type, data_json, memo, created_at
    FROM history
    ORDER BY id DESC
    LIMIT @limit OFFSET @offset
  `);

  const stmtCount = db.prepare(`SELECT COUNT(*) AS cnt FROM history`);

  const stmtSelectOne = db.prepare(`
    SELECT id, ticker, type, data_json, memo, created_at
    FROM history
    WHERE id = @id
  `);

  const stmtDelete = db.prepare(`DELETE FROM history WHERE id = @id`);

  const stmtDeleteOld = db.prepare(`
    DELETE FROM history
    WHERE created_at < datetime('now', @modifier)
  `);

  // ── Helpers ──────────────────────────────────────────────────────────

  function rowToEntry(row: {
    id: number;
    ticker: string;
    type: string;
    data_json: string;
    memo: string;
    created_at: string;
  }): HistoryRow {
    return {
      id: row.id,
      ticker: row.ticker,
      type: row.type,
      data: JSON.parse(row.data_json),
      memo: row.memo,
      created_at: row.created_at,
    };
  }

  // ── Public API ───────────────────────────────────────────────────────

  function insertHistory(entry: {
    ticker: string;
    type: string;
    data: unknown;
    memo: string;
  }): number {
    const info = stmtInsert.run({
      ticker: entry.ticker,
      type: entry.type,
      dataJson: JSON.stringify(entry.data),
      memo: entry.memo,
    });
    return Number(info.lastInsertRowid);
  }

  function getHistory(page: number = 1, limit: number = 20): PaginatedHistory {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const offset = (safePage - 1) * safeLimit;

    const rows = stmtSelectPage.all({ limit: safeLimit, offset }) as Array<{
      id: number;
      ticker: string;
      type: string;
      data_json: string;
      memo: string;
      created_at: string;
    }>;

    const { cnt } = stmtCount.get() as { cnt: number };
    const totalPages = Math.max(1, Math.ceil(cnt / safeLimit));

    return {
      items: rows.map(rowToEntry),
      total: cnt,
      page: safePage,
      totalPages,
    };
  }

  function getHistoryEntry(id: number): HistoryRow | undefined {
    const row = stmtSelectOne.get({ id }) as
      | { id: number; ticker: string; type: string; data_json: string; memo: string; created_at: string }
      | undefined;

    return row ? rowToEntry(row) : undefined;
  }

  function deleteHistoryEntry(id: number): boolean {
    const info = stmtDelete.run({ id });
    return info.changes > 0;
  }

  function deleteOldHistory(maxAgeDays: number = 90): number {
    const modifier = `-${maxAgeDays} days`;
    const info = stmtDeleteOld.run({ modifier });
    return info.changes;
  }

  function getHistoryCount(): number {
    const { cnt } = stmtCount.get() as { cnt: number };
    return cnt;
  }

  function close(): void {
    db.close();
  }

  return {
    insertHistory,
    getHistory,
    getHistoryEntry,
    deleteHistoryEntry,
    deleteOldHistory,
    getHistoryCount,
    close,
  };
}
