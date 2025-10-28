# Google Calendar Clone

A full-stack calendar application built with React, TypeScript, Express.js, and SQLite. Features multiple calendar views, event management, real-time synchronization across all views, and comprehensive event conflict detection.

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
- ✅ **Conflict Detection**: Visual indicators for overlapping events
- ✅ **Form Validation**: Comprehensive client-side and server-side validation

### User Experience
- ✅ **Cross-View Synchronization**: Events appear consistently across all calendar views
- ✅ **Responsive Design**: Optimized for mobile, tablet, and desktop screens
- ✅ **Real-time Updates**: Instant UI updates without page refresh
- ✅ **Today Highlighting**: Current date prominently displayed
- ✅ **Date Navigation**: Easy month/week/day navigation
- ✅ **Event Persistence**: All events saved to database and survive server restarts

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Python** 3.7 or higher (for development script)
- **Git** (for cloning the repository)

## ⚡ Quick Start with Python Development Script

### 🚀 Recommended: One-Command Setup

The project includes a powerful Python development script that handles everything automatically:

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd google-calendar-clone

# 2. Install all dependencies
npm run install:all

# 3. Start both servers with one command
npm run dev
```

**That's it! 🎉** The Python script (`start-dev.py`) automatically:
- ✅ Validates your environment (Node.js, npm, Python versions)
- ✅ Checks project structure and dependencies
- ✅ Sets up environment variables
- ✅ Starts both frontend and backend servers concurrently
- ✅ Provides beautiful colored terminal output
- ✅ Handles graceful shutdown with Ctrl+C
- ✅ Monitors processes and provides helpful error messages

### 🌐 Access Your Application

Once started, you'll see this output:
```
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
============================================================
💡 Press Ctrl+C to stop both servers
============================================================
```

**Open http://localhost:3000 in your browser to use the application.**

### 📋 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | **Start with Python script** | **⭐ Recommended** |
| `npm start` | Alternative to `npm run dev` | Same as above |
| `npm run install:all` | Install frontend + backend dependencies | Run once after clone |
| `npm run build:frontend` | Build frontend for production | Before deployment |
| `npm run build:backend` | Build backend for production | Before deployment |
| `npm run db:inspect` | Access SQLite database directly | For debugging |
| `npm run health` | Check if both servers are running | Health check |

### 🛠️ Troubleshooting the Python Script

#### Python Not Found
```bash
# Install Python 3.7+ from python.org
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
The script automatically detects missing dependencies and shows:
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

## 🔧 Alternative Setup Methods

### Manual Setup (Advanced Users)

If you prefer to run servers separately:

#### Backend Setup
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:9999
```

#### Frontend Setup
```bash
# Open new terminal
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Individual Package Scripts

**Frontend** (`cd frontend`):
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend** (`cd backend`):
- `npm run dev` - Start Express server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations

## 🏗️ Architecture & Technology Choices

### System Architecture Overview

The application follows a **modern full-stack architecture** with clear separation of concerns:

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    SQLite    ┌─────────────────┐
│   React Frontend │ ◄─────────────────► │ Express Backend │ ◄──────────► │   Database      │
│   (Port 3000)   │                     │   (Port 9999)   │              │   (calendar.db) │
└─────────────────┘                     └─────────────────┘              └─────────────────┘
```

### Technology Stack Rationale

| Technology | Version | Why Chosen | Key Benefits |
|------------|---------|------------|--------------|
| **React** | 18.2.0 | Mature ecosystem, excellent TypeScript support | Component reusability, hooks API |
| **TypeScript** | 5.2.2 | Type safety, better IDE support | Reduced runtime errors, better refactoring |
| **Material-UI** | 5.14.20 | Professional components, responsive system | Consistent design, accessibility |
| **Vite** | 4.5.0 | Fast development server, optimized builds | No crypto.hash issues, proven stability |
| **Express.js** | 4.18.2 | Lightweight, flexible, extensive middleware | Simple REST API, great TypeScript support |
| **SQLite** | 5.1.6 | Zero configuration, excellent performance | File-based, ACID compliance, easy migration |
| **date-fns** | 2.30.0 | Lightweight, immutable, tree-shakable | Better than Moment.js, functional approach |
| **Zod** | 3.22.4 | Runtime type validation, TypeScript integration | API validation, type safety |

### Frontend Architecture

#### Component Architecture Pattern
```
Views (Containers)     ──► Consume contexts, handle business logic
  ├── MonthlyView      ──► Uses CalendarContext + EventContext
  ├── WeeklyView       ──► Filters events by date, passes to components
  ├── DailyView        ──► Handles view-specific state
  └── YearlyView       ──► Manages navigation and data flow

Components (Pure)      ──► Receive props, render UI, emit events
  ├── CalendarGrid     ──► Renders calendar layout
  ├── DateCell         ──► Individual date display with events
  ├── EventDisplay     ──► Event rendering with conflict detection
  └── EventForm        ──► Event creation/editing with validation

Utilities             ──► Pure functions, no side effects
  ├── dateUtils        ──► Date manipulation with date-fns
  ├── eventUtils       ──► Event processing and validation
  └── constants        ──► Application constants and colors
```

#### State Management Strategy
```typescript
// Context-based architecture for global state
CalendarContext  ──► Navigation state (currentDate, selectedDate, view)
EventContext     ──► Event data and CRUD operations with localStorage backup
```

**Why Context API over Redux:**
- Simpler setup for medium-sized applications
- Built-in React feature, no external dependencies
- Sufficient for our event management needs
- Easy to test and maintain

### Backend Architecture

#### Layered Architecture
```typescript
Routes Layer      ──► HTTP handling, request validation, response formatting
Services Layer    ──► Business logic, data transformation, error handling  
Database Layer    ──► Data persistence, query optimization, migrations
```

#### Database Choice: SQLite
**Why SQLite over PostgreSQL/MongoDB:**
- **Development Simplicity**: Zero configuration, file-based database
- **Performance**: Excellent for read-heavy calendar operations
- **Portability**: Single file database, easy to backup and migrate
- **ACID Compliance**: Ensures data consistency for concurrent operations
- **Future Migration**: Easy to migrate to PostgreSQL for production scaling

## 🧠 Business Logic & Edge Cases

### Event Management System

#### Event Conflict Detection
The application implements sophisticated conflict detection across all calendar views:

```typescript
// Conflict detection algorithm
function detectEventOverlaps(event: CalendarEvent, allEvents: CalendarEvent[]): ConflictSeverity {
  // 1. Filter events for the same date
  // 2. Check for time overlaps using interval mathematics
  // 3. Calculate conflict severity (minor, major, complete)
  // 4. Return visual indicators (red borders, warning icons)
}
```

**Conflict Types Handled:**
- **Minor Overlap**: Events share start/end times (yellow warning)
- **Major Overlap**: Significant time intersection (orange warning)  
- **Complete Overlap**: One event entirely within another (red warning)
- **All-Day Conflicts**: Multiple all-day events on same date

#### Cross-View Synchronization
**Challenge**: Ensuring events appear consistently across Monthly, Weekly, Daily, and Yearly views.

**Solution**: Centralized event filtering with view-specific rendering:
```typescript
// Each view uses the same filtering logic
const WeeklyView = () => {
  const { getEventsForDate } = useEvents();
  // Events are filtered by date, then passed to components
  return <WeekColumn events={getEventsForDate(date)} />;
};
```

#### Critical Bug Prevention
The system prevents double-filtering that could break conflict detection:
```typescript
// ❌ WRONG: Double filtering breaks conflict detection
const events = getEventsForDate(date).filter(e => isSameDay(e.startTime, date));

// ✅ CORRECT: Use pre-filtered events directly
const events = getEventsForDate(date); // Already filtered by date
```

### Date & Time Handling Complexities

#### Edge Cases Handled

1. **All-Day Events**
   ```typescript
   // All-day events have null endTime and special rendering
   if (event.isAllDay) {
     return <AllDayEventDisplay event={event} />;
   }
   ```

2. **Month Boundary Events**
   ```typescript
   // Events spanning multiple months appear in both views
   const calendarDays = getMonthCalendarDays(currentDate); // Includes prev/next month dates
   ```

3. **Time Zone Consistency**
   ```typescript
   // All dates stored as ISO strings, converted to local time for display
   const localTime = new Date(event.startTime).toLocaleString();
   ```

4. **Leap Year & DST Handling**
   ```typescript
   // Using date-fns for robust date arithmetic
   const nextMonth = addMonths(currentDate, 1); // Handles leap years automatically
   ```

### Form Validation & Error Handling

#### Client-Side Validation
```typescript
interface EventFormErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  dateRange?: string;
}

const validateEventForm = (data: EventFormData): EventFormErrors => {
  const errors: EventFormErrors = {};
  
  if (!data.title?.trim()) errors.title = "Title is required";
  if (data.endTime && data.startTime && data.endTime <= data.startTime) {
    errors.dateRange = "End time must be after start time";
  }
  
  return errors;
};
```

#### Server-Side Validation with Zod
```typescript
const EventSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  isAllDay: z.boolean(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
});
```

## 🎨 Animations & Interactions Implementation

### Material-UI Component Interactions

#### Hover Effects & Visual Feedback
```typescript
// Consistent hover patterns across all interactive elements
const hoverStyles = {
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: isCurrentHour ? '#ffe0b2' : '#f5f5f5',
    transform: 'scale(1.02)', // Subtle scale effect
    transition: 'all 0.2s ease-in-out'
  }
};
```

#### Today Highlighting System
```typescript
// Dynamic styling based on date calculations
const getTodayStyles = (date: Date) => ({
  backgroundColor: isToday(date) ? '#e3f2fd' : '#fafafa',
  color: isToday(date) ? '#1976d2' : '#333',
  fontWeight: isToday(date) ? 'bold' : 'normal',
  border: isToday(date) ? '2px solid #1976d2' : '1px solid #e0e0e0'
});
```

#### Event Color System
```typescript
// Consistent color application across all views
const eventColors = {
  primary: '#1976d2',   // Default blue
  success: '#2e7d32',   // Green for completed
  warning: '#ed6c02',   // Orange for important
  error: '#d32f2f',     // Red for urgent
  info: '#0288d1'       // Light blue for info
};
```

### Responsive Design Implementation

#### Material-UI Grid System
```typescript
// Responsive breakpoints for optimal viewing
<Grid container spacing={0}>
  {/* Time column - responsive sizing */}
  <Grid item xs={12} sm={1.5} md={1.2} lg={1}>
    <TimeColumn />
  </Grid>
  
  {/* Day columns - calculated responsive width */}
  {weekDays.map((date, index) => (
    <Grid item 
      xs={12/7}                    // Equal 7-column split
      sm={(12-1.5)/7}             // Adjust for time column
      md={(12-1.2)/7}             // Medium screen optimization
      lg={(12-1)/7}               // Large screen optimization
      key={index}
    >
      <DayColumn date={date} />
    </Grid>
  ))}
</Grid>
```

#### Horizontal Scroll for Mobile
```typescript
// Graceful degradation for small screens
<Box sx={{ 
  width: '100%', 
  overflow: 'auto',           // Enable horizontal scroll
  minWidth: 800              // Minimum width before scrolling
}}>
  <Grid container sx={{ minWidth: 800 }}>
    {/* Calendar content */}
  </Grid>
</Box>
```

### Loading States & Transitions

#### Event Loading Animation
```typescript
// Skeleton loading for better perceived performance
const EventSkeleton = () => (
  <Box sx={{ 
    animation: 'pulse 1.5s ease-in-out infinite',
    backgroundColor: '#f0f0f0',
    borderRadius: 1,
    height: 24,
    mb: 0.5
  }} />
);
```

#### Form Submission States
```typescript
// Visual feedback during async operations
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (data: EventFormData) => {
  setIsSubmitting(true);
  try {
    await createEvent(data);
    showSuccessMessage("Event created successfully");
  } finally {
    setIsSubmitting(false);
  }
};
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
│   │   │   │   ├── CalendarGrid.tsx      # Monthly view grid
│   │   │   │   ├── DateCell.tsx          # Individual date cells
│   │   │   │   ├── WeekHeader.tsx        # Day name headers
│   │   │   │   ├── TimeSlot.tsx          # Hourly time slots
│   │   │   │   ├── WeekColumn.tsx        # Weekly view columns
│   │   │   │   ├── DailyEventLayout.tsx  # Daily event positioning
│   │   │   │   └── WeekEventLayout.tsx   # Weekly event positioning
│   │   │   ├── events/         # Event management components
│   │   │   │   ├── EventDisplay.tsx      # Event rendering with conflict detection
│   │   │   │   ├── EventForm.tsx         # Event creation/editing form
│   │   │   │   ├── EventDetailsDialog.tsx # Event details modal
│   │   │   │   └── EventList.tsx         # Event listing component
│   │   │   ├── views/          # Calendar view containers
│   │   │   │   ├── MonthlyView.tsx       # Monthly calendar view
│   │   │   │   ├── WeeklyView.tsx        # Weekly calendar view
│   │   │   │   ├── DailyView.tsx         # Daily calendar view
│   │   │   │   └── YearlyView.tsx        # Yearly calendar view
│   │   │   └── common/         # Shared UI components
│   │   │       └── ConfirmationDialog.tsx # Reusable confirmation modal
│   │   ├── contexts/           # React Context providers
│   │   │   ├── CalendarContext.tsx       # Navigation state management
│   │   │   └── EventContext.tsx          # Event data and CRUD operations
│   │   ├── services/           # API communication layer
│   │   │   └── eventService.ts           # HTTP client for event operations
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── calendar.ts               # Calendar and event interfaces
│   │   └── utils/              # Utility functions
│   │       ├── dateUtils.ts              # Date manipulation and formatting
│   │       ├── eventUtils.ts             # Event processing and validation
│   │       └── constants.ts              # Application constants
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Express.js backend API
│   ├── src/
│   │   ├── database/           # Database configuration and migrations
│   │   │   ├── config.ts                 # SQLite connection setup
│   │   │   └── migrate.ts                # Database schema migrations
│   │   ├── routes/             # API route handlers
│   │   │   └── events.ts                 # Event CRUD endpoints
│   │   ├── services/           # Business logic layer
│   │   │   └── eventService.ts           # Event business logic
│   │   └── types/              # TypeScript interfaces
│   │       └── event.ts                  # Event type definitions
│   ├── data/                   # SQLite database file
│   │   └── calendar.db                   # Application database
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

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Create event in Monthly view → Verify appears in Weekly/Daily views
- [ ] Edit event in Weekly view → Verify changes reflect in all views
- [ ] Delete event in Daily view → Verify removed from all views
- [ ] Create all-day event → Verify proper display across views
- [ ] Test responsive design on different screen sizes
- [ ] Verify events persist after page refresh
- [ ] Test form validation with invalid inputs
- [ ] Test conflict detection with overlapping events

### Quick Test Commands
```bash
# Start the application
npm run dev

# In another terminal, test the API
npm run health

# Access the database
npm run db:inspect
```

## 🚀 Future Enhancements

### Phase 1: Core Feature Expansion (Next 3 months)

#### 1. Recurring Events System
```typescript
interface RecurringEvent extends CalendarEvent {
  recurrenceRule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;           // Every N days/weeks/months
    endDate?: Date;            // When recurrence stops
    count?: number;            // Number of occurrences
    byWeekDay?: number[];      // For weekly: [1,3,5] = Mon,Wed,Fri
    byMonthDay?: number[];     // For monthly: [1,15] = 1st and 15th
    exceptions?: Date[];       // Dates to skip
  };
}
```

#### 2. Advanced Event Conflict Resolution
- Automatic conflict detection during event creation
- Smart time suggestions for conflict-free scheduling
- Bulk conflict resolution tools
- Meeting room availability integration

#### 3. Enhanced Event Types
```typescript
interface ExtendedEvent extends CalendarEvent {
  type: 'meeting' | 'task' | 'reminder' | 'birthday' | 'holiday';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attendees?: Attendee[];
  location?: string;
  attachments?: File[];
  reminders?: Reminder[];
}
```

### Phase 2: Collaboration Features (Months 4-6)

#### 4. Multi-User Support & Authentication
- JWT-based authentication
- OAuth integration (Google, Microsoft, Apple)
- Role-based access control
- Calendar sharing permissions

#### 5. Real-Time Collaboration
- WebSocket integration for live updates
- Collaborative event editing
- Real-time conflict notifications
- Activity feed and change history

### Phase 3: Advanced Features (Months 7-12)

#### 6. Smart Scheduling Assistant
- AI-powered optimal time finding
- Meeting preference learning
- Travel time calculations
- Workload balancing suggestions

#### 7. Advanced Search & Filtering
- Full-text search across all event fields
- Advanced filtering with multiple criteria
- Saved search queries
- Export filtered results

#### 8. Analytics & Insights Dashboard
- Time distribution analysis
- Productivity metrics
- Weekly/monthly trends
- Calendar usage insights

### Phase 4: Platform Expansion (Year 2)

#### 9. Mobile Applications
- React Native cross-platform app
- Offline sync capabilities
- Push notifications
- Native device integrations

#### 10. Third-Party Integrations
- Google Calendar bi-directional sync
- Microsoft Outlook integration
- Zoom/Teams meeting links
- Slack notifications
- Task management tools (Jira, Asana)

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
