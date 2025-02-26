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

function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [selectedRewards, setSelectedRewards] = useState([]);

  const fetchRewards = async () => {
    const querySnapshot = await getDocs(collection(db, 'rewards'));
    const rewardsList = [];
    querySnapshot.forEach((docSnap) => {
      rewardsList.push({ id: docSnap.id, ...docSnap.data() });
    });
    setRewards(rewardsList);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleToggle = (id) => {
    setSelectedRewards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mark selected rewards as used.
  const handleMarkUsed = async () => {
    for (const id of selectedRewards) {
      try {
        await updateDoc(doc(db, 'rewards', id), { used: true });
      } catch (error) {
        console.error('Error marking reward as used:', error);
      }
    }
    setSelectedRewards([]);
    fetchRewards();
  };

  // Clear (delete) all used rewards.
  const handleClearUsedRewards = async () => {
    const usedRewards = rewards.filter((reward) => reward.used);
    if (usedRewards.length === 0) return;
    if (!window.confirm('Are you sure you want to clear all used rewards?')) return;
    for (const reward of usedRewards) {
      try {
        await deleteDoc(doc(db, 'rewards', reward.id));
      } catch (error) {
        console.error('Error deleting reward:', error);
      }
    }
    fetchRewards();
  };

  const unusedRewards = rewards.filter((reward) => !reward.used);
  const usedRewards = rewards.filter((reward) => reward.used);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Rewards</Typography>
      {unusedRewards.length === 0 ? (
        <Typography>No rewards available.</Typography>
      ) : (
        <List>
          {unusedRewards.map((reward) => (
            <div key={reward.id}>
              <ListItem>
                <Checkbox
                  edge="start"
                  checked={selectedRewards.includes(reward.id)}
                  onChange={() => handleToggle(reward.id)}
                />
                <ListItemText
                  primary={`Reward for ${reward.activity}`}
                  secondary={`Reward: ${reward.reward} (Points: ${reward.points}) at ${new Date(reward.timestamp).toLocaleString()}`}
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
          onClick={handleMarkUsed}
          disabled={selectedRewards.length === 0}
        >
          Used
        </Button>
      </Box>

      {/* Used Rewards Section Header with Clear Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h5">Used Rewards</Typography>
        <Button variant="contained" color="primary" onClick={handleClearUsedRewards}>
          Clear
        </Button>
      </Box>
      {usedRewards.length === 0 ? (
        <Typography>No rewards used yet.</Typography>
      ) : (
        <List>
          {usedRewards.map((reward) => (
            <div key={reward.id}>
              <ListItem sx={{ opacity: 0.5 }}>
                <ListItemText
                  primary={`Reward for ${reward.activity}`}
                  secondary={`Reward: ${reward.reward} (Points: ${reward.points}) at ${new Date(reward.timestamp).toLocaleString()}`}
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

export default RewardsPage;
