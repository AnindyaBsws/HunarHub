import express from 'express';
import userRoutes from './src/routes/user.routes.js';
import serviceRoutes from './src/routes/service.routes.js';
import requestRoutes from './src/routes/request.routes.js';
import reviewRoutes from './src/routes/review.routes.js';




import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req,res) => {
    res.send('Hello, Express Js Server!')
});

export default app;