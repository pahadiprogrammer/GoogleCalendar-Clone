import React, { useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useCalendar } from '../../contexts/CalendarContext';
import { useEvents } from '../../contexts/EventContext';
import { CalendarEvent } from '../../types/calendar';
import { getWeekDaysForDate, formatTimeSlot, formatWeekColumnHeader, isCurrentTimeSlot } from '../../utils/dateUtils';
import { WEEK_START_HOUR, WEEK_END_HOUR, TIME_SLOT_HEIGHT } from '../../utils/constants';
import { isToday, isSameDay } from 'date-fns';
import WeekEventLayout from '../calendar/WeekEventLayout';
import EventDetailsDialog from '../events/EventDetailsDialog';

const WeeklyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar();
  const { getEventsForDate, events: allEvents } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Get the 7 days of the current week
  const weekDays = getWeekDaysForDate(currentDate);

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

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ width: '100%', overflow: 'auto', minWidth: 800 }}>
        {/* CSS Grid Layout for Perfect Alignment */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto repeat(7, 1fr)', // Time column + 7 day columns
            gridTemplateRows: 'auto 1fr', // Header row + content area
            minHeight: '600px'
          }}
        >
          {/* Time Labels Header - Grid Cell (1,1) */}
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 1,
              borderBottom: '2px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              minWidth: 80,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 72 // Match the height of day headers with two Typography elements
            }}
          >
            {/* Match the structure of day headers for consistent height */}
            <Typography
              variant="caption"
              sx={{
                color: 'transparent', // Invisible but takes up space
                fontSize: '0.7rem'
              }}
            >
              Time
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'transparent', // Invisible but takes up space
                fontSize: '1.1rem'
              }}
            >
              &nbsp;
            </Typography>
          </Box>

          {/* Day Headers - Grid Cells (2-8, 1) */}
          {weekDays.map((date, index) => {
            const isDateToday = isToday(date);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            
            return (
              <Box
                key={index}
                sx={{
                  gridColumn: index + 2,
                  gridRow: 1,
                  p: 1,
                  borderBottom: '2px solid #e0e0e0',
                  borderRight: '1px solid #e0e0e0',
                  backgroundColor: isSelected ? '#e3f2fd' : isDateToday ? '#f3e5f5' : '#fafafa',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minWidth: 120
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isDateToday ? '#1976d2' : '#666',
                    fontWeight: isDateToday ? 'bold' : 'normal',
                    fontSize: '0.7rem'
                  }}
                >
                  {formatWeekColumnHeader(date).split(' ')[0]}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: isDateToday ? '#1976d2' : '#000',
                    fontWeight: isDateToday ? 'bold' : 'normal',
                    fontSize: '1.1rem'
                  }}
                >
                  {formatWeekColumnHeader(date).split(' ')[1]}
                </Typography>
              </Box>
            );
          })}

          {/* Time Labels Column - Grid Cell (1,2) */}
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {timeLabels.map((timeLabel, index) => (
              <Box
                key={index}
                sx={{
                  height: TIME_SLOT_HEIGHT,
                  borderBottom: '1px solid #e0e0e0',
                  borderRight: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

          {/* Week Columns Content - Grid Cells (2-8, 2) */}
          {weekDays.map((date, index) => (
            <Box
              key={index}
              sx={{
                gridColumn: index + 2,
                gridRow: 2,
                position: 'relative'
              }}
            >
              {/* Time slots for clicking and visual grid */}
              {Array.from({ length: WEEK_END_HOUR - WEEK_START_HOUR + 1 }, (_, i) => {
                const hour = WEEK_START_HOUR + i;
                const isDateToday = isToday(date);
                const isCurrentHour = isDateToday && isCurrentTimeSlot(hour);
                
                return (
                  <Box
                    key={hour}
                    sx={{
                      height: TIME_SLOT_HEIGHT,
                      borderBottom: '1px solid #e0e0e0',
                      borderRight: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      backgroundColor: isCurrentHour ? '#fff3e0' : 'transparent',
                      '&:hover': {
                        backgroundColor: isCurrentHour ? '#ffe0b2' : '#f5f5f5',
                      }
                    }}
                    onClick={() => handleTimeSlotClick(date, hour)}
                  >
                    {isCurrentHour && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: '#f44336',
                          zIndex: 2
                        }}
                      />
                    )}
                  </Box>
                );
              })}
              
              {/* Events overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none'
                }}
              >
                <WeekEventLayout
                  date={date}
                  events={getEventsForDate(date)}
                  allEvents={allEvents}
                  onEventClick={handleEventClick}
                />
              </Box>
            </Box>
          ))}
        </Box>
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

export default WeeklyView;
