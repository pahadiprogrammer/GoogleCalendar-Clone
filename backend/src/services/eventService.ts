import { v4 as uuidv4 } from 'uuid'
import { dbRun, dbGet, dbAll } from '../database/config.js'
import { CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../types/event.js'

// Database row interface (matches SQLite schema)
interface EventRow {
  id: string
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  is_all_day: number  // SQLite INTEGER (0/1)
  color: string
  created_at: string
  updated_at: string
}

// Convert database row to CalendarEvent
const rowToEvent = (row: EventRow): CalendarEvent => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  startTime: row.start_time ? new Date(row.start_time) : null,
  endTime: row.end_time ? new Date(row.end_time) : null,
  isAllDay: Boolean(row.is_all_day),
  color: row.color,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
})

// Convert CalendarEvent to database values
const eventToRow = (event: Partial<CalendarEvent> & { id: string }): Partial<EventRow> => ({
  id: event.id,
  title: event.title,
  description: event.description || null,
  start_time: event.startTime ? event.startTime.toISOString() : null,
  end_time: event.endTime ? event.endTime.toISOString() : null,
  is_all_day: event.isAllDay ? 1 : 0,
  color: event.color,
  updated_at: new Date().toISOString()
})

export class EventService {
  // Backend overlap detection utilities
  static doEventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
    // All-day events overlap if they're on the same day
    if (event1.isAllDay && event2.isAllDay) {
      if (!event1.startTime || !event2.startTime) return false
      const date1 = new Date(event1.startTime).toDateString()
      const date2 = new Date(event2.startTime).toDateString()
      return date1 === date2
    }
    
    // If either event is all-day, check if timed event falls on all-day event's date
    if (event1.isAllDay && !event2.isAllDay) {
      if (!event1.startTime || !event2.startTime) return false
      const allDayDate = new Date(event1.startTime).toDateString()
      const timedDate = new Date(event2.startTime).toDateString()
      return allDayDate === timedDate
    }
    
    if (!event1.isAllDay && event2.isAllDay) {
      if (!event1.startTime || !event2.startTime) return false
      const timedDate = new Date(event1.startTime).toDateString()
      const allDayDate = new Date(event2.startTime).toDateString()
      return timedDate === allDayDate
    }
    
    // Both are timed events - check for time overlap
    if (!event1.startTime || !event2.startTime) return false
    
    const start1 = new Date(event1.startTime).getTime()
    const end1 = event1.endTime ? new Date(event1.endTime).getTime() : start1 + (60 * 60 * 1000) // Default 1 hour
    const start2 = new Date(event2.startTime).getTime()
    const end2 = event2.endTime ? new Date(event2.endTime).getTime() : start2 + (60 * 60 * 1000) // Default 1 hour
    
    return start1 < end2 && start2 < end1
  }
  
  static async detectEventOverlaps(event: CalendarEvent, excludeEventId?: string): Promise<CalendarEvent[]> {
    if (!event.startTime) return []
    
    // Get events for the same date
    const eventDate = new Date(event.startTime)
    const eventsOnDate = await this.getEventsForDate(eventDate)
    
    // Filter out the event being checked (for updates)
    const otherEvents = eventsOnDate.filter(e => e.id !== excludeEventId && e.id !== event.id)
    
    // Find overlapping events
    return otherEvents.filter(otherEvent => this.doEventsOverlap(event, otherEvent))
  }

  // Create a new event
  static async createEvent(eventData: CreateEventRequest): Promise<CalendarEvent> {
    const id = uuidv4()
    const now = new Date().toISOString()
    
    const sql = `
      INSERT INTO events (id, title, description, start_time, end_time, is_all_day, color, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
      id,
      eventData.title,
      eventData.description || null,
      eventData.startTime,
      eventData.endTime,
      eventData.isAllDay ? 1 : 0,
      eventData.color,
      now,
      now
    ]
    
    await dbRun(sql, params)
    
    // Fetch and return the created event
    const createdEvent = await this.getEventById(id)
    if (!createdEvent) {
      throw new Error('Failed to create event')
    }
    
    return createdEvent
  }
  
  // Get event by ID
  static async getEventById(id: string): Promise<CalendarEvent | null> {
    const sql = 'SELECT * FROM events WHERE id = ?'
    const row = await dbGet<EventRow>(sql, [id])
    
    return row ? rowToEvent(row) : null
  }
  
  // Get all events
  static async getAllEvents(): Promise<CalendarEvent[]> {
    const sql = 'SELECT * FROM events ORDER BY start_time ASC, created_at ASC'
    const rows = await dbAll<EventRow>(sql)
    
    return rows.map(rowToEvent)
  }
  
  // Get events by date range
  static async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const sql = `
      SELECT * FROM events 
      WHERE 
        (start_time IS NULL AND is_all_day = 1) OR
        (start_time >= ? AND start_time <= ?) OR
        (end_time >= ? AND end_time <= ?) OR
        (start_time <= ? AND end_time >= ?)
      ORDER BY start_time ASC, created_at ASC
    `
    
    const startISO = startDate.toISOString()
    const endISO = endDate.toISOString()
    
    const rows = await dbAll<EventRow>(sql, [
      startISO, endISO,  // Events starting in range
      startISO, endISO,  // Events ending in range
      startISO, endISO   // Events spanning the range
    ])
    
    return rows.map(rowToEvent)
  }
  
  // Update event
  static async updateEvent(id: string, eventData: Partial<CreateEventRequest>): Promise<CalendarEvent | null> {
    // First check if event exists
    const existingEvent = await this.getEventById(id)
    if (!existingEvent) {
      return null
    }
    
    // Build dynamic update query
    const updates: string[] = []
    const params: any[] = []
    
    if (eventData.title !== undefined) {
      updates.push('title = ?')
      params.push(eventData.title)
    }
    
    if (eventData.description !== undefined) {
      updates.push('description = ?')
      params.push(eventData.description || null)
    }
    
    if (eventData.startTime !== undefined) {
      updates.push('start_time = ?')
      params.push(eventData.startTime)
    }
    
    if (eventData.endTime !== undefined) {
      updates.push('end_time = ?')
      params.push(eventData.endTime)
    }
    
    if (eventData.isAllDay !== undefined) {
      updates.push('is_all_day = ?')
      params.push(eventData.isAllDay ? 1 : 0)
    }
    
    if (eventData.color !== undefined) {
      updates.push('color = ?')
      params.push(eventData.color)
    }
    
    // Always update the updated_at timestamp
    updates.push('updated_at = ?')
    params.push(new Date().toISOString())
    
    // Add ID for WHERE clause
    params.push(id)
    
    const sql = `UPDATE events SET ${updates.join(', ')} WHERE id = ?`
    await dbRun(sql, params)
    
    // Return updated event
    return this.getEventById(id)
  }
  
  // Delete event
  static async deleteEvent(id: string): Promise<boolean> {
    const sql = 'DELETE FROM events WHERE id = ?'
    const result = await dbRun(sql, [id])
    
    return result.changes > 0
  }
  
  // Get events for a specific date (for daily view)
  static async getEventsForDate(date: Date): Promise<CalendarEvent[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    return this.getEventsByDateRange(startOfDay, endOfDay)
  }
}
