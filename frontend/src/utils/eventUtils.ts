import { CalendarEvent, EventFormData } from '../types/calendar'
import { isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns'

/**
 * Generate a unique ID for events
 */
export const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Filter events by a specific date
 */
export const filterEventsByDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => event.startTime && isSameDay(event.startTime, date))
}

/**
 * Filter events by date range
 */
export const filterEventsByDateRange = (
  events: CalendarEvent[], 
  startDate: Date, 
  endDate: Date
): CalendarEvent[] => {
  return events.filter(event => {
    if (!event.startTime || !event.endTime) return false
    return isWithinInterval(event.startTime, { start: startDate, end: endDate }) ||
           isWithinInterval(event.endTime, { start: startDate, end: endDate }) ||
           (event.startTime <= startDate && event.endTime >= endDate)
  })
}

/**
 * Sort events by start time
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    if (!a.startTime || !b.startTime) return 0
    return a.startTime.getTime() - b.startTime.getTime()
  })
}

/**
 * Check if an event occurs on a specific date
 */
export const isEventOnDate = (event: CalendarEvent, date: Date): boolean => {
  if (!event.startTime || !event.endTime) return false
  return isSameDay(event.startTime, date) || 
         (event.startTime <= startOfDay(date) && event.endTime >= endOfDay(date))
}

/**
 * Get events for a specific hour on a date
 */
export const getEventsForHour = (events: CalendarEvent[], date: Date, hour: number): CalendarEvent[] => {
  return events.filter(event => {
    if (!event.startTime || !event.endTime) return false
    if (!isSameDay(event.startTime, date)) return false
    
    const eventStartHour = event.startTime.getHours()
    const eventEndHour = event.endTime.getHours()
    
    // Event starts in this hour or spans across this hour
    return (eventStartHour <= hour && eventEndHour >= hour) ||
           (eventStartHour === hour)
  })
}

/**
 * Create a CalendarEvent from form data
 */
export const createEventFromFormData = (formData: EventFormData): CalendarEvent => {
  const now = new Date()
  
  return {
    id: generateEventId(),
    title: formData.title,
    startTime: formData.startTime,
    endTime: formData.endTime,
    description: formData.description,
    color: formData.color || '#1976d2', // Default blue color
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Update an existing event with form data
 */
export const updateEventWithFormData = (
  existingEvent: CalendarEvent, 
  formData: EventFormData
): CalendarEvent => {
  return {
    ...existingEvent,
    title: formData.title,
    startTime: formData.startTime,
    endTime: formData.endTime,
    description: formData.description,
    color: formData.color || existingEvent.color,
    updatedAt: new Date()
  }
}

/**
 * Validate event form data
 */
export const validateEventFormData = (formData: EventFormData): string[] => {
  const errors: string[] = []
  
  if (!formData.title.trim()) {
    errors.push('Event title is required')
  }
  
  if (formData.startTime >= formData.endTime) {
    errors.push('End time must be after start time')
  }
  
  if (formData.title.length > 100) {
    errors.push('Event title must be less than 100 characters')
  }
  
  if (formData.description && formData.description.length > 500) {
    errors.push('Event description must be less than 500 characters')
  }
  
  return errors
}

/**
 * Format event time for display
 */
export const formatEventTime = (event: CalendarEvent): string => {
  const startTime = event.startTime.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  
  const endTime = event.endTime.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  
  return `${startTime} - ${endTime}`
}

/**
 * Get event duration in minutes
 */
export const getEventDurationMinutes = (event: CalendarEvent): number => {
  return Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60))
}

/**
 * Check if two events overlap in time
 */
export const doEventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  return event1.startTime < event2.endTime && event2.startTime < event1.endTime
}

/**
 * Check if two events have a time conflict (more detailed than overlap)
 */
export const hasTimeConflict = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  // Skip if events are on different days
  if (!isSameDay(event1.startTime, event2.startTime)) {
    return false
  }
  
  // Skip if it's the same event
  if (event1.id === event2.id) {
    return false
  }
  
  // Check for time overlap
  return doEventsOverlap(event1, event2)
}

/**
 * Detect all overlapping events for a given event
 */
export const detectEventOverlaps = (
  targetEvent: CalendarEvent, 
  allEvents: CalendarEvent[]
): CalendarEvent[] => {
  return allEvents.filter(event => hasTimeConflict(targetEvent, event))
}

/**
 * Get all overlapping events in a list
 */
export const getOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[][] => {
  const overlappingGroups: CalendarEvent[][] = []
  const processedEvents = new Set<string>()
  
  events.forEach(event => {
    if (processedEvents.has(event.id)) return
    
    const overlaps = detectEventOverlaps(event, events)
    if (overlaps.length > 0) {
      const group = [event, ...overlaps]
      overlappingGroups.push(group)
      
      // Mark all events in this group as processed
      group.forEach(e => processedEvents.add(e.id))
    }
  })
  
  return overlappingGroups
}

/**
 * Check if an event conflicts with existing events
 */
export const checkEventConflicts = (
  newEvent: CalendarEvent | EventFormData, 
  existingEvents: CalendarEvent[]
): { hasConflicts: boolean; conflictingEvents: CalendarEvent[] } => {
  // Convert EventFormData to CalendarEvent format for comparison
  const eventToCheck: CalendarEvent = 'id' in newEvent 
    ? newEvent 
    : { ...createEventFromFormData(newEvent), id: 'temp-id' }
  
  const conflicts = detectEventOverlaps(eventToCheck, existingEvents)
  
  return {
    hasConflicts: conflicts.length > 0,
    conflictingEvents: conflicts
  }
}

/**
 * Calculate overlap percentage between two events
 */
export const calculateOverlapPercentage = (event1: CalendarEvent, event2: CalendarEvent): number => {
  if (!doEventsOverlap(event1, event2)) return 0
  
  const overlapStart = Math.max(event1.startTime.getTime(), event2.startTime.getTime())
  const overlapEnd = Math.min(event1.endTime.getTime(), event2.endTime.getTime())
  const overlapDuration = overlapEnd - overlapStart
  
  const event1Duration = event1.endTime.getTime() - event1.startTime.getTime()
  const event2Duration = event2.endTime.getTime() - event2.startTime.getTime()
  
  // Return percentage based on the shorter event
  const shorterDuration = Math.min(event1Duration, event2Duration)
  return Math.round((overlapDuration / shorterDuration) * 100)
}

/**
 * Get overlap severity level
 */
export const getOverlapSeverity = (event1: CalendarEvent, event2: CalendarEvent): 'none' | 'minor' | 'major' | 'complete' => {
  const overlapPercentage = calculateOverlapPercentage(event1, event2)
  
  if (overlapPercentage === 0) return 'none'
  if (overlapPercentage < 25) return 'minor'
  if (overlapPercentage < 75) return 'major'
  return 'complete'
}

/**
 * Format conflict message for user display
 */
export const formatConflictMessage = (conflictingEvents: CalendarEvent[]): string => {
  if (conflictingEvents.length === 0) return ''
  
  if (conflictingEvents.length === 1) {
    const event = conflictingEvents[0]
    return `This event conflicts with "${event.title}" (${formatEventTime(event)})`
  }
  
  return `This event conflicts with ${conflictingEvents.length} other events: ${
    conflictingEvents.map(e => `"${e.title}"`).join(', ')
  }`
}

/**
 * Get default event colors
 */
export const getDefaultEventColors = (): string[] => {
  return [
    '#1976d2', // Blue
    '#388e3c', // Green
    '#f57c00', // Orange
    '#d32f2f', // Red
    '#7b1fa2', // Purple
    '#0288d1', // Light Blue
    '#689f38', // Light Green
    '#f9a825', // Yellow
    '#c2185b', // Pink
    '#5d4037'  // Brown
  ]
}
