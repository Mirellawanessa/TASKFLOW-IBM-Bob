// Banco de dados SQLite — cria as tabelas e exporta a conexão

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(__dirname, '..', 'data')
const DB_PATH  = path.join(DATA_DIR, 'taskflow.db')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    avatar     TEXT    NOT NULL DEFAULT '',
    bio        TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT    PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    priority    TEXT    NOT NULL DEFAULT 'medium',
    status      TEXT    NOT NULL DEFAULT 'pending',
    created_at  TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       TEXT    NOT NULL CHECK(role IN ('user','assistant')),
    content    TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    user_id           INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notifications     INTEGER NOT NULL DEFAULT 1,
    theme             TEXT    NOT NULL DEFAULT 'light',
    language          TEXT    NOT NULL DEFAULT 'pt-BR',
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`)

// Migrações: adiciona colunas que podem não existir em bancos antigos
const userCols = (db.prepare("PRAGMA table_info(users)").all() as {name:string}[]).map(c => c.name)
if (!userCols.includes('avatar')) db.exec("ALTER TABLE users ADD COLUMN avatar TEXT NOT NULL DEFAULT ''")
if (!userCols.includes('bio'))    db.exec("ALTER TABLE users ADD COLUMN bio    TEXT NOT NULL DEFAULT ''")

export default db
