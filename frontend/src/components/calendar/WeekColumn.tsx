import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeekColumnProps } from '../../types/calendar';
import { formatWeekColumnHeader, isCurrentTimeSlot } from '../../utils/dateUtils';
import { WEEK_START_HOUR, WEEK_END_HOUR } from '../../utils/constants';
import { isToday, isSameDay } from 'date-fns';
import TimeSlot from './TimeSlot';

const WeekColumn: React.FC<WeekColumnProps> = ({
  date,
  events = [],
  selectedDate,
  onTimeSlotClick,
  allEvents = []
}) => {
  const isDateToday = isToday(date);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

  // Generate time slots for this day
  const timeSlots = [];
  for (let hour = WEEK_START_HOUR; hour <= WEEK_END_HOUR; hour++) {
    timeSlots.push(hour);
  }

  // Filter events for this specific date
  const dayEvents = events.filter(event => 
    isSameDay(event.startTime, date)
  );

  const handleTimeSlotClick = (clickedDate: Date, hour: number) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(clickedDate, hour);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
      {/* Day header */}
      <Box
        sx={{
          p: 1,
          borderBottom: '2px solid #e0e0e0',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: isSelected ? '#e3f2fd' : isDateToday ? '#f3e5f5' : '#fafafa',
          textAlign: 'center',
          minHeight: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
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

      {/* Time slots */}
      <Box sx={{ flex: 1 }}>
        {timeSlots.map((hour) => {
          // Get events for this specific hour
          const hourEvents = dayEvents.filter(event => {
            if (event.startTime) {
              return event.startTime.getHours() === hour;
            }
            return false;
          });

          return (
            <TimeSlot
              key={hour}
              hour={hour}
              date={date}
              events={hourEvents}
              isCurrentHour={isDateToday && isCurrentTimeSlot(hour)}
              onClick={handleTimeSlotClick}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekColumn;
