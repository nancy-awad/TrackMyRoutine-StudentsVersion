
const router = require('express').Router();
const db = require('../db/dbConnection'); // Import database connection
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware


// GET reports/monthly/:date ==> Get a monthly report for a user
router.get('/monthly/:date', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const date = req.params.date; // Expected format: YYYY-MM

    const startOfMonth = `${date}-01`; // Start of the month (first day)
    const endOfMonth = `${date}-31`; // End of the month (last day)

    db.all(`
        SELECT h.name AS habit_name,
               COUNT(*) AS total_tasks,
               SUM(CASE WHEN uhtd.is_completed = 1 THEN 1 ELSE 0 END) AS completed_tasks
        FROM UserHabitTracking uht
        JOIN UserHabitTrackingDetails uhtd ON uht.id = uhtd.tracking_id
        JOIN Habit h ON uhtd.habit_id = h.id
        WHERE uht.user_id = ? AND uht.date BETWEEN ? AND ?
        GROUP BY h.name
    `, [userId, startOfMonth, endOfMonth], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Calculate total tasks and completed tasks for overall completion rate
        const totalTasks = rows.reduce((acc, row) => acc + row.total_tasks, 0);
        const completedTasks = rows.reduce((acc, row) => acc + row.completed_tasks, 0);
        const completionRate = totalTasks === 0 ? 0 : completedTasks / totalTasks;

        // Format result for each habit
        const habitDetails = rows.reduce((acc, row) => {
            acc[row.habit_name] = {
                completed: row.completed_tasks,
                total: row.total_tasks
            };
            return acc;
        }, {});

        // Build the response data
        const reportData = {
            month: date,
            total_tasks: totalTasks,
            completed_tasks: completedTasks,
            completion_rate: completionRate,
            habits: habitDetails
        };

        res.json(reportData);
    });
});

module.exports = router;