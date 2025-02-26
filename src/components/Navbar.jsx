import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

function Navbar({ username }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        {/* Left: App Name */}
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
          DopaCure
        </Typography>
        {/* Navigation Buttons */}
        <Box sx={{ ml: 2 }}>
          <Button component={Link} to="/quotes" sx={{ color: 'inherit' }}>Quotes</Button>
          <Button component={Link} to="/rewards" sx={{ color: 'inherit' }}>Rewards</Button>
          <Button component={Link} to="/penalties" sx={{ color: 'inherit' }}>Penalties</Button>
          <Button component={Link} to="/add-activity" sx={{ color: 'inherit' }}>Add Activity</Button>
        </Box>
        {/* Right: Username and Settings */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
            {username}
          </Typography>
          <IconButton component={Link} to="/customization" sx={{ color: 'inherit' }}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
