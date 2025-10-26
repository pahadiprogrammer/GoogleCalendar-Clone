import React from 'react'
import { Box, Typography, Chip, Tooltip } from '@mui/material'
import { Warning, ErrorOutline } from '@mui/icons-material'
import { format } from 'date-fns'
import { CalendarEvent } from '../../types/calendar'
import { detectEventOverlaps, getOverlapSeverity, formatConflictMessage } from '../../utils/eventUtils'

interface EventDisplayProps {
  event: CalendarEvent
  variant?: 'compact' | 'detailed' | 'minimal'
  onClick?: (event: CalendarEvent) => void
  maxWidth?: string | number
  allEvents?: CalendarEvent[]
  showOverlapIndicator?: boolean
}

const EventDisplay: React.FC<EventDisplayProps> = ({
  event,
  variant = 'compact',
  onClick,
  maxWidth = '100%',
  allEvents = [],
  showOverlapIndicator = true
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(event)
    }
  }

  // Check for overlaps
  const overlappingEvents = showOverlapIndicator ? detectEventOverlaps(event, allEvents) : []
  const hasOverlaps = overlappingEvents.length > 0
  const overlapSeverity = hasOverlaps ? getOverlapSeverity(event, overlappingEvents[0]) : 'none'

  const getEventColor = (color?: string) => {
    // Use the event's color property, or default to a standard color
    return color || '#1976d2'
  }

  const getOverlapStyles = () => {
    if (!hasOverlaps) return {}
    
    switch (overlapSeverity) {
      case 'minor':
        return {
          border: '2px solid #ff9800',
          boxShadow: '0 0 0 1px rgba(255, 152, 0, 0.3)'
        }
      case 'major':
        return {
          border: '2px solid #f44336',
          boxShadow: '0 0 0 2px rgba(244, 67, 54, 0.3)'
        }
      case 'complete':
        return {
          border: '2px solid #d32f2f',
          boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.4)',
          animation: 'pulse 2s infinite'
        }
      default:
        return {}
    }
  }

  const getOverlapIcon = () => {
    if (!hasOverlaps) return null
    
    const iconColor = overlapSeverity === 'minor' ? '#ff9800' : '#f44336'
    const IconComponent = overlapSeverity === 'complete' ? ErrorOutline : Warning
    
    return (
      <Tooltip title={formatConflictMessage(overlappingEvents)} arrow>
        <IconComponent 
          sx={{ 
            fontSize: '14px', 
            color: iconColor,
            ml: 0.5
          }} 
        />
      </Tooltip>
    )
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm')
  }

  const formatTimeRange = () => {
    if (event.isAllDay) {
      return 'All day'
    }
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
  }

  if (variant === 'minimal') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          maxWidth,
          height: '20px',
          backgroundColor: getEventColor(event.color),
          borderRadius: '2px',
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
          mb: 0.25,
          ...getOverlapStyles(),
          '&:hover': onClick ? {
            opacity: 0.8,
            transform: 'scale(1.02)'
          } : {}
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {event.title}
        </Typography>
        {getOverlapIcon()}
      </Box>
    )
  }

  if (variant === 'compact') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          maxWidth,
          backgroundColor: getEventColor(event.color),
          borderRadius: '4px',
          cursor: onClick ? 'pointer' : 'default',
          p: 0.5,
          mb: 0.5,
          ...getOverlapStyles(),
          '&:hover': onClick ? {
            opacity: 0.9,
            transform: 'scale(1.02)'
          } : {},
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {event.title}
          </Typography>
          {getOverlapIcon()}
        </Box>
        {!event.isAllDay && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.6rem',
              display: 'block'
            }}
          >
            {formatTimeRange()}
          </Typography>
        )}
      </Box>
    )
  }

  // Detailed variant
  return (
    <Box
      onClick={handleClick}
      sx={{
        width: '100%',
        maxWidth,
        border: `2px solid ${getEventColor(event.color)}`,
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
        p: 1.5,
        mb: 1,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...getOverlapStyles(),
        '&:hover': onClick ? {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)'
        } : {},
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: getEventColor(event.color),
              mr: 1
            }}
          >
            {event.title}
          </Typography>
          {getOverlapIcon()}
        </Box>
        <Chip
          label={hasOverlaps ? 'Conflict' : 'Event'}
          size="small"
          sx={{
            backgroundColor: hasOverlaps ? '#f44336' : getEventColor(event.color),
            color: 'white',
            fontSize: '0.6rem',
            height: '20px'
          }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          display: 'block',
          mb: event.description ? 1 : 0
        }}
      >
        {formatTimeRange()}
      </Typography>

      {hasOverlaps && (
        <Typography
          variant="caption"
          sx={{
            color: '#f44336',
            display: 'block',
            mb: event.description ? 1 : 0,
            fontWeight: 500
          }}
        >
          {formatConflictMessage(overlappingEvents)}
        </Typography>
      )}

      {event.description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontSize: '0.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {event.description}
        </Typography>
      )}

    </Box>
  )
}

export default EventDisplay
