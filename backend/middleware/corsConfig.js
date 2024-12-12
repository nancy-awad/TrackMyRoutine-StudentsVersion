//ce fichier corsConfig vous permet de requeter votre backend depuis votre frontend quand ces deux sont configurés sur diffrenets serveurs/ ports
//sinon: si vous allez configurer le frontend et backend sur le meme serveur et port vous n'avez pas besoin du cors

const cors = require('cors');

// Environment variable to define the frontend URL if it's different from the backend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const corsConfig = {
    origin: (origin, callback) => {
        // If origin is not specified (like in Postman or no origin), allow it
        if (!origin) {
            return callback(null, true);
        }

        // Allow requests from the same origin (frontend and backend on the same domain/port)
        // or from the frontend URL
        if (origin === FRONTEND_URL || origin === BACKEND_URL) {
            return callback(null, true);
        }

        // Otherwise, reject the request
        callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    credentials: true // Allow cookies and other credentials
};

module.exports = cors(corsConfig);
