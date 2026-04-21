import app from './server.js';

// 🔥 FIX: use dynamic PORT for production (Render)
const port = process.env.PORT || 8000; // ✅ CHANGED

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});