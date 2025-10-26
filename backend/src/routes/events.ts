import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { EventService } from '../services/eventService.js'
import { ApiResponse, EventResponse, CreateEventRequest, EventOverlapInfo } from '../types/event.js'

const router = Router()

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  isAllDay: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#1976d2')
})

const updateEventSchema = createEventSchema.partial()

const dateRangeSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date')
})

// Helper function to determine overlap severity
const getOverlapSeverity = (event1: any, event2: any): 'minor' | 'major' | 'complete' => {
  // All-day events with timed events = minor
  if (event1.isAllDay !== event2.isAllDay) return 'minor'
  
  // Both all-day events = major
  if (event1.isAllDay && event2.isAllDay) return 'major'
  
  // Both timed events - check time overlap percentage
  if (!event1.startTime || !event2.startTime) return 'minor'
  
  const start1 = new Date(event1.startTime).getTime()
  const end1 = event1.endTime ? new Date(event1.endTime).getTime() : start1 + (60 * 60 * 1000)
  const start2 = new Date(event2.startTime).getTime()
  const end2 = event2.endTime ? new Date(event2.endTime).getTime() : start2 + (60 * 60 * 1000)
  
  const overlapStart = Math.max(start1, start2)
  const overlapEnd = Math.min(end1, end2)
  const overlapDuration = overlapEnd - overlapStart
  
  const duration1 = end1 - start1
  const duration2 = end2 - start2
  const minDuration = Math.min(duration1, duration2)
  
  const overlapPercentage = overlapDuration / minDuration
  
  if (overlapPercentage >= 0.8) return 'complete'
  if (overlapPercentage >= 0.5) return 'major'
  return 'minor'
}

// Helper function to convert CalendarEvent to EventResponse with optional overlaps
const eventToResponse = (event: any, overlaps?: any[]): EventResponse => {
  const response: EventResponse = {
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime ? event.startTime.toISOString() : null,
    endTime: event.endTime ? event.endTime.toISOString() : null,
    isAllDay: event.isAllDay,
    color: event.color,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString()
  }
  
  if (overlaps && overlaps.length > 0) {
    response.overlaps = overlaps.map(overlap => ({
      eventId: overlap.id,
      eventTitle: overlap.title,
      overlapType: getOverlapSeverity(event, overlap)
    }))
  }
  
  return response
}

// GET /api/v1/events - Get all events or events by date range
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query
    
    let events
    
    if (startDate && endDate) {
      // Validate date range parameters
      const validation = dateRangeSchema.safeParse({ startDate, endDate })
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid date range parameters',
          message: validation.error.errors.map(e => e.message).join(', ')
        }
        return res.status(400).json(response)
      }
      
      events = await EventService.getEventsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      )
    } else {
      events = await EventService.getAllEvents()
    }
    
    const response: ApiResponse<EventResponse[]> = {
      success: true,
      data: events.map(event => eventToResponse(event)),
      message: `Retrieved ${events.length} events`
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching events:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch events',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// GET /api/v1/events/:id - Get event by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Event ID is required'
      }
      return res.status(400).json(response)
    }
    
    const event = await EventService.getEventById(id)
    
    if (!event) {
      const response: ApiResponse = {
        success: false,
        error: 'Event not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<EventResponse> = {
      success: true,
      data: eventToResponse(event),
      message: 'Event retrieved successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching event:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch event',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// POST /api/v1/events - Create new event
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createEventSchema.safeParse(req.body)
    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      }
      return res.status(400).json(response)
    }
    
    const eventData: CreateEventRequest = validation.data
    const event = await EventService.createEvent(eventData)
    
    // Check for overlaps after creation
    const overlaps = await EventService.detectEventOverlaps(event)
    
    let message = 'Event created successfully'
    if (overlaps.length > 0) {
      message += ` (Warning: ${overlaps.length} scheduling conflict${overlaps.length > 1 ? 's' : ''} detected)`
    }
    
    const response: ApiResponse<EventResponse> = {
      success: true,
      data: eventToResponse(event, overlaps),
      message
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error creating event:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create event',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// PUT /api/v1/events/:id - Update event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Event ID is required'
      }
      return res.status(400).json(response)
    }
    
    // Validate request body
    const validation = updateEventSchema.safeParse(req.body)
    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      }
      return res.status(400).json(response)
    }
    
    const eventData = validation.data
    const event = await EventService.updateEvent(id, eventData)
    
    if (!event) {
      const response: ApiResponse = {
        success: false,
        error: 'Event not found'
      }
      return res.status(404).json(response)
    }
    
    // Check for overlaps after update (exclude the current event)
    const overlaps = await EventService.detectEventOverlaps(event, id)
    
    let message = 'Event updated successfully'
    if (overlaps.length > 0) {
      message += ` (Warning: ${overlaps.length} scheduling conflict${overlaps.length > 1 ? 's' : ''} detected)`
    }
    
    const response: ApiResponse<EventResponse> = {
      success: true,
      data: eventToResponse(event, overlaps),
      message
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error updating event:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update event',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/v1/events/:id - Delete event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Event ID is required'
      }
      return res.status(400).json(response)
    }
    
    const deleted = await EventService.deleteEvent(id)
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Event not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Event deleted successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error deleting event:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete event',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// GET /api/v1/events/date/:date - Get events for specific date
router.get('/date/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params
    
    if (!date || isNaN(Date.parse(date))) {
      const response: ApiResponse = {
        success: false,
        error: 'Valid date is required (YYYY-MM-DD format)'
      }
      return res.status(400).json(response)
    }
    
    const events = await EventService.getEventsForDate(new Date(date))
    
    const response: ApiResponse<EventResponse[]> = {
      success: true,
      data: events.map(event => eventToResponse(event)),
      message: `Retrieved ${events.length} events for ${date}`
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching events for date:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch events for date',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

export default router
