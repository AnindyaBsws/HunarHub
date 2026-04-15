import express from 'express';
import userRoutes from './src/routes/user.routes.js';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req,res) => {
    res.send('Hello, Express Js Server!')
});

export default app;