import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/Route.js';
import SocketHandler from './SocketHandler.js';


// config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// configure CORS: allow specific frontend in production or all in development
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Log preflight requests for debugging
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        console.log('Preflight request:', req.method, req.path, 'Origin:', req.headers.origin, 'AC-Request-Headers:', req.headers['access-control-request-headers']);
    }
    next();
});

// Build cors options: if FRONTEND_URL is '*', allow all origins by reflecting the request origin.
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // non-browser requests
        if (FRONTEND_URL === '*') return callback(null, true);
        // allow when origin exactly matches FRONTEND_URL
        if (origin === FRONTEND_URL) return callback(null, true);
        // otherwise deny
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// make sure preflight requests are handled
app.options('*', cors(corsOptions));


app.use('', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
});

io.on("connection", (socket) =>{
    console.log("User connected");

    SocketHandler(socket);
})


// mongoose setup

const PORT = process.env.PORT || 6001;
// Default to the provided Atlas URI if MONGO_URI not set in env
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://wsec:1GU3RaFf2kCBWorQ@library.khrrfqj.mongodb.net/socialeX?retryWrites=true&w=majority';

// Serve client build in production (single-host deployment)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/build');
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
        console.log('Connected to MongoDB successfully');
        server.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });
    }
).catch((e)=> console.log(`Error in db connection ${e}`));
