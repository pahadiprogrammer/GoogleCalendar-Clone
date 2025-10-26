import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup,
  IconButton,
  Button,
  Fab
} from '@mui/material'
import { 
  ChevronLeft, 
  ChevronRight, 
  Today,
  Add
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCalendar } from '../contexts/CalendarContext'
import { useEvents } from '../contexts/EventContext'
import MonthlyView from './views/MonthlyView'
import WeeklyView from './views/WeeklyView'
import DailyView from './views/DailyView'
import YearlyView from './views/YearlyView'
import { EventForm } from './events'

interface CalendarLayoutProps {
  view: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

const CalendarLayout: React.FC<CalendarLayoutProps> = ({ view }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    currentView, 
    setView, 
    getDisplayTitle, 
    goToNext, 
    goToPrevious, 
    goToToday,
    selectedDate
  } = useCalendar()
  const { addEvent } = useEvents()
  
  const [eventFormOpen, setEventFormOpen] = useState(false)

  // Sync the view with the context when route changes
  useEffect(() => {
    if (currentView !== view) {
      setView(view)
    }
  }, [view, currentView, setView])

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
    if (newView !== null) {
      navigate(`/${newView}`)
    }
  }

  const getCurrentView = () => {
    const path = location.pathname.substring(1)
    return path || 'monthly'
  }

  const handleCreateEvent = () => {
    setEventFormOpen(true)
  }

  const handleEventFormClose = () => {
    setEventFormOpen(false)
  }

  const handleEventSubmit = async (eventData: any) => {
    await addEvent(eventData)
    setEventFormOpen(false)
  }

  return (
    <Box>
      {/* Navigation Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Calendar
          </Typography>
          
          <ToggleButtonGroup
            value={getCurrentView()}
            exclusive
            onChange={handleViewChange}
            aria-label="calendar view"
          >
            <ToggleButton value="daily" aria-label="daily view">
              Day
            </ToggleButton>
            <ToggleButton value="weekly" aria-label="weekly view">
              Week
            </ToggleButton>
            <ToggleButton value="monthly" aria-label="monthly view">
              Month
            </ToggleButton>
            <ToggleButton value="yearly" aria-label="yearly view">
              Year
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Date Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={goToPrevious} aria-label="previous">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={goToNext} aria-label="next">
              <ChevronRight />
            </IconButton>
            <Button 
              variant="outlined" 
              startIcon={<Today />}
              onClick={goToToday}
              sx={{ ml: 2 }}
            >
              Today
            </Button>
          </Box>
          
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
            {getDisplayTitle()}
          </Typography>
        </Box>
      </Paper>

      {/* Calendar Content */}
      <Paper sx={{ p: 0, minHeight: '600px' }}>
        {view === 'monthly' ? (
          <MonthlyView />
        ) : view === 'weekly' ? (
          <WeeklyView />
        ) : view === 'daily' ? (
          <DailyView />
        ) : (
          <YearlyView />
        )}
      </Paper>

      {/* Floating Action Button for Creating Events */}
      <Fab
        color="primary"
        aria-label="add event"
        onClick={handleCreateEvent}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>

      {/* Event Form Dialog */}
      <EventForm
        open={eventFormOpen}
        onClose={handleEventFormClose}
        onSubmit={handleEventSubmit}
        initialDate={selectedDate || new Date()}
      />
    </Box>
  )
}

export default CalendarLayout
