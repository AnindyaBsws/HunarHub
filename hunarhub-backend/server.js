import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from './src/routes/user.routes.js';
import serviceRoutes from './src/routes/service.routes.js';
import requestRoutes from './src/routes/request.routes.js';
import reviewRoutes from './src/routes/review.routes.js';

// ✅ FIRST create app
const app = express();

// ✅ THEN middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ✅ THEN routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);

// ✅ test route
app.get('/', (req, res) => {
  res.send('Hello, Express Js Server!');
});

export default app;