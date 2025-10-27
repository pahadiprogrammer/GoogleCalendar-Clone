import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import { Edit, Delete, Close, Warning, ErrorOutline } from '@mui/icons-material'
import { format } from 'date-fns'
import { CalendarEvent } from '../../types/calendar'
import { detectEventOverlaps, getOverlapSeverity, formatConflictMessage } from '../../utils/eventUtils'
import { useEvents } from '../../contexts/EventContext'
import ConfirmationDialog from '../common/ConfirmationDialog'
import EventForm from './EventForm'

interface EventDetailsDialogProps {
  open: boolean
  onClose: () => void
  event: CalendarEvent | null
  allEvents?: CalendarEvent[]
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  open,
  onClose,
  event,
  allEvents = []
}) => {
  const { updateEvent, deleteEvent } = useEvents()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!event) return null

  // Check for overlaps
  const overlappingEvents = detectEventOverlaps(event, allEvents)
  const hasOverlaps = overlappingEvents.length > 0
  const overlapSeverity = hasOverlaps ? getOverlapSeverity(event, overlappingEvents[0]) : 'none'

  const formatDateTime = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a')
  }

  const formatTimeRange = () => {
    if (event.isAllDay) {
      if (event.startTime && event.endTime) {
        const startDate = format(event.startTime, 'MMMM d, yyyy')
        const endDate = format(event.endTime, 'MMMM d, yyyy')
        return startDate === endDate ? `All day on ${startDate}` : `All day from ${startDate} to ${endDate}`
      }
      return 'All day'
    }
    
    if (!event.startTime || !event.endTime) {
      return 'Invalid time'
    }
    
    const startDate = format(event.startTime, 'MMMM d, yyyy')
    const endDate = format(event.endTime, 'MMMM d, yyyy')
    
    if (startDate === endDate) {
      return `${format(event.startTime, 'EEEE, MMMM d, yyyy')} from ${format(event.startTime, 'h:mm a')} to ${format(event.endTime, 'h:mm a')}`
    } else {
      return `From ${formatDateTime(event.startTime)} to ${formatDateTime(event.endTime)}`
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
            fontSize: '20px', 
            color: iconColor,
            ml: 1
          }} 
        />
      </Tooltip>
    )
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteEvent(event.id)
      setShowDeleteDialog(false)
      onClose()
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  const handleEditSubmit = async (eventData: any) => {
    setIsUpdating(true)
    try {
      await updateEvent(event.id, eventData)
      setShowEditForm(false)
      onClose()
    } catch (error) {
      console.error('Failed to update event:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditClose = () => {
    setShowEditForm(false)
  }

  const handleClose = () => {
    if (!isDeleting && !isUpdating) {
      onClose()
    }
  }

  return (
    <>
      <Dialog
        open={open && !showEditForm}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minHeight: '300px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                Event Details
              </Typography>
              {getOverlapIcon()}
            </Box>
            <IconButton
              onClick={handleClose}
              size="small"
              disabled={isDeleting}
              sx={{ color: 'text.secondary' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 1 }}>
            {/* Event Title */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: event.color || '#1976d2',
                    borderRadius: '50%',
                    mr: 1.5
                  }}
                />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
              </Box>
              
              {hasOverlaps && (
                <Chip
                  label={`Conflict (${overlapSeverity})`}
                  size="small"
                  color="error"
                  icon={<Warning />}
                  sx={{ mb: 1 }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Date and Time */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                When
              </Typography>
              <Typography variant="body1">
                {formatTimeRange()}
              </Typography>
            </Box>

            {/* Conflict Information */}
            {hasOverlaps && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'error.main' }}>
                  Schedule Conflict
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.main' }}>
                  {formatConflictMessage(overlappingEvents)}
                </Typography>
              </Box>
            )}

            {/* Description */}
            {event.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </Typography>
              </Box>
            )}

            {/* Event Type */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                Type
              </Typography>
              <Chip
                label={event.isAllDay ? 'All-day Event' : 'Timed Event'}
                size="small"
                sx={{
                  backgroundColor: event.color || '#1976d2',
                  color: 'white'
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={isDeleting}
            color="inherit"
          >
            Close
          </Button>
          <Button
            onClick={handleDelete}
            startIcon={<Delete />}
            color="error"
            variant="outlined"
            disabled={isDeleting}
          >
            Delete
          </Button>
          <Button
            onClick={handleEdit}
            startIcon={<Edit />}
            variant="contained"
            disabled={isDeleting}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Form Dialog */}
      <EventForm
        open={showEditForm}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        event={event}
        loading={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
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

export default EventDetailsDialog
