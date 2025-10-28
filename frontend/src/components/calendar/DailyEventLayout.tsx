import React from 'react';
import { Box } from '@mui/material';
import { CalendarEvent } from '../../types/calendar';
import { WEEK_START_HOUR, WEEK_END_HOUR, TIME_SLOT_HEIGHT } from '../../utils/constants';
import EventDisplay from '../events/EventDisplay';

interface DailyEventLayoutProps {
  date: Date;
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

interface EventPosition {
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
  isOverlapping: boolean;
}

const PIXELS_PER_MINUTE = TIME_SLOT_HEIGHT / 60; // 60px per hour = 1px per minute
const TOTAL_HOURS = WEEK_END_HOUR - WEEK_START_HOUR + 1;
const TOTAL_HEIGHT = TOTAL_HOURS * TIME_SLOT_HEIGHT;

const DailyEventLayout: React.FC<DailyEventLayoutProps> = ({
  date,
  events,
  allEvents,
  onEventClick
}) => {
  // Calculate event positions with overlap handling for daily view
  const calculateEventPositions = (): Map<string, EventPosition> => {
    const positions = new Map<string, EventPosition>();
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.getTime() - b.startTime.getTime();
    });

    // Track columns for overlapping events
    const columns: { event: CalendarEvent; endTime: number }[] = [];

    sortedEvents.forEach((event) => {
      if (!event.startTime || !event.endTime) return;

      const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes();
      const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes();
      
      // Skip events outside our time range
      const dayStartMinutes = WEEK_START_HOUR * 60;
      const dayEndMinutes = (WEEK_END_HOUR + 1) * 60;
      
      if (endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) return;

      // Clamp to visible time range
      const clampedStartMinutes = Math.max(startMinutes, dayStartMinutes);
      const clampedEndMinutes = Math.min(endMinutes, dayEndMinutes);
      
      const top = (clampedStartMinutes - dayStartMinutes) * PIXELS_PER_MINUTE;
      const height = (clampedEndMinutes - clampedStartMinutes) * PIXELS_PER_MINUTE;

      // Find available column (handle overlaps) - FIXED: Safe column cleanup
      const eventStartTime = event.startTime.getTime();
      
      // Remove expired columns safely - filter instead of splice during iteration
      const activeColumns = columns.filter(col => col.endTime > eventStartTime);
      columns.length = 0; // Clear array
      columns.push(...activeColumns); // Repopulate with active columns

      // Find first available column
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        if (columns[columnIndex].endTime <= eventStartTime) {
          break;
        }
        columnIndex++;
      }

      // Add event to column
      if (columnIndex < columns.length) {
        columns[columnIndex] = { event, endTime: event.endTime.getTime() };
      } else {
        columns.push({ event, endTime: event.endTime.getTime() });
      }

      const totalColumns = Math.max(columns.length, 1);
      const width = (100 / totalColumns) - 2; // Leave 2% gap between columns for better separation
      const left = (columnIndex * (100 / totalColumns)) + 1; // Add 1% left margin

      positions.set(event.id, {
        top,
        height: Math.max(height, 8), // Reduced minimum height for better proportional sizing
        left,
        width,
        zIndex: 10 + columnIndex,
        isOverlapping: totalColumns > 1 // Event is overlapping if there are multiple columns
      });
    });

    return positions;
  };

  const eventPositions = calculateEventPositions();

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: TOTAL_HEIGHT,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {events.map((event) => {
        const position = eventPositions.get(event.id);
        if (!position) return null;

        return (
          <Box
            key={event.id}
            sx={{
              position: 'absolute',
              top: position.top,
              left: `${position.left}%`,
              width: `${position.width}%`,
              height: position.height,
              zIndex: position.zIndex,
              pr: 0.5 // Small right padding to prevent overlap
            }}
          >
            <Box 
              sx={{ 
                pointerEvents: 'auto',
                height: '100%', // Ensure child respects parent height
                overflow: 'hidden', // Prevent content from expanding beyond calculated height
                border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border for better separation
                borderRadius: '6px',
                backgroundColor: 'transparent'
              }}
            >
              <EventDisplay
                event={event}
                variant="daily"
                allEvents={allEvents}
                showOverlapIndicator={true}
                onClick={handleEventClick}
                maxWidth="100%"
                isOverlapping={position.isOverlapping}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DailyEventLayout;
