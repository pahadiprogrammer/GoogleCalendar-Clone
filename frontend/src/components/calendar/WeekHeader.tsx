import React from 'react'
import { Box, Typography } from '@mui/material'
import { getWeekDays, formatWeekDay } from '../../utils/dateUtils'
import { WeekHeaderProps } from '../../types/calendar'

const WeekHeader: React.FC<WeekHeaderProps> = ({ showFullNames = false }) => {
  const weekDays = getWeekDays()

  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        mb: 1,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: '#fafafa'
      }}
    >
      {weekDays.map((day, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 1
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 'medium',
              textAlign: 'center'
            }}
          >
            {formatWeekDay(day, !showFullNames)}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default WeekHeader
