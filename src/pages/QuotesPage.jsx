// src/pages/QuotesPage.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const querySnapshot = await getDocs(collection(db, 'quotes'));
    const quotesList = [];
    querySnapshot.forEach((docSnap) => {
      quotesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    setQuotes(quotesList);
  };

  const handleAddQuote = async () => {
    if (newQuote.trim() === '') return;
    await addDoc(collection(db, 'quotes'), { text: newQuote });
    setNewQuote('');
    fetchQuotes();
  };

  const handleDeleteQuote = async (id) => {
    await deleteDoc(doc(db, 'quotes', id));
    fetchQuotes();
  };

  const handleEditQuote = async () => {
    if (editingText.trim() === '') return;
    const quoteRef = doc(db, 'quotes', editingId);
    await updateDoc(quoteRef, { text: editingText });
    setEditingId(null);
    setEditingText('');
    fetchQuotes();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Quotes
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="New Quote"
          variant="outlined"
          fullWidth
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddQuote}>
          Add
        </Button>
      </Box>
      <List>
        {quotes.map((quote) => (
          <ListItem key={quote.id} sx={{ borderBottom: '1px solid #ccc' }}>
            {editingId === quote.id ? (
              <>
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  fullWidth
                />
                <Button onClick={handleEditQuote}>Save</Button>
              </>
            ) : (
              <>
                <ListItemText primary={quote.text} />
                <IconButton onClick={() => { setEditingId(quote.id); setEditingText(quote.text); }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteQuote(quote.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default QuotesPage;
