# 🚀 HunarHub

A full-stack platform to connect local professionals with clients — enabling users to hire skilled experts or get hired based on their skills.

🌐 Live Demo: https://hunar-hub-weld.vercel.app/

---

## 📌 Features

- 🔍 Discover local professionals by category  
- 🧑‍💼 Create and manage entrepreneur profiles  
- 💼 Offer services and receive requests  
- ⭐ Review and rating system  
- 🔐 Secure authentication with JWT  
- 📊 Structured backend with relational database  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Supabase)

### ORM
- Prisma

### Deployment
- Frontend: Vercel  
- Backend: Render  

---

## ⚙️ System Architecture

text Frontend (Vercel)         ↓ Backend API (Render)         ↓ PostgreSQL (Supabase) 

---

## 🚀 Getting Started

### 1. Clone the repository

bash git clone https://github.com/AnindyaBsws/HunarHub.git cd HunarHub 

---

### 2. Backend setup

bash cd hunarhub-backend npm install 

Create .env file:

env DATABASE_URL=your_database_url JWT_SECRET=your_secret REFRESH_SECRET=your_secret CLIENT_URL=http://localhost:5173 

Run migrations:

bash npx prisma db push npx prisma generate 

Start server:

bash npm run dev 

---

### 3. Frontend setup

bash cd hunarhub-frontend npm install npm run dev 

---

## 🌱 Database Seeding

bash npx prisma db seed 

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Anindya Biswas

- LinkedIn: https://linkedin.com/in/anindya-biswas-472897219/
- GitHub: https://github.com/AnindyaB
