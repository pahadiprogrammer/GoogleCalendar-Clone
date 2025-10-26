import React from 'react';
import { Box, Typography } from '@mui/material';
import { TimeSlotProps } from '../../types/calendar';
import { formatTimeSlot } from '../../utils/dateUtils';
import { TIME_SLOT_HEIGHT } from '../../utils/constants';
import EventDisplay from '../events/EventDisplay';

const TimeSlot: React.FC<TimeSlotProps> = ({
  hour,
  date,
  events = [],
  allEvents = [],
  isCurrentHour = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(date, hour);
    }
  };

  return (
    <Box
      sx={{
        height: TIME_SLOT_HEIGHT,
        borderBottom: '1px solid #e0e0e0',
        borderRight: '1px solid #e0e0e0',
        cursor: 'pointer',
        backgroundColor: isCurrentHour ? '#fff3e0' : 'transparent',
        position: 'relative',
        '&:hover': {
          backgroundColor: isCurrentHour ? '#ffe0b2' : '#f5f5f5',
        },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      {/* Current hour indicator */}
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

      {/* Events display */}
      <Box sx={{ flex: 1, p: 0.5 }}>
        {events.slice(0, 2).map((event, index) => (
          <EventDisplay
            key={event.id}
            event={event}
            variant="minimal"
            allEvents={allEvents}
            showOverlapIndicator={true}
            maxWidth="100%"
          />
        ))}
        
        {events.length > 2 && (
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              fontSize: '0.6rem'
            }}
          >
            +{events.length - 2} more
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TimeSlot;
