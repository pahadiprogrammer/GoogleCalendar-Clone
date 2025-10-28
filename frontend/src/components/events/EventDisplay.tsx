import React, { useState } from 'react'
import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { format } from 'date-fns'
import { CalendarEvent } from '../../types/calendar'
import { useEvents } from '../../contexts/EventContext'
import ConfirmationDialog from '../common/ConfirmationDialog'

interface EventDisplayProps {
  event: CalendarEvent
  variant?: 'compact' | 'detailed' | 'minimal' | 'weekly' | 'daily'
  onClick?: (event: CalendarEvent) => void
  maxWidth?: string | number
  allEvents?: CalendarEvent[]
  showOverlapIndicator?: boolean
  showDeleteButton?: boolean
  isOverlapping?: boolean
}

const EventDisplay: React.FC<EventDisplayProps> = ({
  event,
  variant = 'compact',
  onClick,
  maxWidth = '100%',
  allEvents = [],
  showOverlapIndicator = true,
  showDeleteButton = true,
  isOverlapping = false
}) => {
  const { deleteEvent } = useEvents()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click handlers
    if (onClick) {
      onClick(event)
    }
  }

  // Utility function to lighten a color for overlapping events
  const lightenColor = (color: string, amount: number = 0.3): string => {
    // Remove # if present
    const hex = color.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Lighten by mixing with white
    const newR = Math.round(r + (255 - r) * amount)
    const newG = Math.round(g + (255 - g) * amount)
    const newB = Math.round(b + (255 - b) * amount)
    
    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0')
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
  }

  const getEventColor = (color?: string) => {
    const baseColor = color || '#1976d2'
    // Return lighter shade if this event is overlapping with others
    return isOverlapping ? lightenColor(baseColor, 0.4) : baseColor
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm')
  }

  const formatTimeRange = () => {
    if (event.isAllDay) {
      return 'All day'
    }
    if (!event.startTime || !event.endTime) {
      return 'Invalid time'
    }
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event click when delete button is clicked
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteEvent(event.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
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
          '&:hover': onClick ? {
            opacity: 0.9,
            transform: 'scale(1.02)'
          } : {},
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
          }}
        >
          {event.title}
        </Typography>
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

  if (variant === 'weekly') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: getEventColor(event.color),
          borderRadius: '3px',
          cursor: onClick ? 'pointer' : 'default',
          p: 0.5,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&:hover': onClick ? {
            opacity: 0.9,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          } : {},
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
            mb: 0.5
          }}
        >
          {event.title}
        </Typography>
        
        {!event.isAllDay && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '0.65rem',
              display: 'block',
              lineHeight: 1.1,
              mt: 'auto'
            }}
          >
            {formatTimeRange()}
          </Typography>
        )}
        
        {event.isAllDay && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '0.65rem',
              display: 'block',
              lineHeight: 1.1,
              mt: 'auto'
            }}
          >
            All day
          </Typography>
        )}
      </Box>
    )
  }

  if (variant === 'daily') {
    return (
      <>
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          sx={{
            width: '100%',
            maxWidth,
            backgroundColor: getEventColor(event.color),
            borderRadius: '6px',
            cursor: onClick ? 'pointer' : 'default',
            p: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative',
            '&:hover': onClick ? {
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)',
              opacity: 0.9
            } : {},
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'white',
                fontSize: '0.85rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }}
            >
              {event.title}
            </Typography>
            {showDeleteButton && isHovered && (
              <Tooltip title="Delete Event" arrow>
                <IconButton
                  onClick={handleDeleteClick}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    width: 20,
                    height: 20,
                    ml: 1
                  }}
                >
                  <Delete sx={{ fontSize: '12px' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'block',
              fontSize: '0.7rem'
            }}
          >
            {formatTimeRange()}
          </Typography>
        </Box>

        <ConfirmationDialog
          open={showDeleteDialog}
          title="Delete Event"
          message={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={isDeleting}
          confirmColor="error"
        />
      </>
    )
  }

  // Detailed variant
  return (
    <>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          position: 'relative',
          '&:hover': onClick ? {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          } : {},
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: getEventColor(event.color),
              flex: 1
            }}
          >
            {event.title}
          </Typography>
          {showDeleteButton && isHovered && (
            <Tooltip title="Delete Event" arrow>
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                sx={{
                  color: '#f44336',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                  },
                  width: 24,
                  height: 24,
                  ml: 1
                }}
              >
                <Delete sx={{ fontSize: '14px' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block'
          }}
        >
          {formatTimeRange()}
        </Typography>

        {event.description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: 'block',
              mt: 1,
              fontSize: '0.8rem'
            }}
          >
            {event.description}
          </Typography>
        )}
      </Box>

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
        confirmColor="error"
      />
    </>
  )
}

export default EventDisplay
