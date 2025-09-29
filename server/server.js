import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import taskRouter from './routes/taskRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import swaggerUi from 'swagger-ui-express';
import apiSpec from './docs/openapi.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];
app.use((req,res,next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
  })

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger setup (separate spec)
const spec = { ...apiSpec, servers: [{ url: 'http://localhost:' + port }] };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// API Endpoints
app.get('/', (req, res) => res.send("API WORKING"));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/admin', adminRouter);

app.listen(port, () => console.log(`Server started on PORT:${port}`));