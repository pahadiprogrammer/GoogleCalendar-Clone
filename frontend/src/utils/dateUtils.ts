import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
  isSameMonth
} from 'date-fns'
import { CALENDAR_WEEKS, DAYS_IN_WEEK } from './constants'

/**
 * Get all days to display in a monthly calendar grid
 * Returns 42 days (6 weeks × 7 days) including previous/next month overflow
 */
export const getMonthCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  
  // Get the start of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart)
  
  // Get the end of the week containing the last day of the month
  const calendarEnd = endOfWeek(monthEnd)
  
  // Get all days in the calendar grid
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })
  
  // Ensure we always have exactly 42 days (6 weeks)
  const totalDays = CALENDAR_WEEKS * DAYS_IN_WEEK
  
  if (days.length < totalDays) {
    // Add additional days if needed (rare edge case)
    const lastDay = days[days.length - 1]
    for (let i = days.length; i < totalDays; i++) {
      const nextDay = new Date(lastDay)
      nextDay.setDate(lastDay.getDate() + (i - days.length + 1))
      days.push(nextDay)
    }
  }
  
  return days.slice(0, totalDays)
}

/**
 * Check if a date is in the current month being displayed
 */
export const isDateInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth)
}

/**
 * Check if a date is today
 */
export const isDateToday = (date: Date): boolean => {
  return isToday(date)
}

/**
 * Check if two dates are the same day
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2)
}

/**
 * Format date for display in calendar cell
 */
export const formatCalendarDate = (date: Date): string => {
  return format(date, 'd')
}

/**
 * Get week days for calendar header
 */
export const getWeekDays = (): Date[] => {
  // Get a week starting from Sunday
  const sunday = new Date()
  sunday.setDate(sunday.getDate() - sunday.getDay())
  
  return eachDayOfInterval({
    start: sunday,
    end: new Date(sunday.getTime() + 6 * 24 * 60 * 60 * 1000)
  })
}

/**
 * Format day name for week header
 */
export const formatWeekDay = (date: Date, short: boolean = true): string => {
  return format(date, short ? 'EEE' : 'EEEE')
}

/**
 * Get the 7 days of the current week for weekly view
 */
export const getWeekDaysForDate = (date: Date): Date[] => {
  const weekStart = startOfWeek(date)
  const weekEnd = endOfWeek(date)
  
  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  })
}

/**
 * Generate time slots for weekly/daily view
 */
export const getTimeSlots = (startHour: number = 6, endHour: number = 23): string[] => {
  const timeSlots: string[] = []
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const time = new Date()
    time.setHours(hour, 0, 0, 0)
    timeSlots.push(format(time, 'h a'))
  }
  
  return timeSlots
}

/**
 * Format time for display in time slots
 */
export const formatTimeSlot = (hour: number): string => {
  const time = new Date()
  time.setHours(hour, 0, 0, 0)
  return format(time, 'h a')
}

/**
 * Get current time as hour number (0-23)
 */
export const getCurrentHour = (): number => {
  return new Date().getHours()
}

/**
 * Check if a time slot represents the current hour
 */
export const isCurrentTimeSlot = (hour: number): boolean => {
  return hour === getCurrentHour()
}

/**
 * Format date for weekly view column header
 */
export const formatWeekColumnHeader = (date: Date): string => {
  return format(date, 'EEE d')
}

/**
 * Get all 12 months in a year for yearly view
 */
export const getMonthsInYear = (date: Date): Date[] => {
  const year = date.getFullYear()
  const months: Date[] = []
  
  for (let month = 0; month < 12; month++) {
    months.push(new Date(year, month, 1))
  }
  
  return months
}

/**
 * Get all days in a month for mini calendar in yearly view
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  
  // Get the start of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart)
  
  // Get the end of the week containing the last day of the month
  const calendarEnd = endOfWeek(monthEnd)
  
  // Get all days in the calendar grid
  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })
}
