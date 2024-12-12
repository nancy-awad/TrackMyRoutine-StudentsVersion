const sqlite3 = require('sqlite3').verbose();

// Establish a connection to the existing database
const db = new sqlite3.Database('./backend/db/habitTracker.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the habitTracker database.');
    }
});

module.exports = db;
