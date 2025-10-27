export interface CalendarDate {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected?: boolean
}

export interface DateCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected?: boolean
  events?: CalendarEvent[]
  allEvents?: CalendarEvent[]
  onClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export interface CalendarGridProps {
  dates: Date[]
  currentMonth: Date
  selectedDate?: Date | null
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export interface WeekHeaderProps {
  showFullNames?: boolean
}

export type CalendarView = 'daily' | 'weekly' | 'monthly' | 'yearly'

// Enhanced CalendarEvent interface for MVP event system
export interface CalendarEvent {
  id: string
  title: string
  startTime: Date | null
  endTime: Date | null
  description?: string
  color?: string
  // Future-proof fields (optional for now)
  recurrenceRule?: RecurrenceRule  // Add later
  parentEventId?: string           // For recurring instances
  isAllDay?: boolean              // Add later
  timezone?: string               // Add later
  createdAt?: Date
  updatedAt?: Date
}

// Event creation/editing form data
export interface EventFormData {
  title: string
  startTime: Date
  endTime: Date
  description?: string
  color?: string
}

// Event display props for components
export interface EventDisplayProps {
  event: CalendarEvent
  onClick?: (event: CalendarEvent) => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (eventId: string) => void
}

// Future: Recurrence rule interface (extensible design)
export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number // Every N days/weeks/months
  daysOfWeek?: number[] // For weekly: [0,1,2,3,4] = Mon-Fri
  dayOfMonth?: number // For monthly: 15th of each month
  endDate?: Date
  count?: number // Stop after N occurrences
}

// Event context type for state management
export interface EventContextType {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  addEvent: (eventData: EventFormData) => Promise<void>
  updateEvent: (id: string, eventData: EventFormData) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[]
}

export interface TimeSlotProps {
  hour: number
  date: Date
  events?: CalendarEvent[]
  allEvents?: CalendarEvent[]
  isCurrentHour?: boolean
  onClick?: (date: Date, hour: number) => void
  onEventClick?: (event: CalendarEvent) => void
}

export interface WeekColumnProps {
  date: Date
  events?: CalendarEvent[]
  allEvents?: CalendarEvent[]
  selectedDate?: Date | null
  onTimeSlotClick?: (date: Date, hour: number) => void
  onEventClick?: (event: CalendarEvent) => void
}

export interface WeeklyViewProps {
  // No specific props needed - uses CalendarContext
}

export interface TimeSelection {
  date: Date
  hour: number
}
