import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Collapse, Divider } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActivityCard from './ActivityCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ActivityTree({ updateGauge, open, setOpen }) {
  const [activities, setActivities] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState({ all: false });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    const acts = [];
    querySnapshot.forEach((docSnap) => {
      acts.push({ id: docSnap.id, ...docSnap.data() });
    });
    setActivities(acts);
  };

  const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
  const frequencyGroups = activities.reduce((acc, activity) => {
    if (!acc[activity.frequency]) {
      acc[activity.frequency] = [];
    }
    acc[activity.frequency].push(activity);
    return acc;
  }, {});

  const categoryGroups = activities.reduce((acc, activity) => {
    const cat = activity.category || "Uncategorized";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(activity);
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setCategoryOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <List>
      {frequencies.map((freq) => (
        <div key={freq}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen((prev) => ({ ...prev, [freq]: !prev[freq] }))}>
              <ListItemText primary={freq.charAt(0).toUpperCase() + freq.slice(1)} />
              {open[freq] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={open[freq]} timeout="auto" unmountOnExit>
            {frequencyGroups[freq] &&
              frequencyGroups[freq].map((activity) => (
                <div key={activity.id}>
                  <ActivityCard
                    activity={activity}
                    refreshActivities={fetchActivities}
                    updateGauge={updateGauge}
                  />
                  <Divider />
                </div>
              ))}
          </Collapse>
        </div>
      ))}

      <div>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setCategoryOpen((prev) => ({ ...prev, all: !prev.all }))}>
            <ListItemText primary="Categories" />
            {categoryOpen.all ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse in={categoryOpen.all} timeout="auto" unmountOnExit>
          {Object.keys(categoryGroups)
            .sort()
            .map((cat) => (
              <div key={cat}>
                <ListItem disablePadding sx={{ pl: 4 }}>
                  <ListItemButton onClick={() => toggleCategory(cat)}>
                    <ListItemText primary={cat} />
                    {categoryOpen[cat] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={categoryOpen[cat]} timeout="auto" unmountOnExit>
                  {categoryGroups[cat].map((activity) => (
                    <div key={activity.id}>
                      <ActivityCard
                        activity={activity}
                        refreshActivities={fetchActivities}
                        updateGauge={updateGauge}
                      />
                      <Divider />
                    </div>
                  ))}
                </Collapse>
              </div>
            ))}
        </Collapse>
      </div>
    </List>
  );
}

export default ActivityTree;
