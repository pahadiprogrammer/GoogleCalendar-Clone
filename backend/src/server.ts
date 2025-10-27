import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { Server } from 'http'
import eventsRouter from './routes/events.js'
import { runMigrations } from './database/migrate.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = parseInt(process.env.PORT || '9999', 10)
const HOST = process.env.HOST || '0.0.0.0'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// CORS configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp} ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use(`${API_PREFIX}/events`, eventsRouter)

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Google Calendar Clone API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: `${API_PREFIX}/events`,
      documentation: 'https://github.com/your-repo/google-calendar-clone'
    }
  })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  })
})

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Server instance for graceful shutdown
let server: Server

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

// Start server
const startServer = async () => {
  try {
    // Run database migrations
    console.log('🔄 Running database migrations...')
    await runMigrations()
    
    // Start HTTP server
    server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`)
      console.log(`📚 API endpoints available at http://${HOST}:${PORT}${API_PREFIX}`)
      console.log(`🏥 Health check: http://${HOST}:${PORT}/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔗 CORS enabled for: ${FRONTEND_URL}`)
    })
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    
    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Export for testing
export { app }

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}
