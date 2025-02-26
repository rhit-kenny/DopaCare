import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#800000' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          DopaCure
        </Typography>

        <Box sx={{ ml: 2 }}>
          <Button component={Link} to="/quotes" sx={{ color: 'inherit' }}>Quotes</Button>
          <Button component={Link} to="/add-activity" sx={{ color: 'inherit' }}>Add Activity</Button>
          <Button component={Link} to="/rewards" sx={{ color: 'inherit' }}>Rewards</Button>
          <Button component={Link} to="/penalties" sx={{ color: 'inherit' }}>Penalties</Button>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ marginLeft: 'auto', color: 'inherit' }}
        >
          Kenny
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
