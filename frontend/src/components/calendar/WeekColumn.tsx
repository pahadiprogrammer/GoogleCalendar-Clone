import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeekColumnProps } from '../../types/calendar';
import { formatWeekColumnHeader, isCurrentTimeSlot } from '../../utils/dateUtils';
import { WEEK_START_HOUR, WEEK_END_HOUR } from '../../utils/constants';
import { isToday, isSameDay } from 'date-fns';
import TimeSlot from './TimeSlot';
import WeekEventLayout from './WeekEventLayout';

const WeekColumn: React.FC<WeekColumnProps> = ({
  date,
  events = [],
  selectedDate,
  onTimeSlotClick,
  onEventClick,
  allEvents = []
}) => {
  const isDateToday = isToday(date);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

  // Generate time slots for this day
  const timeSlots = [];
  for (let hour = WEEK_START_HOUR; hour <= WEEK_END_HOUR; hour++) {
    timeSlots.push(hour);
  }

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

      {/* Time slots and events container */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {/* Background time slots (for clicking and visual grid) */}
        {timeSlots.map((hour) => (
          <TimeSlot
            key={hour}
            hour={hour}
            date={date}
            events={[]} // No events in time slots anymore
            allEvents={allEvents}
            isCurrentHour={isDateToday && isCurrentTimeSlot(hour)}
            onClick={handleTimeSlotClick}
            onEventClick={onEventClick}
          />
        ))}
        
        {/* Absolute positioned events overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none' // Allow clicks to pass through to time slots
          }}
        >
          <WeekEventLayout
            date={date}
            events={events}
            allEvents={allEvents}
            onEventClick={onEventClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WeekColumn;
