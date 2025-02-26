import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function CalendarModal({ open, onClose, completionDates = {} }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth(); 

  const formatDate = (date) => date.toISOString().split('T')[0];

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handlePrevYear = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };
  const handleNextYear = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={handlePrevYear}>
            <FastRewindIcon />
          </IconButton>
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6">
            {selectedDate.toLocaleString('default', { month: 'long' })} {selectedYear}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton onClick={handleNextYear}>
            <FastForwardIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid2 container spacing={2}>
            {daysArray.map((day) => {
              const dateObj = new Date(selectedYear, selectedMonth, day);
              const dateStr = formatDate(dateObj);
              const status = completionDates[dateStr] || null; // ensure status is null if not defined
              return (
                <Grid2 xs={2} key={day} sx={{ textAlign: 'center' }}>
                  {status === "complete" ? (
                    <IconButton size="small" disabled>
                      <CheckIcon color="primary" />
                    </IconButton>
                  ) : status === "incomplete" ? (
                    <IconButton size="small" disabled>
                      <CloseIcon color="error" />
                    </IconButton>
                  ) : (
                    <Typography variant="body2">{day}</Typography>
                  )}
                </Grid2>
              );
            })}
          </Grid2>
        </DialogContent>
      </Box>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CalendarModal;
