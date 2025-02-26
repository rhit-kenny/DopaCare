import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Checkbox,
  Button,
} from '@mui/material';

function PenaltiesPage() {
  const [penalties, setPenalties] = useState([]);
  const [selectedPenalties, setSelectedPenalties] = useState([]);

  const fetchPenalties = async () => {
    const querySnapshot = await getDocs(collection(db, 'penalties'));
    const penaltiesList = [];
    querySnapshot.forEach((docSnap) => {
      penaltiesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    setPenalties(penaltiesList);
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const handleToggle = (id) => {
    setSelectedPenalties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkDone = async () => {
    for (const id of selectedPenalties) {
      try {
        await updateDoc(doc(db, 'penalties', id), { done: true });
      } catch (error) {
        console.error('Error marking penalty as done:', error);
      }
    }
    setSelectedPenalties([]);
    fetchPenalties();
  };

  const handleClearDonePenalties = async () => {
    const donePenalties = penalties.filter((penalty) => penalty.done);
    if (donePenalties.length === 0) return;
    if (!window.confirm('Are you sure you want to clear all done penalties?')) return;
    for (const penalty of donePenalties) {
      try {
        await deleteDoc(doc(db, 'penalties', penalty.id));
      } catch (error) {
        console.error('Error deleting penalty:', error);
      }
    }
    fetchPenalties();
  };

  const activePenalties = penalties.filter((penalty) => !penalty.done);
  const donePenalties = penalties.filter((penalty) => penalty.done);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Penalties</Typography>
      {activePenalties.length === 0 ? (
        <Typography>No penalties available.</Typography>
      ) : (
        <List>
          {activePenalties.map((penalty) => (
            <div key={penalty.id}>
              <ListItem>
                <Checkbox
                  edge="start"
                  checked={selectedPenalties.includes(penalty.id)}
                  onChange={() => handleToggle(penalty.id)}
                />
                <ListItemText
                  primary={`Penalty for ${penalty.activity}`}
                  secondary={`Punishment: ${penalty.punishment} at ${new Date(penalty.timestamp).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleMarkDone}
          disabled={selectedPenalties.length === 0}
        >
          Done
        </Button>
      </Box>

      {/* Done Penalties Section Header with Clear Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h5">Done Penalties</Typography>
        <Button variant="contained" color="primary" onClick={handleClearDonePenalties}>
          Clear
        </Button>
      </Box>
      {donePenalties.length === 0 ? (
        <Typography>No penalties done yet.</Typography>
      ) : (
        <List>
          {donePenalties.map((penalty) => (
            <div key={penalty.id}>
              <ListItem sx={{ opacity: 0.5 }}>
                <ListItemText
                  primary={`Penalty for ${penalty.activity}`}
                  secondary={`Punishment: ${penalty.punishment} at ${new Date(penalty.timestamp).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </Box>
  );
}

export default PenaltiesPage;
