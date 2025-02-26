import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function AddActivityPage() {
  const [activityData, setActivityData] = useState({
    activity: '',
    reward: '',
    punishment: '',
    frequency: 'daily',
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const NEW_CATEGORY_OPTION = 'new';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const cats = [];
        querySnapshot.forEach((doc) => {
          cats.push({ id: doc.id, name: doc.data().name });
        });
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setActivityData({ ...activityData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !activityData.activity.trim() ||
      !activityData.reward.trim() ||
      !activityData.punishment.trim() ||
      !activityData.frequency.trim() ||
      !selectedCategory.trim()
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    let finalCategory = selectedCategory;
    if (selectedCategory === NEW_CATEGORY_OPTION) {
      if (!newCategory.trim()) {
        alert("Please enter a new category name.");
        return;
      }
      finalCategory = newCategory.trim();
      try {
        await addDoc(collection(db, 'categories'), { name: finalCategory });
        setCategories((prev) => [...prev, { id: 'newlyAdded', name: finalCategory }]);
      } catch (error) {
        console.error("Error adding new category:", error);
      }
    }

    try {
      await addDoc(collection(db, 'activities'), {
        ...activityData,
        category: finalCategory
      });
      alert('Activity added!');
      setActivityData({ activity: '', reward: '', punishment: '', frequency: 'daily' });
      setSelectedCategory('');
      setNewCategory('');
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Add Activity
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Activity"
          name="activity"
          fullWidth
          value={activityData.activity}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
            <MenuItem value={NEW_CATEGORY_OPTION}>Add New Category</MenuItem>
          </Select>
        </FormControl>
        {selectedCategory === NEW_CATEGORY_OPTION && (
          <TextField
            label="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            required
          />
        )}
        <TextField
          label="Reward"
          name="reward"
          fullWidth
          value={activityData.reward}
          onChange={handleChange}
          required
        />
        <TextField
          label="Punishment"
          name="punishment"
          fullWidth
          value={activityData.punishment}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth required>
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            name="frequency"
            value={activityData.frequency}
            label="Frequency"
            onChange={handleChange}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" type="submit" fullWidth>
          Add Activity
        </Button>
      </form>
    </Box>
  );
}

export default AddActivityPage;
