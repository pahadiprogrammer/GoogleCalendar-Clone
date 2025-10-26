import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import { CalendarProvider } from './contexts/CalendarContext'
import { EventProvider } from './contexts/EventContext'
import CalendarLayout from './components/CalendarLayout'

function App() {
  return (
    <EventProvider>
      <CalendarProvider>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Google Calendar Clone
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/monthly" replace />} />
              <Route path="/daily" element={<CalendarLayout view="daily" />} />
              <Route path="/weekly" element={<CalendarLayout view="weekly" />} />
              <Route path="/monthly" element={<CalendarLayout view="monthly" />} />
              <Route path="/yearly" element={<CalendarLayout view="yearly" />} />
            </Routes>
          </Container>
        </Box>
      </CalendarProvider>
    </EventProvider>
  )
}

export default App
