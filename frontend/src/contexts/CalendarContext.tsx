import React, { createContext, useContext, useState, ReactNode } from 'react'
import { 
  format, 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays, 
  addYears, 
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  isToday
} from 'date-fns'

export type CalendarView = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface CalendarContextType {
  // Current state
  currentDate: Date
  currentView: CalendarView
  selectedDate: Date | null
  
  // Navigation functions
  goToNext: () => void
  goToPrevious: () => void
  goToToday: () => void
  goToDate: (date: Date) => void
  setView: (view: CalendarView) => void
  setSelectedDate: (date: Date | null) => void
  
  // Utility functions
  getDisplayTitle: () => string
  getDateRange: () => { start: Date; end: Date }
  isCurrentDate: (date: Date) => boolean
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

interface CalendarProviderProps {
  children: ReactNode
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentView, setCurrentView] = useState<CalendarView>('monthly')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const goToNext = () => {
    setCurrentDate(prevDate => {
      switch (currentView) {
        case 'daily':
          return addDays(prevDate, 1)
        case 'weekly':
          return addWeeks(prevDate, 1)
        case 'monthly':
          return addMonths(prevDate, 1)
        case 'yearly':
          return addYears(prevDate, 1)
        default:
          return prevDate
      }
    })
  }

  const goToPrevious = () => {
    setCurrentDate(prevDate => {
      switch (currentView) {
        case 'daily':
          return subDays(prevDate, 1)
        case 'weekly':
          return subWeeks(prevDate, 1)
        case 'monthly':
          return subMonths(prevDate, 1)
        case 'yearly':
          return subYears(prevDate, 1)
        default:
          return prevDate
      }
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const goToDate = (date: Date) => {
    setCurrentDate(date)
  }

  const setView = (view: CalendarView) => {
    setCurrentView(view)
  }

  const getDisplayTitle = (): string => {
    switch (currentView) {
      case 'daily':
        return format(currentDate, 'EEEE, MMMM d, yyyy')
      case 'weekly':
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
      case 'monthly':
        return format(currentDate, 'MMMM yyyy')
      case 'yearly':
        return format(currentDate, 'yyyy')
      default:
        return format(currentDate, 'MMMM yyyy')
    }
  }

  const getDateRange = (): { start: Date; end: Date } => {
    switch (currentView) {
      case 'daily':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        }
      case 'weekly':
        return {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        }
      case 'monthly':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
      case 'yearly':
        return {
          start: startOfYear(currentDate),
          end: endOfYear(currentDate)
        }
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
    }
  }

  const isCurrentDate = (date: Date): boolean => {
    return isToday(date)
  }

  const value: CalendarContextType = {
    currentDate,
    currentView,
    selectedDate,
    goToNext,
    goToPrevious,
    goToToday,
    goToDate,
    setView,
    setSelectedDate,
    getDisplayTitle,
    getDateRange,
    isCurrentDate
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}
