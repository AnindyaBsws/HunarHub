![License](https://img.shields.io/badge/license-MIT-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-black)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Status](https://img.shields.io/badge/status-Production--Ready-success)

# 🚀 HunarHub — Full-Stack Local Services Marketplace

> A production-ready platform that connects **local professionals with clients**, enabling users to **hire skilled experts or get hired based on their skills**.

---

## 🚀 Live System

- 🌐 Frontend: https://hunar-hub-weld.vercel.app  
- 🔗 Backend API: https://hunarhub-63ty.onrender.com  

---

## 🎥 Demo

*Will be added later*

---

## 🔥 Highlights

- Built a full-stack marketplace with real-world deployment  
- Designed relational data models using Prisma + PostgreSQL  
- Implemented JWT-based authentication system  
- Solved production issues (Render cold start, DB connectivity)  
- Structured backend with scalable API design  

---

## 🚀 Why This Project Stands Out

- Built under real production constraints (Render free tier)  
- Handles cold start, DB connectivity, and deployment issues  
- Combines full-stack engineering + system design thinking  
- Designed with scalability and maintainability in mind  

---

## 📊 Key Metrics

- ⚡ Fast API-driven interactions  
- 🔐 Secure authentication system  
- 📦 Modular backend architecture  
- 🚀 Fully deployed across Vercel + Render + Supabase  

---

## 🧠 Problem Statement

Finding reliable local professionals is still inefficient.

Users struggle with:
- Discovering trusted local experts  
- Showcasing their own skills  
- Connecting demand with the right talent  

HunarHub solves this by creating a structured marketplace for local services.

---

## ⚡ Core Features

### 👥 User & Profile System

- Secure signup/login using JWT  
- Entrepreneur profile creation  
- Availability status management  

---

### 🛠️ Service Marketplace

- Create and manage services  
- Browse services by category  
- Structured service listings  

---

### 📩 Request System

- Send service requests  
- Accept / reject workflows  
- Status tracking for requests  

---

### ⭐ Review System

- Add ratings and reviews  
- Link reviews to completed requests  
- Maintain service credibility  

---

### 🧩 Category & Experience System

- Categorized skills and services  
- Experience tracking per profile  
- Structured relational mapping  

---

## 🏗️ System Design

Frontend (React + Vite)  
↓  
Axios API Layer  
↓  
Node.js + Express Backend (JWT Auth)  
↓  
PostgreSQL (Supabase + Prisma ORM)

---

## 🧩 Tech Stack

- React + Vite + Tailwind CSS  
- Node.js + Express.js  
- PostgreSQL (Supabase)  
- Prisma ORM  
- Deployment: Vercel + Render  

---

## 🧪 Engineering Challenges

### Database Connectivity Issues
Resolved connection pooling vs direct connection conflicts and SSL requirements.

### Cold Start Problem
Handled backend wake-up delays on Render free tier.

### Prisma Migration Issues
Implemented safe migration flow across environments.

### API & State Synchronization
Ensured consistent backend state across requests and UI.

---

## 📈 Scalability

- Stateless backend using JWT  
- Clean relational database schema  
- Modular API structure  
- Ready for caching and microservices expansion  

---

## 🧪 Local Setup

### Backend

cd hunarhub-backend  
npm install  

npx prisma generate  
npx prisma db push  

npm run dev  

### Frontend

cd hunarhub-frontend  
npm install  
npm run dev  

### Seed Database

npx prisma db seed  

---

## 👨‍💻 Author

**Anindya Biswas**

- LinkedIn: https://linkedin.com/in/anindya-biswas-472897219/  
- GitHub: https://github.com/AnindyaBsws  

---

## 🚀 Future Improvements

- API documentation section  
- Architecture diagram image  
- Feature screenshots  

---

> This project is designed to reflect **real-world engineering skills, system design thinking, and production-level problem solving.**
