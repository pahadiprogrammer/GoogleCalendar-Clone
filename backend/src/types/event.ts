export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date | null
  endTime: Date | null
  isAllDay: boolean
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventRequest {
  title: string
  description?: string
  startTime?: string | null  // ISO string from frontend
  endTime?: string | null    // ISO string from frontend
  isAllDay: boolean
  color: string
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string
}

export interface EventResponse {
  id: string
  title: string
  description?: string
  startTime: string | null  // ISO string to frontend
  endTime: string | null    // ISO string to frontend
  isAllDay: boolean
  color: string
  createdAt: string
  updatedAt: string
  overlaps?: EventOverlapInfo[]  // Optional overlap information
}

export interface EventOverlapInfo {
  eventId: string
  eventTitle: string
  overlapType: 'minor' | 'major' | 'complete'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
