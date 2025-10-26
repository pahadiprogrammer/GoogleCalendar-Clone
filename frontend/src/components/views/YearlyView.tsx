import React from 'react'
import { Container, Grid, Paper, Typography, Box } from '@mui/material'
import { useCalendar } from '../../contexts/CalendarContext'
import { 
  getMonthsInYear, 
  getDaysInMonth, 
  isDateToday, 
  isSameDate
} from '../../utils/dateUtils'
import { format } from 'date-fns'

const YearlyView: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate } = useCalendar()
  
  const months = getMonthsInYear(currentDate)
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }
  
  const renderMiniCalendar = (monthDate: Date) => {
    const monthDays = getDaysInMonth(monthDate)
    const monthName = format(monthDate, 'MMMM')
    
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 1, 
          height: '100%',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Month Header */}
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ 
            mb: 1, 
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          {monthName}
        </Typography>
        
        {/* Day Headers */}
        <Grid container spacing={0} sx={{ mb: 0.5 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Grid item xs={12/7} key={index}>
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  display: 'block',
                  fontSize: { xs: '0.6rem', sm: '0.7rem' },
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 0.5
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar Days */}
        <Grid container spacing={0} sx={{ flexGrow: 1 }}>
          {monthDays.map((date, index) => {
            const isToday = isDateToday(date)
            const isSelected = selectedDate && isSameDate(date, selectedDate)
            const isCurrentMonth = date.getMonth() === monthDate.getMonth()
            
            return (
              <Grid item xs={12/7} key={index}>
                <Box
                  onClick={() => handleDateClick(date)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: 20, sm: 24, md: 28 },
                    cursor: 'pointer',
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                    fontWeight: isToday ? 600 : 400,
                    color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                    backgroundColor: isToday ? 'primary.light' : 'transparent',
                    borderRadius: 1,
                    border: isSelected ? '2px solid' : 'none',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: isToday ? 'primary.main' : 'action.hover',
                      color: isToday ? 'primary.contrastText' : 'text.primary'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {date.getDate()}
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    )
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Year Header */}
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        {currentDate.getFullYear()}
      </Typography>
      
      {/* 12-Month Grid */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {months.map((monthDate, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={index}
          >
            {renderMiniCalendar(monthDate)}
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default YearlyView
