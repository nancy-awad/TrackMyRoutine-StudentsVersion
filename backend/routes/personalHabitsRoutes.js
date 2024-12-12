// Define Personal Habits:

// GET /habits/personal :Get the List of the personal habits
// POST /habits/personal/new : Permet à l'utilisateur de créer une nouvelle habitude (qui est privée, elle ne doit pas apparaitre aux autres utilisateurs)
// PUT /habits/personal/:id : Update the name of a certain personal hbait (a user cannot update the name of a habit that is gloabal or created by another user)
// DELETE /habits/personal/:id : A user can only delete habits that are personal

const router = require('express').Router();
const db = require('../db/dbConnection'); // Import database connection
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

router.get('/personal', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const query = `SELECT id, name FROM Habit WHERE user_id = ? AND is_global = 0`;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error retrieving personal habits:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.json({
            message: 'Personal habits retrieved successfully.',
            habits: rows,
        });
    });
});

router.post('/personal/new', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Habit name is required and must be a non-empty string.' });
    }

    const query = `INSERT INTO Habit (name, is_global, user_id) VALUES (?, 0, ?)`;

    db.run(query, [name.trim(), userId], function (err) {
        if (err) {
            console.error('Error creating personal habit:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(201).json({
            message: 'Personal habit created successfully.',
            habit: { id: this.lastID, name: name.trim() },
        });
    });
});

router.put('/personal/:id', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const habitId = req.params.id;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Habit name is required and must be a non-empty string.' });
    }

    const query = `
        UPDATE Habit
        SET name = ?
        WHERE id = ? AND user_id = ? AND is_global = 0
    `;

    db.run(query, [name.trim(), habitId, userId], function (err) {
        if (err) {
            console.error('Error updating personal habit:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Personal habit not found or not authorized to update.' });
        }

        res.json({ message: 'Personal habit updated successfully.' });
    });
});

router.delete('/personal/:id', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const habitId = req.params.id;

    const query = `
        DELETE FROM Habit
        WHERE id = ? AND user_id = ? AND is_global = 0
    `;

    db.run(query, [habitId, userId], function (err) {
        if (err) {
            console.error('Error deleting personal habit:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Personal habit not found or not authorized to delete.' });
        }

        res.json({ message: 'Personal habit deleted successfully.' });
    });
});

module.exports = router;
