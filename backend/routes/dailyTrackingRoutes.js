const router = require('express').Router();
const db = require('../db/dbConnection'); // Import database connection
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Utility function to get day of the week from a date string (YYYY-MM-DD)
function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    return date.getDay(); // Returns a number between 0 (Sunday) and 6 (Saturday)
}

// POST /dailyTrack/new/:date ==> Create a new habit tracking for the day
// http://localhost:4000/dailyTrack/new/2024-10-12
router.post('/new/:date', authMiddleware, (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated request
    const date = req.params.date; // The date parameter passed in the route
    const dayOfWeek = getDayOfWeek(date); // Get the day of the week (0-6)

    // Check if a tracking already exists for this date
    db.get(`
        SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?
    `, [userId, date], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            return res.status(400).json({ error: 'Habit tracking already exists for this date' });
        }

        // Load the user's template for the given day (dayOfWeek)
        db.all(`
            SELECT h.id, h.name
            FROM UserHabitTemplate uht
            JOIN UserHabitTemplateDetails uhtd ON uht.id = uhtd.template_id
            JOIN Habit h ON uhtd.habit_id = h.id
            WHERE uht.user_id = ? AND uht.day_of_week = ?
        `, [userId, dayOfWeek], (err, habits) => {
            if (err) return res.status(500).json({ error: err.message });

            // Create the new tracking entry
            db.run(`
                INSERT INTO UserHabitTracking (user_id, date)
                VALUES (?, ?)
            `, [userId, date], function (err) {
                if (err) return res.status(500).json({ error: err.message });

                // Insert the habits with default "not completed" status
                const placeholders = habits.map(() => '(?, ?, ?)').join(',');
                const values = habits.flatMap(habit => [this.lastID, habit.id, 0]); // 0 means not completed

                db.run(`
                    INSERT INTO UserHabitTrackingDetails (tracking_id, habit_id, is_completed)
                    VALUES ${placeholders}
                `, values, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Daily habit tracking created successfully' });
                });
            });
        });
    });
});

// GET /dailyTrack/:date ==> Get the habit tracking for a specific day
router.get('/:date', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date;
    const dayOfWeek = getDayOfWeek(date); // Get the day of the week (0-6)

    // Fetch the user's habit tracking for the given date
    db.all(`
        SELECT h.name, h.is_global, uhtd.is_completed
        FROM UserHabitTracking ut
        JOIN UserHabitTrackingDetails uhtd ON ut.id = uhtd.tracking_id
        JOIN Habit h ON uhtd.habit_id = h.id
        WHERE ut.user_id = ? AND ut.date = ?
    `, [userId, date], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// // PUT /dailyTrack/:date ==> Update the tracking for a specific day (completed/not completed)
// router.put('/:date', authMiddleware, (req, res) => {
//     const userId = req.user.id;
//     const date = req.params.date;
//     const dayOfWeek = getDayOfWeek(date); // Get the day of the week (0-6)
//     const { habitsStatus } = req.body; // Expected format: [{ habit_id: 1, is_completed: 1 }, ...]

//     // Update the completion status of each habit for the given day
//     const updates = habitsStatus.map(h => {
//         return new Promise((resolve, reject) => {
//             db.run(`
//                 UPDATE UserHabitTrackingDetails
//                 SET is_completed = ?
//                 WHERE tracking_id IN (
//                     SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?
//                 ) AND habit_id = ?
//             `, [h.is_completed, userId, date, h.habit_id], function (err) {
//                 if (err) reject(err);
//                 resolve();
//             });
//         });
//     });

//     Promise.all(updates)
//         .then(() => res.status(200).json({ message: 'Habit tracking updated successfully' }))
//         .catch(err => res.status(500).json({ error: err.message }));
// });

// DELETE /dailyTrack/:date ==> Delete the habit tracking for a specific day
router.delete('/:date', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date;

    // Delete the tracking for the given date
    db.run(`
        DELETE FROM UserHabitTrackingDetails WHERE tracking_id IN (
            SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?
        )
    `, [userId, date], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(`
            DELETE FROM UserHabitTracking WHERE user_id = ? AND date = ?
        `, [userId, date], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Habit tracking deleted successfully' });
        });
    });
});
// POST /dailyTrack/:date/habits ==> Add a habit to the day's tracking
router.post('/:date/habits', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date;
    const { habitId } = req.body;

    db.get(
        `SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?`,
        [userId, date],
        (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'No tracking data found for the specified date' });
            }

            db.run(
                `INSERT INTO UserHabitTrackingDetails (tracking_id, habit_id) VALUES (?, ?)`,
                [row.id, habitId],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to add habit to tracking', details: err.message });
                    }
                    res.status(201).json({ message: 'Habit added successfully', trackingDetailId: this.lastID });
                }
            );
        }
    );
});


// DELETE /dailyTrack/:date/habits/:habit_id ==> Remove a habit from the day's tracking
router.delete('/:date/habits', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date;
    const habitId = req.body.habit_id;

    // Remove the habit from the tracking
    db.run(`
        DELETE FROM UserHabitTrackingDetails WHERE tracking_id IN (
            SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?
        ) AND habit_id = ?
    `, [userId, date, habitId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Habit removed from daily tracking' });
    });
});

// PUT /dailyTrack/:date/habits/:habit_id ==> Update the completion status of a habit for the day
router.put('/:date/habits', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date;
    const habitId = req.body.habit_id;
    const isCompleted = req.body.is_completed;

    // Update the completion status of the habit for the given day
    db.run(`
        UPDATE UserHabitTrackingDetails
        SET is_completed = ?
        WHERE tracking_id IN (
            SELECT id FROM UserHabitTracking WHERE user_id = ? AND date = ?
        ) AND habit_id = ?
    `, [isCompleted ? 1 : 0, userId, date, habitId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Habit status updated successfully' });
    });
});

module.exports = router;
