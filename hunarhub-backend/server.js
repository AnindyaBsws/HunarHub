// 🔥 FIX: load environment variables (required for Docker/Prisma)
import "dotenv/config";

import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from './src/routes/user.routes.js';
import userProfileRoutes from './src/routes/userProfile.routes.js';
import entrepreneurProfileRoutes from './src/routes/entrepreneurProfile.routes.js';

import serviceRoutes from './src/routes/service.routes.js';
import requestRoutes from './src/routes/request.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import categoryRoutes from "./src/routes/category.routes.js";

import { startCleanupJob } from "./src/utils/cleanupRequests.js";

const app = express();

// 🔥 FIX: dynamic CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ❌ TEMP DISABLED (causing crash during startup)
// startCleanupJob(); // 🔥 COMMENTED FOR DEBUG

// ---------------- ROUTES ----------------

app.use('/api/users', userRoutes);

app.use('/api/user', userProfileRoutes);
app.use('/api/entrepreneur', entrepreneurProfileRoutes);

app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/categories", categoryRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Hello, Express Js Server!');
});

export default app;