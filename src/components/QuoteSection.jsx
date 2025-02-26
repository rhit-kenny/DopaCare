import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function QuoteSection() {
  const [quote, setQuote] = useState('');

  const defaultQuotes = [
    "Stay motivated and keep curing your dopamine addiction!",
    "Small steps every day lead to big changes.",
    "Keep moving forward!",
    "A cold shower in the morning is a great way to start the day.",
  ];

  useEffect(() => {
    const fetchAndSelectQuote = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quotes'));
        const userQuotes = [];
        querySnapshot.forEach((doc) => {
          userQuotes.push(doc.data().text);
        });
        const allQuotes = [...defaultQuotes, ...userQuotes];
        if (allQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * allQuotes.length);
          setQuote(allQuotes[randomIndex]);
        } else {
          setQuote("Stay motivated and keep curing your dopamine addiction!");
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
        const randomIndex = Math.floor(Math.random() * defaultQuotes.length);
        setQuote(defaultQuotes[randomIndex]);
      }
    };

    fetchAndSelectQuote();
  }, []);

  return (
    <Box sx={{ my: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          fontFamily: '"Georgia", serif'
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontStyle: 'italic', fontSize: '1.5rem' }}
        >
          “{quote}”
        </Typography>
      </Paper>
    </Box>
  );
}

export default QuoteSection;
