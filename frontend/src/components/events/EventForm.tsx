import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Divider
} from '@mui/material'
import { Warning, ErrorOutline } from '@mui/icons-material'
import { format, addHours, startOfHour } from 'date-fns'
import { CalendarEvent, EventFormData } from '../../types/calendar'
import { validateEventFormData, checkEventConflicts, formatConflictMessage } from '../../utils/eventUtils'
import { useEvents } from '../../contexts/EventContext'

interface EventFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (eventData: EventFormData) => Promise<void>
  event?: CalendarEvent | null
  initialDate?: Date
  initialTime?: number
  loading?: boolean
}

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onSubmit,
  event,
  initialDate,
  initialTime,
  loading = false
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startTime: new Date(),
    endTime: addHours(new Date(), 1),
    description: '',
    color: '#1976d2'
  })
  
  const [isAllDay, setIsAllDay] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [conflicts, setConflicts] = useState<{ hasConflicts: boolean; conflictingEvents: CalendarEvent[] }>({
    hasConflicts: false,
    conflictingEvents: []
  })

  // Get events from context for conflict detection
  const { events } = useEvents()

  // Color options for events
  const colorOptions = [
    { label: 'Blue', value: '#1976d2' },
    { label: 'Green', value: '#388e3c' },
    { label: 'Orange', value: '#f57c00' },
    { label: 'Purple', value: '#7b1fa2' },
    { label: 'Red', value: '#d32f2f' },
    { label: 'Teal', value: '#00796b' },
    { label: 'Pink', value: '#c2185b' },
    { label: 'Indigo', value: '#303f9f' }
  ]

  // Initialize form data when dialog opens or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        // Editing existing event
        setFormData({
          title: event.title,
          startTime: event.startTime || new Date(),
          endTime: event.endTime || addHours(new Date(), 1),
          description: event.description || '',
          color: event.color || '#1976d2'
        })
        setIsAllDay(event.isAllDay || false)
      } else {
        // Creating new event
        const now = new Date()
        let startTime = initialDate || now
        
        if (initialTime !== undefined) {
          // Set specific hour if provided
          startTime = new Date(startTime)
          startTime.setHours(initialTime, 0, 0, 0)
        } else {
          // Round to next hour
          startTime = startOfHour(addHours(startTime, 1))
        }
        
        const endTime = addHours(startTime, 1)
        
        setFormData({
          title: '',
          startTime,
          endTime,
          description: '',
          color: '#1976d2'
        })
        setIsAllDay(false)
      }
      setErrors([])
    }
  }, [open, event, initialDate, initialTime])

  // Function to check for event conflicts
  const checkForConflicts = (currentFormData: EventFormData) => {
    if (!currentFormData.title.trim()) {
      setConflicts({ hasConflicts: false, conflictingEvents: [] })
      return
    }

    // Filter out the current event if editing
    const otherEvents = event ? events.filter(e => e.id !== event.id) : events
    
    const conflictResult = checkEventConflicts(currentFormData, otherEvents)
    setConflicts(conflictResult)
  }

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    
    setFormData(newFormData)
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
    
    // Check for conflicts when time-related fields change
    if (field === 'startTime' || field === 'endTime') {
      checkForConflicts(newFormData)
    }
  }

  const handleStartTimeChange = (newStartTime: Date | null) => {
    if (newStartTime) {
      const startTime = new Date(newStartTime)
      let endTime = new Date(formData.endTime)
      
      // If end time is before or equal to start time, adjust it
      if (endTime <= startTime) {
        endTime = addHours(startTime, 1)
      }
      
      const newFormData = {
        ...formData,
        startTime,
        endTime
      }
      
      setFormData(newFormData)
      checkForConflicts(newFormData)
    }
  }

  const handleEndTimeChange = (newEndTime: Date | null) => {
    if (newEndTime) {
      const endTime = new Date(newEndTime)
      let startTime = new Date(formData.startTime)
      
      // If start time is after or equal to end time, adjust it
      if (startTime >= endTime) {
        startTime = addHours(endTime, -1)
      }
      
      const newFormData = {
        ...formData,
        startTime,
        endTime
      }
      
      setFormData(newFormData)
      checkForConflicts(newFormData)
    }
  }

  const handleAllDayToggle = (checked: boolean) => {
    setIsAllDay(checked)
    
    if (checked) {
      // Set to full day
      const startOfDay = new Date(formData.startTime)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(formData.startTime)
      endOfDay.setHours(23, 59, 59, 999)
      
      setFormData(prev => ({
        ...prev,
        startTime: startOfDay,
        endTime: endOfDay
      }))
    }
  }

  const handleSubmit = async () => {
    // Validate form data
    const validationErrors = validateEventFormData(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      setErrors(['Failed to save event. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
        <DialogTitle>
          <Typography variant="h6" component="div">
            {event ? 'Edit Event' : 'Create New Event'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}

            {conflicts.hasConflicts && (
              <Alert 
                severity="warning" 
                sx={{ mb: 2 }}
                icon={<Warning />}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Schedule Conflict Detected
                </Typography>
                <Typography variant="body2">
                  {formatConflictMessage(conflicts.conflictingEvents)}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                  You can still save this event, but please review the timing.
                </Typography>
              </Alert>
            )}

            <Grid container spacing={2}>
              {/* Event Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter event title..."
                />
              </Grid>

              {/* All Day Toggle */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAllDay}
                      onChange={(e) => handleAllDayToggle(e.target.checked)}
                      disabled={isSubmitting}
                    />
                  }
                  label="All day event"
                />
              </Grid>

              {/* Date/Time Pickers */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  type={isAllDay ? "date" : "datetime-local"}
                  value={isAllDay 
                    ? format(formData.startTime, 'yyyy-MM-dd')
                    : format(formData.startTime, "yyyy-MM-dd'T'HH:mm")
                  }
                  onChange={(e) => {
                    if (isAllDay) {
                      // For date-only inputs, create date at start of day
                      const dateValue = e.target.value + 'T00:00:00'
                      const newDate = new Date(dateValue)
                      if (!isNaN(newDate.getTime())) {
                        handleStartTimeChange(newDate)
                      }
                    } else {
                      // For datetime-local inputs, parse as local time to avoid timezone issues
                      const datetimeValue = e.target.value
                      if (datetimeValue) {
                        // Parse datetime-local as local time (no timezone conversion)
                        const [datePart, timePart] = datetimeValue.split('T')
                        const [year, month, day] = datePart.split('-').map(Number)
                        const [hour, minute] = timePart.split(':').map(Number)
                        
                        const newDate = new Date(year, month - 1, day, hour, minute, 0, 0)
                        if (!isNaN(newDate.getTime())) {
                          handleStartTimeChange(newDate)
                        }
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date & Time"
                  type={isAllDay ? "date" : "datetime-local"}
                  value={isAllDay 
                    ? format(formData.endTime, 'yyyy-MM-dd')
                    : format(formData.endTime, "yyyy-MM-dd'T'HH:mm")
                  }
                  onChange={(e) => {
                    if (isAllDay) {
                      // For date-only inputs, create date at end of day
                      const dateValue = e.target.value + 'T23:59:59'
                      const newDate = new Date(dateValue)
                      if (!isNaN(newDate.getTime())) {
                        handleEndTimeChange(newDate)
                      }
                    } else {
                      // For datetime-local inputs, parse as local time to avoid timezone issues
                      const datetimeValue = e.target.value
                      if (datetimeValue) {
                        // Parse datetime-local as local time (no timezone conversion)
                        const [datePart, timePart] = datetimeValue.split('T')
                        const [year, month, day] = datePart.split('-').map(Number)
                        const [hour, minute] = timePart.split(':').map(Number)
                        
                        const newDate = new Date(year, month - 1, day, hour, minute, 0, 0)
                        if (!isNaN(newDate.getTime())) {
                          handleEndTimeChange(newDate)
                        }
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Add event description (optional)..."
                />
              </Grid>

              {/* Color Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Event Color
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {colorOptions.map((color) => (
                    <Box
                      key={color.value}
                      onClick={() => !isSubmitting && handleInputChange('color', color.value)}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: color.value,
                        borderRadius: '50%',
                        cursor: isSubmitting ? 'default' : 'pointer',
                        border: formData.color === color.value ? '3px solid #000' : '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        '&:hover': !isSubmitting ? {
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                        } : {},
                        transition: 'all 0.2s ease-in-out'
                      }}
                      title={color.label}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !formData.title.trim()}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default EventForm
