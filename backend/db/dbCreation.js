const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./backend/db/habitTracker.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Base de données connectée avec succès.');
        initializeTables();
    }
});

function initializeTables() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Habit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                is_global INTEGER DEFAULT 1,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES User (id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS UserHabitTemplate (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
                FOREIGN KEY (user_id) REFERENCES User (id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS UserHabitTemplateDetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_id INTEGER NOT NULL,
                habit_id INTEGER NOT NULL,
                FOREIGN KEY (template_id) REFERENCES UserHabitTemplate (id),
                FOREIGN KEY (habit_id) REFERENCES Habit (id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS UserHabitTracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (user_id) REFERENCES User (id),
                UNIQUE(user_id, date)
            )
        `);
        
        db.run(`
            CREATE TABLE IF NOT EXISTS UserHabitTrackingDetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tracking_id INTEGER NOT NULL,
                habit_id INTEGER NOT NULL,
                is_completed INTEGER DEFAULT 0,
                FOREIGN KEY (tracking_id) REFERENCES UserHabitTracking (id),
                FOREIGN KEY (habit_id) REFERENCES Habit (id),
                UNIQUE(tracking_id, habit_id)
            )
        `);

    console.log('Tables créées avec succès.');
    });
}

module.exports = db;
