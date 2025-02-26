import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function CustomizationPage() {
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Username');
  const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') || '#800000');

  const colorOptions = [
    "#800000", // Rose Red
    "#EFC3CA", // Light Pink
    "#060270", // Indigo
    "#008000", // Green
    "#FFA500", // Orange
    "#800080", // Purple
    "#000000", // Black
    "#FFD700", // Gold
  ];

  const handleSave = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('themeColor', themeColor);
    alert('Settings saved. Please refresh the page to see theme changes.');
  };

  const resetCollection = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = [];
    querySnapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(doc(db, collectionName, docSnap.id)));
    });
    await Promise.all(deletePromises);
  };

  const handleResetEverything = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset everything? This will reset your username, custom color, gauge, and clear all activities, quotes, rewards, and penalties.'
    );
    if (!confirmReset) return;
    try {
      const collectionsToReset = ['activities', 'quotes', 'rewards', 'penalties'];
      for (const col of collectionsToReset) {
        await resetCollection(col);
      }
      localStorage.removeItem('username');
      localStorage.removeItem('themeColor');
      localStorage.setItem('gaugeProgress', '0');  
      setUsername('Username');
      setThemeColor('#800000');
      alert('Everything has been reset. Please refresh the page.');
    } catch (error) {
      console.error('Error resetting everything:', error);
      alert('Failed to reset everything.');
    }
  };

  return (
    <Container sx={{ pt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Customization
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <Typography variant="subtitle1">Choose Theme Color:</Typography>
        <Grid container spacing={1}>
          {colorOptions.map((color) => (
            <Grid item xs={3} key={color}>
              <Paper
                onClick={() => setThemeColor(color)}
                sx={{
                  backgroundColor: color,
                  height: 40,
                  cursor: 'pointer',
                  border: themeColor === color ? '3px solid #000' : '1px solid #ccc',
                }}
              />
            </Grid>
          ))}
        </Grid>
        <TextField
          label="Theme Color (Hex)"
          value={themeColor}
          onChange={(e) => setThemeColor(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
        <Button variant="outlined" color="error" onClick={handleResetEverything}>
          Reset Everything
        </Button>
      </Box>
    </Container>
  );
}

export default CustomizationPage;
