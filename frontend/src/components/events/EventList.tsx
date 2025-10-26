import React from 'react'
import { Box, Typography, Divider } from '@mui/material'
import { format, isSameDay } from 'date-fns'
import { CalendarEvent } from '../../types/calendar'
import EventDisplay from './EventDisplay'

interface EventListProps {
  events: CalendarEvent[]
  date?: Date
  variant?: 'compact' | 'detailed' | 'minimal'
  onEventClick?: (event: CalendarEvent) => void
  showDate?: boolean
  maxHeight?: string | number
  emptyMessage?: string
}

const EventList: React.FC<EventListProps> = ({
  events,
  date,
  variant = 'compact',
  onEventClick,
  showDate = false,
  maxHeight = 'auto',
  emptyMessage = 'No events'
}) => {
  // Filter events by date if provided
  const filteredEvents = date 
    ? events.filter(event => isSameDay(event.startTime, date))
    : events

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // All-day events first
    if (a.isAllDay && !b.isAllDay) return -1
    if (!a.isAllDay && b.isAllDay) return 1
    
    // Then by start time
    return a.startTime.getTime() - b.startTime.getTime()
  })

  if (sortedEvents.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60px',
          color: 'text.secondary'
        }}
      >
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          {emptyMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxHeight,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: '#a8a8a8'
          }
        }
      }}
    >
      {showDate && date && (
        <>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            {format(date, 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {sortedEvents.map((event, index) => (
        <EventDisplay
          key={event.id}
          event={event}
          variant={variant}
          onClick={onEventClick}
        />
      ))}
    </Box>
  )
}

export default EventList
