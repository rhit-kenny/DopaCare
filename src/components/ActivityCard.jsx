import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, TextField, IconButton } from '@mui/material';
import { doc, deleteDoc, addDoc, updateDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import CalendarModal from './CalendarModal';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function ActivityCard({ activity, refreshActivities, updateGauge }) {
    const navigate = useNavigate();

    const initialDueDate = activity.dueDate ? activity.dueDate.toDate() : new Date();
    const [dueDate, setDueDate] = useState(initialDueDate);
    const formattedDueDate = dueDate.toLocaleDateString();

    const addOneDay = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    };

    const canMark = () => new Date() >= dueDate;

    const formatDate = (date) => date.toISOString().split('T')[0];

    const updateCompletionStatus = async (status) => {
        const todayStr = formatDate(new Date());
        const currentDates = activity.completionDates || {};
        const newCompletionDates = { ...currentDates, [todayStr]: status };
        await updateDoc(doc(db, "activities", activity.id), { completionDates: newCompletionDates });
    };

    const handleComplete = async () => {
        if (!canMark()) {
            alert("You have to wait until the next day to mark this activity.");
            return;
        }
        let points = 0;
        if (activity.frequency === "daily") points = 1;
        else if (activity.frequency === "weekly") points = 3;
        else if (activity.frequency === "monthly") points = 10;
        else if (activity.frequency === "yearly") points = 50;

        if (typeof updateGauge === 'function') {
            updateGauge(points);
        }

        try {
            await addDoc(collection(db, "rewards"), {
                activityId: activity.id,
                activity: activity.activity || "",
                category: activity.category,
                reward: activity.reward,
                points,
                timestamp: new Date().toISOString(),
            });
            await updateCompletionStatus("complete");
            alert(`Completed "${activity.activity}" activity. ${points} point(s) added and reward posted.`);
        } catch (error) {
            console.error("Error posting reward:", error);
            alert("Failed to post reward.");
        }

        const newDueDate = addOneDay(dueDate);
        try {
            await updateDoc(doc(db, "activities", activity.id), { dueDate: Timestamp.fromDate(newDueDate) });
            setDueDate(newDueDate);
        } catch (error) {
            console.error("Error updating due date:", error);
        }
    };

    const handleIncomplete = async () => {
        if (!canMark()) {
            alert("You have to wait until the next day to mark this activity.");
            return;
        }
        try {
            await addDoc(collection(db, "penalties"), {
                activityId: activity.id,
                activity: activity.activity || "",
                category: activity.category,
                punishment: activity.punishment,
                timestamp: new Date().toISOString(),
            });
            await updateCompletionStatus("incomplete");
            alert(`Penalty recorded for incomplete "${activity.activity}" activity.`);
        } catch (error) {
            console.error("Error recording penalty:", error);
            alert("Failed to record penalty.");
        }

        const newDueDate = addOneDay(dueDate);
        try {
            await updateDoc(doc(db, "activities", activity.id), { dueDate: Timestamp.fromDate(newDueDate) });
            setDueDate(newDueDate);
        } catch (error) {
            console.error("Error updating due date:", error);
        }
        navigate("/penalties");
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            await deleteDoc(doc(db, "activities", activity.id));
            refreshActivities();
        }
    };

    // Edit mode state.
    const [editMode, setEditMode] = useState(false);
    const [editedActivity, setEditedActivity] = useState({ ...activity });

    const handleSaveEdit = async () => {
        try {
            await updateDoc(doc(db, "activities", activity.id), {
                activity: editedActivity.activity,
                reward: editedActivity.reward,
                punishment: editedActivity.punishment,
                category: editedActivity.category,
                frequency: editedActivity.frequency,
            });
            alert("Activity updated!");
            setEditMode(false);
            refreshActivities();
        } catch (error) {
            console.error("Error updating activity:", error);
            alert("Failed to update activity.");
        }
    };

    const [openCalendar, setOpenCalendar] = useState(false);

    return (
        <Card className="mb-4" sx={{ backgroundColor: '#EEEEEE', p: 2 }}>
            <CardContent>
                {editMode ? (
                    <>
                        <TextField
                            label="Activity"
                            value={editedActivity.activity}
                            onChange={(e) => setEditedActivity({ ...editedActivity, activity: e.target.value })}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Category"
                            value={editedActivity.category}
                            onChange={(e) => setEditedActivity({ ...editedActivity, category: e.target.value })}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Reward"
                            value={editedActivity.reward}
                            onChange={(e) => setEditedActivity({ ...editedActivity, reward: e.target.value })}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Punishment"
                            value={editedActivity.punishment}
                            onChange={(e) => setEditedActivity({ ...editedActivity, punishment: e.target.value })}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Frequency"
                            value={editedActivity.frequency}
                            onChange={(e) => setEditedActivity({ ...editedActivity, frequency: e.target.value })}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                    </>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {activity.activity}
                        </Typography>
                        <Typography variant="body2">Category: {activity.category}</Typography>
                        <Typography variant="body2">Reward: {activity.reward}</Typography>
                        <Typography variant="body2">Punishment: {activity.punishment}</Typography>
                        <Typography variant="body2">Frequency: {activity.frequency}</Typography>
                        <Typography variant="body2">Due Date: {formattedDueDate}</Typography>
                    </>
                )}
            </CardContent>
            <CardActions>
                {editMode ? (
                    <IconButton size="small" onClick={handleSaveEdit} color="primary">
                        Save
                    </IconButton>
                ) : (
                    <>
                        <IconButton size="small" onClick={handleComplete} color="primary" title="Complete">
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleIncomplete} color="error" title="Incomplete">
                            <CancelIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleDelete} color="primary" title="Delete">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => setEditMode(true)} color="primary" title="Edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => setOpenCalendar(true)} color="primary" title="Calendar">
                            <CalendarTodayIcon />
                        </IconButton>
                    </>
                )}
            </CardActions>
            <CalendarModal
                open={openCalendar}
                onClose={() => setOpenCalendar(false)}
                completionDates={activity.completionDates || {}}
            />
        </Card>
    );
}

export default ActivityCard;
