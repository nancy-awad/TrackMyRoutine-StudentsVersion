//Authentication routes
// Endpoints You Might Need
// POST /auth/signup: To handle new user registration.
// POST /auth/login: To authenticate users and return a token.
// POST /auth/logout : To handle token invalidation.
// GET /auth/me (Optional): To fetch authenticated user details using a token.

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection'); // Import database connection
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Secret key for JWT (from .env file)
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// POST /auth/signup - Register a new user
// When a user sign up for the first time - His templates are created yet empty in terms of habit per day
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Step 1: Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 2: Insert the user into the User table
        const insertUserQuery = `INSERT INTO User (username, password) VALUES (?, ?)`;
        db.run(insertUserQuery, [username, hashedPassword], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            const userId = this.lastID; // Get the ID of the newly created user

            // Step 3: Initialize templates for all days of the week (0–6)
            const insertTemplateQuery = `
                INSERT INTO UserHabitTemplate (user_id, day_of_week)
                VALUES (?, ?)
            `;
            
            const templatePromises = Array.from({ length: 7 }, (_, day) => {
                return new Promise((resolve, reject) => {
                    db.run(insertTemplateQuery, [userId, day], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            Promise.all(templatePromises)
                .then(() => {
                    res.status(201).json({ message: 'User created and templates initialized successfully.' });
                })
                .catch((err) => {
                    console.error('Error initializing templates:', err.message);
                    res.status(500).json({ error: 'Internal server error.' });
                });
        });
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// POST /auth/login - Login and generate JWT, but check if already logged in
router.post('/login', (req, res) => {
    // If the user is already authenticated (token is valid), return a message
    if (req.user) {
        return res.status(400).json({ error: 'You are already logged in.' });
    }

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Query the database for the user
    const query = `SELECT * FROM User WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error('Error querying the database:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Invalid username.' });
        }

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            // Generate a JWT
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
                expiresIn: '1h', // Token expiration time
            });

            // Send the token back to the client
            res.json({ message: 'Login successful!', token });
        });
    });
});


// POST /auth/logout - Logout and invalidate token (client-side)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful. Please discard the token on the client side.' });
});

// GET /auth/me - Get details of the authenticated user
router.get('/me', authMiddleware, (req, res) => {
    const userId = req.user.id; // User ID from the JWT token payload

    const query = `SELECT id, username FROM User WHERE id = ?`;
    db.get(query, [userId], (err, user) => {
        if (err) {
            console.error('Error querying the database:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ id: user.id, username: user.username });
    });
});

module.exports = router;