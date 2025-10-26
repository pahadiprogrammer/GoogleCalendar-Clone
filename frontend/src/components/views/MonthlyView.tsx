import React from 'react';
import { Box, Container } from '@mui/material';
import { useCalendar } from '../../contexts/CalendarContext';
import { useEvents } from '../../contexts/EventContext';
import CalendarGrid from '../calendar/CalendarGrid';

const MonthlyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar();
  const { getEventsForDate } = useEvents();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ width: '100%' }}>
        <CalendarGrid
          dates={[]} // Not used in current implementation
          currentMonth={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
        />
      </Box>
    </Container>
  );
};

export default MonthlyView;
