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

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd google-calendar
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server (runs on http://localhost:3002)
npm run dev
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **Health Check**: http://localhost:3002/api/v1/health

## 🔧 Development Workflow

### Running Both Servers
For full-stack development, you need both servers running simultaneously:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Available Scripts

#### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

#### Backend Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server
npm run db:migrate # Run database migrations
```

### Database Operations
```bash
# Access SQLite database directly
sqlite3 backend/data/calendar.db

# View all events
sqlite3 backend/data/calendar.db "SELECT * FROM events;" -header -column

# Reset database (delete all events)
rm backend/data/calendar.db && npm run db:migrate
```

## 📁 Project Structure

```
google-calendar/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── calendar/    # Calendar-specific components
│   │   │   ├── events/      # Event management components
│   │   │   └── views/       # Calendar view containers
│   │   ├── contexts/        # React Context providers
│   │   ├── services/        # API communication layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── database/        # Database configuration and migrations
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic layer
│   │   └── types/           # TypeScript interfaces
│   ├── data/               # SQLite database file
│   └── package.json
└── README.md
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3002/api/v1
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

### API Testing
```bash
# Health check
curl http://localhost:3002/api/v1/health

# Get all events
curl http://localhost:3002/api/v1/events

# Create event
curl -X POST http://localhost:3002/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","startTime":"2025-10-26T19:00:00.000Z","isAllDay":false,"color":"#1976d2"}'
```

## 📝 Environment Configuration

### Backend (.env)
```bash
# Database Configuration
DATABASE_URL=./data/calendar.db
NODE_ENV=development

# Server Configuration
PORT=3002
HOST=localhost

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# API Configuration
API_PREFIX=/api/v1
```

## 🎉 Production Ready

This application includes:
- ✅ **Type Safety**: End-to-end TypeScript implementation
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Security**: CORS and Helmet middleware
- ✅ **Performance**: Optimized database queries with indexing
- ✅ **Scalability**: Modular architecture ready for expansion
- ✅ **Documentation**: Comprehensive code documentation and project rules

---

**Built with ❤️ using React, TypeScript, and Express.js**
