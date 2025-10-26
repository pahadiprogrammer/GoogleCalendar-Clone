import { dbRun } from './config.js'

const createEventsTable = async (): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      start_time TEXT,  -- ISO string, NULL for all-day events without specific time
      end_time TEXT,    -- ISO string, NULL for all-day events without specific time
      is_all_day INTEGER NOT NULL DEFAULT 0,  -- SQLite uses INTEGER for boolean (0/1)
      color TEXT NOT NULL DEFAULT '#1976d2',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `
  
  try {
    await dbRun(sql)
    console.log('✅ Events table created successfully')
  } catch (error) {
    console.error('❌ Error creating events table:', error)
    throw error
  }
}

const createIndexes = async (): Promise<void> => {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time)',
    'CREATE INDEX IF NOT EXISTS idx_events_end_time ON events(end_time)',
    'CREATE INDEX IF NOT EXISTS idx_events_is_all_day ON events(is_all_day)',
    'CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at)'
  ]
  
  try {
    for (const indexSql of indexes) {
      await dbRun(indexSql)
    }
    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    throw error
  }
}

const runMigrations = async (): Promise<void> => {
  console.log('🚀 Running database migrations...')
  
  try {
    await createEventsTable()
    await createIndexes()
    console.log('✅ All migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('🎉 Database setup complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { runMigrations }
