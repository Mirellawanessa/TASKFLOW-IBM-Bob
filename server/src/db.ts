// Banco de dados SQLite — cria as tabelas e exporta a conexão

import Database from 'better-sqlite3'
import path from 'path'

// O arquivo do banco fica em server/data/taskflow.db
const DB_PATH = path.join(__dirname, '..', 'data', 'taskflow.db')

const db = new Database(DB_PATH)

// Ativa WAL mode para melhor performance
db.pragma('journal_mode = WAL')

// Cria as tabelas se ainda não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
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
`)

export default db
