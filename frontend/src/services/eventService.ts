import { CalendarEvent, EventFormData } from '../types/calendar'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

interface ApiError {
  success: false
  error: string
  message: string
}

class EventApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        const error = data as ApiError
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return (data as ApiResponse<T>).data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  async getAllEvents(): Promise<CalendarEvent[]> {
    const events = await this.request<CalendarEvent[]>('/events')
    
    // Convert date strings to Date objects (null-safe)
    return events.map(event => ({
      ...event,
      startTime: event.startTime ? new Date(event.startTime) : null,
      endTime: event.endTime ? new Date(event.endTime) : null,
      createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
    }))
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    const event = await this.request<CalendarEvent>(`/events/${id}`)
    
    // Convert date strings to Date objects (null-safe)
    return {
      ...event,
      startTime: event.startTime ? new Date(event.startTime) : null,
      endTime: event.endTime ? new Date(event.endTime) : null,
      createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
    }
  }

  async createEvent(eventData: EventFormData): Promise<CalendarEvent> {
    const event = await this.request<CalendarEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })

    // Convert date strings to Date objects (null-safe)
    return {
      ...event,
      startTime: event.startTime ? new Date(event.startTime) : null,
      endTime: event.endTime ? new Date(event.endTime) : null,
      createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
    }
  }

  async updateEvent(id: string, eventData: EventFormData): Promise<CalendarEvent> {
    const event = await this.request<CalendarEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    })

    // Convert date strings to Date objects (null-safe)
    return {
      ...event,
      startTime: event.startTime ? new Date(event.startTime) : null,
      endTime: event.endTime ? new Date(event.endTime) : null,
      createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
    }
  }

  async deleteEvent(id: string): Promise<void> {
    await this.request<void>(`/events/${id}`, {
      method: 'DELETE',
    })
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const start = startDate.toISOString()
    const end = endDate.toISOString()
    const events = await this.request<CalendarEvent[]>(`/events?startDate=${start}&endDate=${end}`)
    
    // Convert date strings to Date objects (null-safe)
    return events.map(event => ({
      ...event,
      startTime: event.startTime ? new Date(event.startTime) : null,
      endTime: event.endTime ? new Date(event.endTime) : null,
      createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
    }))
  }
}

export const eventApiService = new EventApiService()
