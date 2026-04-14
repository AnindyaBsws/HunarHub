import express from 'express';
import userRoutes from './src/routes/user.routes.js';

const app = express();
const port = 8000;


app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req,res) => {
    res.send('Hello, Express Js Server!')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});