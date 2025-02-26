import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

function Gauge({ progress }) {
  return (
    <Box className="my-4">
      <Typography variant="h6" gutterBottom>
        Progress: {progress}%
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
      {progress >= 100 && (
        <Typography variant="body1" color="primary">
          Congratulations! You achieved the grand prize!
        </Typography>
      )}
    </Box>
  );
}

export default Gauge;
