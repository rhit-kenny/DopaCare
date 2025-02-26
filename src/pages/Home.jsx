import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import QuoteSection from '../components/QuoteSection';
import Gauge from '../components/Gauge';
import ActivityTree from '../components/ActivityTree';

function Home() {
  const [gaugeProgress, setGaugeProgress] = useState(() => {
    const saved = localStorage.getItem('gaugeProgress');
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('gaugeProgress', gaugeProgress);
  }, [gaugeProgress]);

  const updateGauge = (points) => {
    setGaugeProgress((prev) => {
      const newProgress = prev + points;
      return newProgress > 100 ? 100 : newProgress;
    });
  };

  const resetGauge = () => {
    if (window.confirm('Are you sure you want to reset the gauge?')) {
      setGaugeProgress(0);
    }
  };

  // Lifted state for ActivityTree's expand/collapse functionality.
  const [activityOpen, setActivityOpen] = useState({
    daily: true,
    weekly: true,
    monthly: true,
    yearly: true,
  });

  const expandAll = () => {
    setActivityOpen({ daily: true, weekly: true, monthly: true, yearly: true });
  };

  const collapseAll = () => {
    setActivityOpen({ daily: false, weekly: false, monthly: false, yearly: false });
  };

  return (
    <Container sx={{ pt: 4, pb: 4 }}>
      <QuoteSection />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: 40 }}>Road to Grand Prize</Typography>
        <Button variant="contained" onClick={resetGauge}>Reset</Button>
      </Box>

      <Gauge progress={gaugeProgress} />

      {/* Activity Cards Title with Expand/Collapse Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 10, mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: 40 }}>Activity Cards</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={expandAll}>Expand All</Button>
          <Button variant="contained" onClick={collapseAll}>Collapse All</Button>
        </Box>
      </Box>

      <ActivityTree updateGauge={updateGauge} open={activityOpen} setOpen={setActivityOpen} />
    </Container>
  );
}

export default Home;
