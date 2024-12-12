
const router = require('express').Router();
const db = require('../db/dbConnection'); // Import database connection
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Get all habit templates for a user
router.get('/', authMiddleware, (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated request
    db.all(`
        SELECT h.name, h.is_global, uht.day_of_week
        FROM UserHabitTemplate uht
        JOIN UserHabitTemplateDetails uhtd ON uht.id = uhtd.template_id
        JOIN Habit h ON uhtd.habit_id = h.id
        WHERE uht.user_id = ?
        ORDER BY uht.day_of_week
    `, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Group habits by day_of_week
        const groupedByDay = rows.reduce((acc, row) => {
            if (!acc[row.day_of_week]) acc[row.day_of_week] = [];
            acc[row.day_of_week].push({
                name: row.name,
                is_global: row.is_global
            });
            return acc;
        }, {});

        res.json(groupedByDay);
    });
});

// Get habits for a specific day (0-6) for a user
router.get('/:day', authMiddleware, (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated request
    const day = parseInt(req.params.day, 10);  // Ensure 'day' is an integer

    // Validate that 'day' is between 0 and 6
    if (isNaN(day) || day < 0 || day > 6) {
        return res.status(400).json({ error: "Invalid day. Day must be between 0 and 6." });
    }

    db.all(`
        SELECT h.name, h.is_global
        FROM UserHabitTemplate uht
        JOIN UserHabitTemplateDetails uhtd ON uht.id = uhtd.template_id
        JOIN Habit h ON uhtd.habit_id = h.id
        WHERE uht.user_id = ? AND uht.day_of_week = ?
    `, [userId, day], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get available habits to add to a specific day's template
router.get('/:day/availablehabits', authMiddleware, (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated request
    const day = req.params.day;

    db.all(`
        SELECT h.id, h.name, h.is_global
        FROM Habit h
        LEFT JOIN UserHabitTemplateDetails uhtd ON h.id = uhtd.habit_id AND uhtd.template_id IN (
            SELECT id FROM UserHabitTemplate WHERE user_id = ? AND day_of_week = ?
        )
        WHERE uhtd.habit_id IS NULL and (h.is_global=1 or h.user_id =?)
    `, [userId, day,userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add habit to a specific day's template
router.post('/:day/addhabit', authMiddleware, (req, res) => {
    const userId = req.user.id;  
    const day = req.params.day;
    const habitId = req.body.habit_id;  // Expecting a single habit_id

    if (!habitId) {
        return res.status(400).json({ error: "habit_id is required" });
    }

    // Ensure the habit is either global or available for the user to add
    db.get(`
        SELECT id FROM Habit 
        WHERE id = ? AND (is_global = 1 OR user_id = ? AND id NOT IN (
            SELECT habit_id 
            FROM UserHabitTemplateDetails
            WHERE template_id IN (
                SELECT id FROM UserHabitTemplate 
                WHERE user_id = ? AND day_of_week = ?
            )
        ))
    `, [habitId, userId, userId, day], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!row) {
            return res.status(400).json({ error: "The habit ID is invalid or not available for this user" });
        }

        // Add the valid habit to the template
        db.run(`
            INSERT INTO UserHabitTemplateDetails (template_id, habit_id)
            SELECT id, ? FROM UserHabitTemplate WHERE user_id = ? AND day_of_week = ?
        `, [habitId, userId, day], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Habit added to template' });
        });
    });
});

// Delete a habit from a user's template for a given day
router.delete('/:day/delete/:habit_id', authMiddleware, (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated request
    const day = req.params.day;
    const habitId = req.params.habit_id;

    db.run(`
        DELETE FROM UserHabitTemplateDetails
        WHERE template_id IN (
            SELECT id FROM UserHabitTemplate WHERE user_id = ? AND day_of_week = ?
        ) AND habit_id = ?
    `, [userId, day, habitId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Habit deleted from template' });
    });
});

module.exports = router;
