// Calendar constants
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const

export const DAYS_OF_WEEK_SHORT = [
  'Sun',
  'Mon',
  'Tue', 
  'Wed',
  'Thu',
  'Fri',
  'Sat'
] as const

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export const CALENDAR_WEEKS = 6 // Standard calendar grid has 6 weeks
export const DAYS_IN_WEEK = 7

// Weekly calendar constants
export const WEEK_START_HOUR = 6 // 6 AM
export const WEEK_END_HOUR = 23 // 11 PM
export const HOURS_IN_DAY = WEEK_END_HOUR - WEEK_START_HOUR + 1
export const TIME_SLOT_HEIGHT = 60 // Height in pixels for each hour slot
