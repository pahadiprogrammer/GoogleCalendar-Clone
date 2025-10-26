import React from 'react';
import { Grid, Box } from '@mui/material';
import { CalendarGridProps } from '../../types/calendar';
import { getMonthCalendarDays } from '../../utils/dateUtils';
import { isToday, isSameDay, isSameMonth } from 'date-fns';
import { useEvents } from '../../contexts/EventContext';
import WeekHeader from './WeekHeader';
import DateCell from './DateCell';

const CalendarGrid: React.FC<CalendarGridProps> = ({
  dates,
  currentMonth,
  selectedDate,
  onDateClick
}) => {
  const calendarDays = getMonthCalendarDays(currentMonth);
  const { getEventsForDate, events: allEvents } = useEvents();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Week header */}
      <WeekHeader />
      
      {/* Calendar grid */}
      <Grid container spacing={0} sx={{ mt: 1 }}>
        {calendarDays.map((date, index) => {
          const isCurrentMonthDate = isSameMonth(date, currentMonth);
          const isTodayDate = isToday(date);
          const isSelectedDate = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <Grid item xs={12/7} key={index}>
              <DateCell
                date={date}
                isCurrentMonth={isCurrentMonthDate}
                isToday={isTodayDate}
                isSelected={isSelectedDate}
                events={getEventsForDate(date)}
                onClick={onDateClick}
                allEvents={allEvents}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarGrid;
