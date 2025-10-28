import React, { useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useCalendar } from '../../contexts/CalendarContext';
import { useEvents } from '../../contexts/EventContext';
import { CalendarEvent } from '../../types/calendar';
import { formatTimeSlot } from '../../utils/dateUtils';
import { WEEK_START_HOUR, WEEK_END_HOUR, TIME_SLOT_HEIGHT } from '../../utils/constants';
import { format, isToday } from 'date-fns';
import DailyEventLayout from '../calendar/DailyEventLayout';
import EventDetailsDialog from '../events/EventDetailsDialog';

const DailyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar();
  const { getEventsForDate, events: allEvents } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setSelectedDate(date);
    // TODO: In future, we can add time selection functionality
    console.log(`Selected: ${date.toDateString()} at ${hour}:00`);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Generate time labels for the left column
  const timeLabels = [];
  for (let hour = WEEK_START_HOUR; hour <= WEEK_END_HOUR; hour++) {
    timeLabels.push(formatTimeSlot(hour));
  }

  const dayHeader = format(currentDate, 'EEEE, MMMM d'); // e.g., "Sunday, October 26"
  const isTodayDate = isToday(currentDate);

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <Grid container spacing={0} sx={{ minWidth: 600 }}>
          {/* Time labels column */}
          <Grid item xs={12} sm={2} md={1.5}>
            <Box sx={{ borderRight: '1px solid #e0e0e0', minHeight: '600px' }}>
              {/* Day header space */}
              <Box 
                sx={{ 
                  height: 60, 
                  borderBottom: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    textAlign: 'center',
                    fontWeight: 500
                  }}
                >
                  Time
                </Typography>
              </Box>
              
              {/* Time labels */}
              {timeLabels.map((timeLabel, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 60, // Same as TIME_SLOT_HEIGHT
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    px: { xs: 0.5, sm: 1 }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#666',
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      textAlign: 'center'
                    }}
                  >
                    {timeLabel}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Day column */}
          <Grid item xs={12} sm={10} md={10.5}>
            <Box sx={{ minHeight: '600px' }}>
              {/* Day header */}
              <Box
                sx={{
                  height: 60,
                  borderBottom: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isTodayDate ? '#e3f2fd' : 'transparent',
                  px: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: isTodayDate ? '#1976d2' : '#333',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {dayHeader}
                </Typography>
              </Box>

              {/* Time grid background with precise event positioning */}
              <Box sx={{ position: 'relative' }}>
                {/* Hour grid lines */}
                {Array.from({ length: WEEK_END_HOUR - WEEK_START_HOUR + 1 }, (_, index) => {
                  const hour = WEEK_START_HOUR + index;
                  const isCurrentHour = isTodayDate && new Date().getHours() === hour;
                  
                  return (
                    <Box
                      key={hour}
                      sx={{
                        height: TIME_SLOT_HEIGHT,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: isCurrentHour ? '#fff3e0' : 'transparent',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: isCurrentHour ? '#ffe0b2' : '#f5f5f5'
                        }
                      }}
                      onClick={() => handleTimeSlotClick(currentDate, hour)}
                    />
                  );
                })}

                {/* Precise event positioning overlay - positioned absolutely to align with time grid */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    pointerEvents: 'none' // Allow clicks to pass through to time slots
                  }}
                >
                  <DailyEventLayout
                    date={currentDate}
                    events={getEventsForDate(currentDate)}
                    allEvents={allEvents}
                    onEventClick={handleEventClick}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={showEventDetails}
        event={selectedEvent}
        onClose={handleCloseEventDetails}
      />
    </Container>
  );
};

export default DailyView;
