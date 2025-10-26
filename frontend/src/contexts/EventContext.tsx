import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CalendarEvent, EventFormData, EventContextType } from '../types/calendar'
import { 
  filterEventsByDate, 
  filterEventsByDateRange,
  validateEventFormData 
} from '../utils/eventUtils'
import { eventApiService } from '../services/eventService'

const EventContext = createContext<EventContextType | undefined>(undefined)

interface EventProviderProps {
  children: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load events from backend API on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedEvents = await eventApiService.getAllEvents()
        setEvents(fetchedEvents)
      } catch (err) {
        console.error('Failed to load events from API:', err)
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const addEvent = async (eventData: EventFormData): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Validate form data
      const validationErrors = validateEventFormData(eventData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }

      // Create event via API
      const newEvent = await eventApiService.createEvent(eventData)
      
      // Add to local events array
      setEvents(prevEvents => [...prevEvents, newEvent])
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (id: string, eventData: EventFormData): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Validate form data
      const validationErrors = validateEventFormData(eventData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }

      // Update event via API
      const updatedEvent = await eventApiService.updateEvent(id, eventData)
      
      // Update local events array
      setEvents(prevEvents => 
        prevEvents.map(event => event.id === id ? updatedEvent : event)
      )
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Delete event via API
      await eventApiService.deleteEvent(id)
      
      // Remove from local events array
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return filterEventsByDate(events, date)
  }

  const getEventsForDateRange = (startDate: Date, endDate: Date): CalendarEvent[] => {
    return filterEventsByDateRange(events, startDate, endDate)
  }

  const contextValue: EventContextType = {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForDateRange
  }

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}

// Helper hook for getting events for the current calendar view
export const useEventsForView = (startDate: Date, endDate: Date): CalendarEvent[] => {
  const { getEventsForDateRange } = useEvents()
  return getEventsForDateRange(startDate, endDate)
}

// Helper hook for getting events for a specific date
export const useEventsForDate = (date: Date): CalendarEvent[] => {
  const { getEventsForDate } = useEvents()
  return getEventsForDate(date)
}
