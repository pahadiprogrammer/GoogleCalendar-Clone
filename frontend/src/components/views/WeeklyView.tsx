import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useCalendar } from '../../contexts/CalendarContext';
import { useEvents } from '../../contexts/EventContext';
import { getWeekDaysForDate, formatTimeSlot } from '../../utils/dateUtils';
import { WEEK_START_HOUR, WEEK_END_HOUR } from '../../utils/constants';
import WeekColumn from '../calendar/WeekColumn';

const WeeklyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar();
  const { getEventsForDate, events: allEvents } = useEvents();

  // Get the 7 days of the current week
  const weekDays = getWeekDaysForDate(currentDate);

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setSelectedDate(date);
    // TODO: In future, we can add time selection functionality
    console.log(`Selected: ${date.toDateString()} at ${hour}:00`);
  };

  // Generate time labels for the left column
  const timeLabels = [];
  for (let hour = WEEK_START_HOUR; hour <= WEEK_END_HOUR; hour++) {
    timeLabels.push(formatTimeSlot(hour));
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <Grid container spacing={0} sx={{ minWidth: 800 }}>
          {/* Time labels column */}
          <Grid item xs={12} sm={1.5} md={1.2} lg={1}>
            <Box sx={{ borderRight: '1px solid #e0e0e0', minHeight: '600px' }}>
              {/* Empty header space to align with day headers */}
              <Box sx={{ height: 50, borderBottom: '2px solid #e0e0e0' }} />
              
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

          {/* Week columns */}
          {weekDays.map((date, index) => (
            <Grid item xs={12/7} sm={(12-1.5)/7} md={(12-1.2)/7} lg={(12-1)/7} key={index}>
              <WeekColumn
                date={date}
                events={getEventsForDate(date)}
                selectedDate={selectedDate}
                onTimeSlotClick={handleTimeSlotClick}
                allEvents={allEvents}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default WeeklyView;
