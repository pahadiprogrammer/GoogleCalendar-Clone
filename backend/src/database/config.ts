import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get database path from environment or use default
const getDatabasePath = (): string => {
  const dbPath = process.env.DATABASE_URL || './data/calendar.db'
  
  // If it's a relative path, make it relative to project root
  if (!dbPath.startsWith('/')) {
    const projectRoot = join(__dirname, '../../')
    return join(projectRoot, dbPath)
  }
  
  return dbPath
}

// Ensure data directory exists
const ensureDataDirectory = (dbPath: string): void => {
  const dataDir = dirname(dbPath)
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
}

// Create database connection
export const createDatabase = (): sqlite3.Database => {
  const dbPath = getDatabasePath()
  ensureDataDirectory(dbPath)
  
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message)
      throw err
    }
    console.log(`Connected to SQLite database at ${dbPath}`)
  })
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON')
  
  return db
}

// Database instance
export const db = createDatabase()

// Promisify database methods for easier async/await usage
export const dbRun = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

export const dbGet = <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row as T)
    })
  })
}

export const dbAll = <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows as T[])
    })
  })
}

// Close database connection
export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err)
      else {
        console.log('Database connection closed')
        resolve()
      }
    })
  })
}
