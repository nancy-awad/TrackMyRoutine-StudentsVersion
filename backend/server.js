// This file is the main entry point of  our application

// 1. Load environment variables using `dotenv` (if you use it)
const dotenv = require('dotenv').config(); //Load environment variables
if(dotenv.error){
    console.error('Error loading.env file:', dotenv.error),
    process.exit(1);
}
//Now the environment variables are already available to be accessed via process.env.


// 2. Import dependencies == external modules
const express = require('express');
const bodyParser = require('body-parser');

//3. Create the connection with the DB if needed in the APIs defined in this file 
//(The code is in dbConnection so we have to import the file)
// const db = require('../db/dbConnection'); 

// 3. Impport Your route files 
const authRoutes = require('./routes/authRoutes.js');
const personalHabitsRoutes = require('./routes/personalHabitsRoutes.js')
const habitTemplatesRoutes = require('./routes/habitTemplatesRoutes.js');
const dailyHabitsTrackingRoutes = require('./routes/dailyTrackingRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const corsMiddleware = require('./middleware/corsConfig.js');

// 4. Initialize the app
const app = express();

// 5. Apply corsMiddleware
app.use(corsMiddleware);
app.use(express.json()); // Parse incoming JSON requests

// 6. define routes
//This is your home page (static - no code - no authentication)
app.get('/', (req, res) => {
    res.send('Welcome to the Habit Tracker API!');
});


// 7. Use the routes defined in the modules == internal modules
app.use('/auth', authRoutes); 
app.use('/habits', personalHabitsRoutes);
app.use('/templates', habitTemplatesRoutes);
app.use('/dailyTrack', dailyHabitsTrackingRoutes);
app.use('/reports', reportRoutes);


// 8. Start the server
const PORT = process.env.PORT || 4000; // Set the port from environment variables or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





