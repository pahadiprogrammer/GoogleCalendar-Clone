# Google Calendar Clone

A full-stack calendar application built with React, TypeScript, Express.js, and SQLite. Features multiple calendar views, event management, and real-time synchronization across all views.

## 🚀 Features

### Calendar Views
- **📅 Monthly View**: Traditional calendar grid with date navigation
- **📊 Weekly View**: 7-day view with hourly time slots
- **📋 Daily View**: Single day with detailed hourly breakdown
- **🗓️ Yearly View**: 12-month overview for long-term planning

### Event Management
- ✅ **Create Events**: Add new events with title, description, date/time
- ✅ **Edit Events**: Update existing events with form validation
- ✅ **Delete Events**: Remove events with confirmation
- ✅ **Event Types**: Support for timed events and all-day events
- ✅ **Color Coding**: Customizable event colors for organization
- ✅ **Form Validation**: Comprehensive client-side and server-side validation

### User Experience
- ✅ **Cross-View Synchronization**: Events appear consistently across all calendar views
- ✅ **Responsive Design**: Optimized for mobile, tablet, and desktop screens
- ✅ **Real-time Updates**: Instant UI updates without page refresh
- ✅ **Today Highlighting**: Current date prominently displayed
- ✅ **Date Navigation**: Easy month/week/day navigation with keyboard shortcuts
- ✅ **Event Persistence**: All events saved to database and survive server restarts

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Python** 3.6 or higher
- **Git** (for cloning the repository)

## ⚡ Quick Start (30 Seconds!)

### 🎯 One-Command Setup (Recommended)

The easiest way to run the entire application with **zero configuration**:

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd google-calendar-clone

# 2. Install all dependencies
npm run install:all

# 3. Start the entire application
npm run dev
```

**That's it! 🎉** The Python script handles everything automatically.

### 🖥️ What You'll See

```bash
============================================================
🚀 Google Calendar Clone - Development Server
============================================================
📁 Checking project structure...
✅ Project structure verified
📦 Checking dependencies...
✅ Dependencies verified
🔧 Starting backend server (port 9999)...
✅ Backend server started successfully
🎨 Starting frontend server (port 3000)...
✅ Frontend server started successfully

============================================================
🎉 Development servers are running!
============================================================
📱 Frontend:  http://localhost:3000
🔧 Backend:   http://localhost:9999
🏥 Health:    http://localhost:9999/health
📚 API Docs:  http://localhost:9999/api/v1
============================================================
💡 Press Ctrl+C to stop both servers
============================================================
```

### 🌐 Access Your Application

Once started, your application will be available at:
- **📱 Frontend**: http://localhost:3000 ← **Open this in your browser**
- **🔧 Backend API**: http://localhost:9999
- **🏥 Health Check**: http://localhost:9999/health

## 🐍 Python Development Script Features

### ✨ What the Script Does Automatically

- ✅ **Validates Environment**: Checks Node.js, npm, and Python versions
- ✅ **Dependency Management**: Verifies node_modules exist, provides helpful install commands
- ✅ **Process Management**: Starts both frontend and backend servers concurrently
- ✅ **Beautiful Output**: Colored terminal output with clear status indicators
- ✅ **Error Handling**: Comprehensive error reporting and recovery suggestions
- ✅ **Graceful Shutdown**: Clean shutdown of both servers with Ctrl+C
- ✅ **Process Monitoring**: Detects if servers crash and handles cleanup
- ✅ **Cross-Platform**: Works on macOS, Linux, and Windows

### 🎮 Available Commands

```bash
# Primary commands (recommended)
npm run dev              # Start with Python script
npm start                # Alternative start command
python3 start-dev.py     # Direct Python execution

# Utility commands
npm run install:all      # Install all dependencies
npm run health           # Health check both services
npm run db:inspect       # Access SQLite database
```

### 🛠️ Troubleshooting

#### Python Not Found
```bash
# Install Python 3.6+ from python.org
# Or use package manager:
brew install python3      # macOS
sudo apt install python3  # Ubuntu/Debian
```

#### Node.js Not Found
```bash
# Install Node.js 18+ from nodejs.org
# Or use package manager:
brew install node         # macOS
sudo apt install nodejs npm  # Ubuntu/Debian
```

#### Dependencies Missing
The script will detect missing dependencies and show:
```bash
⚠️  Missing dependencies in: frontend, backend
💡 Run the following commands to install dependencies:
   cd frontend && npm install
   cd backend && npm install
```

#### Port Already in Use
If ports 3000 or 9999 are busy:
```bash
# Kill processes using the ports
lsof -ti:3000 | xargs kill -9
lsof -ti:9999 | xargs kill -9
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and context
- **TypeScript 5.2.2** - Type safety and better developer experience
- **Material-UI 5.14.20** - Professional UI components and theming
- **Vite 4.5.0** - Fast development server and build tool
- **date-fns 2.30.0** - Lightweight date manipulation library
- **React Router DOM 6.20.1** - Client-side routing

### Backend
- **Express.js 4.18.2** - Web framework for Node.js
- **TypeScript 5.2.2** - Type-safe backend development
- **SQLite3 5.1.6** - Lightweight database for development
- **Zod 3.22.4** - Runtime type validation and parsing
- **CORS & Helmet** - Security middleware
- **UUID 9.0.1** - Unique identifier generation

## 🔧 Alternative Setup Methods

### Option 1: Manual Setup (Advanced Users)

If you prefer to run servers separately:

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server (runs on http://localhost:9999)
npm run dev
```

#### Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

### Option 2: Docker Setup (Coming Soon)

Docker configuration is available but the **Python script is recommended** for the best development experience.

## 🔧 Development Workflow

### Running Both Servers
```bash
# Recommended: Python script handles everything
npm run dev

# Manual: Run in separate terminals
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Available Scripts

#### Root Level Scripts
```bash
npm run dev              # Start with Python script ⭐ RECOMMENDED
npm start                # Alternative start command
npm run install:all      # Install all dependencies
npm run build:frontend   # Build frontend for production
npm run build:backend    # Build backend for production
npm run test:frontend    # Run frontend tests
npm run test:backend     # Run backend tests
npm run db:inspect       # Access SQLite database
npm run health           # Health check both services
```

#### Frontend Scripts (cd frontend)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

#### Backend Scripts (cd backend)
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server
npm run db:migrate # Run database migrations
```

## 📁 Project Structure

```
google-calendar/
├── 🐍 start-dev.py             # Python development script
├── 📦 package.json              # Root package configuration
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── calendar/       # Calendar-specific components
│   │   │   ├── events/         # Event management components
│   │   │   └── views/          # Calendar view containers
│   │   ├── contexts/           # React Context providers
│   │   ├── services/           # API communication layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Express.js backend API
│   ├── src/
│   │   ├── database/           # Database configuration and migrations
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic layer
│   │   └── types/              # TypeScript interfaces
│   ├── data/                   # SQLite database file
│   └── package.json
└── README.md
```

## 🌐 API Documentation

### Base URL
```
http://localhost:9999/api/v1
```

### Endpoints

#### Get All Events
```http
GET /events
```
**Query Parameters:**
- `startDate` (optional): Filter events from date (YYYY-MM-DD)
- `endDate` (optional): Filter events to date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Meeting",
    "description": "Team standup",
    "startTime": "2025-10-26T10:00:00.000Z",
    "endTime": "2025-10-26T11:00:00.000Z",
    "isAllDay": false,
    "color": "#1976d2",
    "createdAt": "2025-10-26T08:00:00.000Z",
    "updatedAt": "2025-10-26T08:00:00.000Z"
  }
]
```

#### Create Event
```http
POST /events
Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "startTime": "2025-10-26T14:00:00.000Z",
  "endTime": "2025-10-26T15:00:00.000Z",
  "isAllDay": false,
  "color": "#1976d2"
}
```

#### Update Event
```http
PUT /events/:id
Content-Type: application/json
```
**Request Body:** Same as create event

#### Delete Event
```http
DELETE /events/:id
```

#### Health Check
```http
GET /health
```

### API Testing
```bash
# Health check
curl http://localhost:9999/health

# Get all events
curl http://localhost:9999/api/v1/events

# Create event
curl -X POST http://localhost:9999/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","startTime":"2025-10-26T19:00:00.000Z","isAllDay":false,"color":"#1976d2"}'
```

## 🗄️ Database Schema

### Events Table
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,              -- UUID
  title TEXT NOT NULL,              -- Event title
  description TEXT,                 -- Optional description
  start_time TEXT NOT NULL,         -- ISO 8601 datetime string
  end_time TEXT,                    -- ISO 8601 datetime (nullable for all-day)
  is_all_day INTEGER NOT NULL,     -- SQLite boolean (0/1)
  color TEXT NOT NULL,              -- Hex color code
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_date_range ON events(start_time, end_time);
```

### Database Operations
```bash
# Access SQLite database directly
npm run db:inspect
# OR: sqlite3 backend/data/calendar.db

# View all events
sqlite3 backend/data/calendar.db "SELECT * FROM events;" -header -column

# Reset database (delete all events)
rm backend/data/calendar.db && cd backend && npm run db:migrate
```

## 🎯 Key Features Explained

### Cross-View Synchronization
Events created or modified in any calendar view (Monthly, Weekly, Daily, Yearly) automatically appear in all other views. This is achieved through:
- Centralized state management with React Context
- Real-time API communication
- Consistent event filtering across views

### Responsive Design
The application uses Material-UI's Grid system for responsive layouts:
- **Mobile (xs)**: Stacked layout with horizontal scrolling
- **Tablet (sm/md)**: Optimized spacing and touch targets
- **Desktop (lg/xl)**: Full calendar grid with all features

### Event Types
- **Timed Events**: Have specific start and end times
- **All-Day Events**: Span entire days without specific times
- **Color Coding**: Visual organization with customizable colors

### Date Handling
Robust date management using date-fns library:
- Timezone-aware date operations
- Null-safe date conversions
- Consistent date formatting across views

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Create event in Monthly view → Verify appears in Weekly/Daily views
- [ ] Edit event in Weekly view → Verify changes reflect in all views
- [ ] Delete event in Daily view → Verify removed from all views
- [ ] Create all-day event → Verify proper display across views
- [ ] Test responsive design on different screen sizes
- [ ] Verify events persist after page refresh
- [ ] Test form validation with invalid inputs

### Quick Test Commands
```bash
# Start the application
npm run dev

# In another terminal, test the API
npm run health

# Access the database
npm run db:inspect
```

## 📝 Environment Configuration

### Automatic Configuration (Python Script)
The Python script automatically sets up all environment variables:
- **Backend**: PORT=9999, NODE_ENV=development
- **Frontend**: VITE_API_BASE_URL=http://localhost:9999/api/v1

### Manual Configuration (.env files)

#### Backend (.env)
```bash
# Database Configuration
DATABASE_URL=./data/calendar.db
NODE_ENV=development

# Server Configuration
PORT=9999
HOST=0.0.0.0

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# API Configuration
API_PREFIX=/api/v1
```

#### Frontend (Environment Variables)
```bash
# API Configuration (for manual setup)
VITE_API_BASE_URL=http://localhost:9999/api/v1
```

## 🎉 Production Ready

This application includes:
- ✅ **Type Safety**: End-to-end TypeScript implementation
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Security**: CORS and Helmet middleware
- ✅ **Performance**: Optimized database queries with indexing
- ✅ **Scalability**: Modular architecture ready for expansion
- ✅ **Documentation**: Comprehensive code documentation and project rules
- ✅ **Development Tools**: Python script for seamless development experience

## 🚀 Next Steps

After getting the application running:

1. **Explore the Calendar Views**: Try switching between Monthly, Weekly, Daily, and Yearly views
2. **Create Events**: Use the floating action button (+) to create new events
3. **Test Cross-View Sync**: Create an event in one view and see it appear in others
4. **Try Responsive Design**: Resize your browser or test on mobile devices
5. **Inspect the Database**: Use `npm run db:inspect` to see your events in SQLite
6. **API Testing**: Use the provided curl commands to test the REST API

---

**Built with ❤️ using React, TypeScript, Express.js, and Python**

**🐍 Powered by Python Development Script for the Ultimate Developer Experience**
