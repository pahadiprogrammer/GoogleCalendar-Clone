import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useCalendar } from '../../contexts/CalendarContext';
import { useEvents } from '../../contexts/EventContext';
import { CalendarEvent } from '../../types/calendar';
import CalendarGrid from '../calendar/CalendarGrid';
import EventDetailsDialog from '../events/EventDetailsDialog';

const MonthlyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar();
  const { getEventsForDate, events: allEvents } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ width: '100%' }}>
        <CalendarGrid
          dates={[]} // Not used in current implementation
          currentMonth={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </Box>

      <EventDetailsDialog
        open={showEventDetails}
        onClose={handleCloseEventDetails}
        event={selectedEvent}
        allEvents={allEvents}
      />
    </Container>
  );
};

export default MonthlyView;
