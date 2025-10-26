import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DateCellProps } from '../../types/calendar';
import { EventDisplay } from '../events';

const DateCell: React.FC<DateCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  events = [],
  onClick,
  allEvents = []
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(date);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: 120,
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        backgroundColor: isToday ? '#e3f2fd' : isCurrentMonth ? '#fff' : '#f5f5f5',
        '&:hover': {
          backgroundColor: isToday ? '#bbdefb' : isCurrentMonth ? '#f5f5f5' : '#eeeeee',
        },
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      <Box sx={{ p: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 'bold' : 'normal',
            color: isCurrentMonth ? (isToday ? '#1976d2' : '#000') : '#999',
            mb: 0.5
          }}
        >
          {date.getDate()}
        </Typography>
        
        {/* Events display */}
        <Box sx={{ mt: 0.5, maxHeight: '80px', overflow: 'hidden' }}>
          {events.slice(0, 3).map((event) => (
            <EventDisplay
              key={event.id}
              event={event}
              variant="minimal"
              maxWidth="100%"
              allEvents={allEvents}
              showOverlapIndicator={true}
            />
          ))}
          
          {events.length > 3 && (
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontSize: '0.6rem',
                display: 'block',
                textAlign: 'center',
                mt: 0.5
              }}
            >
              +{events.length - 3} more
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DateCell;
